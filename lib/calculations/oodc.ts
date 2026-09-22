// Cálculo de OODC – Outorga Onerosa do Direito de Construir
// Base legal: Lei nº 16.050/2014 (PDE) – Arts. 115 a 128
//             Lei nº 16.402/2016 (LPUOS)
//             Planilha OODC v1.1.0 (Lucas Batista de Moura)
//
// Lógica baseada na planilha oodc-prot-v1.1.0:
//
// Para cada lote n:
//   ca_adic_n    = ca_max_n - ca_bas_n
//   beneficio_n  = (terreno_n / soma_terreno) × [soma ponderada de áreas com CA]
//   outorga_n    = MAX(0, computavel_n - (terreno_n + beneficio_n + tdc_n + isentos_n))
//   c_n          = (terreno_n / computavel_n) × v_max × fp_n × fs_n
//   valor_n      = outorga_n × c_n
//
// Onde:
//   terreno_n    = CA_bas_n × At_n (área equivalente ao CA básico)
//   beneficio_n  = redução de área por fruição, doações, etc.
//   tdc_n        = área transferida (TDC)

import {
  EntradaOODC,
  LoteOODC,
  ResultadoLoteOODC,
  ResultadoOODC,
  BaseLegalFruicao,
  BaseLegalMelhoria,
  BaseLegalCal,
} from "../types";

// Calcula o benefício (redução de área) de um lote
// conforme a lógica da planilha OODC
function calcularBeneficio(
  lote: LoteOODC,
  proporcao_terreno: number // terreno_n / soma_terreno
): number {
  const ca_adic = lote.ca_maximo - lote.ca_basico;

  // Fruição residencial
  const beneficio_frui = calcularBeneficioFrui(
    lote.area_fruicao_residencial,
    lote.base_legal_frui,
    lote.ca_maximo,
    ca_adic
  );

  // Doação verde (CA adicional sempre)
  const beneficio_verde = lote.area_doacao_verde * ca_adic;

  // Doação melhoria viária
  const beneficio_mel = calcularBeneficioMel(
    lote.area_doacao_melhoria,
    lote.base_legal_mel,
    lote.ca_maximo,
    ca_adic
  );

  // Doação área de cálculo alternativo
  const beneficio_cal = calcularBeneficioCal(
    lote.area_doacao_cal,
    lote.base_legal_cal,
    lote.ca_maximo,
    ca_adic
  );

  const soma_areas =
    beneficio_frui + beneficio_verde + beneficio_mel + beneficio_cal;

  return proporcao_terreno * soma_areas;
}

function calcularBeneficioFrui(
  area: number,
  base: BaseLegalFruicao,
  ca_max: number,
  ca_adic: number
): number {
  if (base === 0) return 0;
  if (base === 1) return area * ca_max * 0.5;
  if (base === 2) return area * ca_adic * 0.5;
  return 0;
}

function calcularBeneficioMel(
  area: number,
  base: BaseLegalMelhoria,
  ca_max: number,
  ca_adic: number
): number {
  if (base === 0) return 0;
  if (base === 1) return area * ca_max;
  if (base === 2) return area * ca_adic;
  return 0;
}

function calcularBeneficioCal(
  area: number,
  base: BaseLegalCal,
  ca_max: number,
  ca_adic: number
): number {
  if (base === 0) return 0;
  if (base === 1) return area * ca_max;
  if (base === 2) return area * ca_adic;
  if (base === 4) return area * ca_adic;
  return 0; // base 3 = sem benefício
}

export function calcularOODC(entrada: EntradaOODC): ResultadoOODC {
  const { lotes, assunto } = entrada;

  if (lotes.length === 0) {
    return {
      lotes: [],
      totais: {
        area_computavel: 0,
        area_outorgavel: 0,
        valor_bruto: 0,
        valor_recolhido: 0,
        valor_liquido: 0,
      },
    };
  }

  // Soma dos terrenos equivalentes (CA_bas × At) para cada lote
  const terrenos = lotes.map((l) => l.ca_basico * l.area_terreno);
  const soma_terreno = terrenos.reduce((s, t) => s + t, 0);

  // Valor máximo do m² entre todos os lotes (v_max da planilha)
  const v_max = Math.max(...lotes.map((l) => l.v_terreno));

  // Calcular resultado de cada lote
  const resultados_lotes: ResultadoLoteOODC[] = lotes.map((lote, idx) => {
    const terreno_n = terrenos[idx];
    const proporcao = soma_terreno > 0 ? terreno_n / soma_terreno : 0;

    const ca_basico_area = lote.ca_basico * lote.area_terreno;
    const ca_maximo_area = lote.ca_maximo * lote.area_terreno;

    // Benefício calculado com base na proporção do terreno
    const beneficio = calcularBeneficio(lote, proporcao);

    // TDC
    const tdc = lote.area_tdc;

    // Isenções por assunto (HIS, institucional)
    const isento_area =
      assunto === "HIS" || assunto === "Institucional"
        ? lote.area_isenta_his
        : 0;

    // Área outorgável = computável - (terreno + benefício + TDC + isentos)
    const area_outorgavel = Math.max(
      0,
      lote.area_computavel - (terreno_n + beneficio + tdc + isento_area)
    );

    // Custo unitário c_n = (terreno_n / computavel_n) × v_max × fp_n × fs_n
    const c_unitario =
      lote.area_computavel > 0
        ? (terreno_n / lote.area_computavel) * v_max * lote.fp * lote.fs
        : 0;

    const valor_outorga = area_outorgavel * c_unitario;

    return {
      lote_id: lote.id,
      area_terreno: lote.area_terreno,
      ca_basico_area,
      ca_maximo_area,
      area_computavel: lote.area_computavel,
      beneficio,
      tdc,
      area_outorgavel,
      c_unitario,
      valor_outorga,
    };
  });

  // Totais
  const totais = {
    area_computavel: resultados_lotes.reduce((s, l) => s + l.area_computavel, 0),
    area_outorgavel: resultados_lotes.reduce((s, l) => s + l.area_outorgavel, 0),
    valor_bruto: resultados_lotes.reduce((s, l) => s + l.valor_outorga, 0),
    valor_recolhido: 0, // a ser informado pelo usuário (TDC já recolhido)
    valor_liquido: resultados_lotes.reduce((s, l) => s + l.valor_outorga, 0),
  };

  return { lotes: resultados_lotes, totais };
}

export function loteVazio(id: number): LoteOODC {
  return {
    id,
    area_terreno: 0,
    area_computavel: 0,
    ca_basico: 1.0,
    ca_maximo: 4.0,
    zona_id: "ZM-3a",
    tipologia_id: "R2v",
    v_terreno: 5000,
    fp: 1.0,
    fs: 0.7,
    area_fruicao_residencial: 0,
    area_doacao_verde: 0,
    area_doacao_melhoria: 0,
    area_doacao_cal: 0,
    area_tdc: 0,
    area_isenta_his: 0,
    base_legal_frui: 0,
    base_legal_mel: 0,
    base_legal_cal: 0,
  };
}
