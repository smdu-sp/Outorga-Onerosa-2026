// Cálculo de Outorga Onerosa para Regularização de Edificações
// Base legal: Lei nº 17.202/2019 – Capítulo VII (Art. 13)
//
// Fórmula (Art. 13, §1º):
//   C = (At/Ac) × V × Fs × Fp × Fr
//
// Onde:
//   C  = contrapartida financeira por m² de potencial construtivo adicional
//   At = área de terreno (m²)
//   Ac = área construída computável total (m²)
//   V  = valor do m² do terreno (Quadro 14 – Lei 16.050/2014)
//   Fs = fator de interesse social (Quadro 16A – Lei 13.885/2004)
//   Fp = fator de planejamento (Quadro 15A – Lei 13.885/2004)
//   Fr = fator de regularização (1,2 / 0,5 / 0,0)
//
// A outorga incide sobre a área excedente ao CA básico,
// limitada ao CA máximo da zona (ou da lei específica).

import {
  EntradaRegularizacao,
  ResultadoRegularizacao,
  OpcaoParcelamento,
} from "../types";

const VALOR_MINIMO_PARCELA = 500;
const PARCELAS_MAXIMAS = 12;

export function calcularRegularizacao(
  entrada: EntradaRegularizacao
): ResultadoRegularizacao {
  const { area_terreno: at, area_computavel: ac, ca_basico, ca_maximo, v_terreno: v, fs, fp, fr, isento } = entrada;

  // Área básica e máxima em m²
  const ca_basico_area = ca_basico * at;
  const ca_maximo_area = ca_maximo * at;

  // Área excedente ao CA básico (área que seria passível de outorga)
  const area_excedente = Math.max(0, ac - ca_basico_area);

  // Área efetivamente outorgável = excedente limitado ao CA máximo
  // Acima do CA máximo, não é regularizável (precisa demolir)
  const area_outorgavel = Math.max(
    0,
    Math.min(ac, ca_maximo_area) - ca_basico_area
  );

  // Verificar isenção (Art. 13, §7º): uso institucional, religioso, creche sem fins lucrativos
  if (isento) {
    return {
      area_outorgavel: 0,
      c_unitario: 0,
      c_total: 0,
      isento: true,
      motivo_isencao:
        "Imóvel isento de outorga onerosa nos termos do Art. 13, §7º da Lei nº 17.202/2019 (uso institucional, religioso ou CEI/creche sem fins lucrativos).",
      detalhes: {
        at,
        ac,
        v,
        fs,
        fp,
        fr,
        ca_basico_area,
        ca_maximo_area,
        area_excedente,
      },
      parcelas_maximas: PARCELAS_MAXIMAS,
      valor_minimo_parcela: VALOR_MINIMO_PARCELA,
      opcoes_parcelamento: [],
    };
  }

  // Se não há área excedente, não há outorga
  if (area_outorgavel <= 0) {
    return {
      area_outorgavel: 0,
      c_unitario: 0,
      c_total: 0,
      isento: false,
      motivo_isencao:
        ac <= ca_basico_area
          ? "Área construída computável não ultrapassa o CA básico. Sem incidência de outorga onerosa."
          : undefined,
      detalhes: {
        at,
        ac,
        v,
        fs,
        fp,
        fr,
        ca_basico_area,
        ca_maximo_area,
        area_excedente,
      },
      parcelas_maximas: PARCELAS_MAXIMAS,
      valor_minimo_parcela: VALOR_MINIMO_PARCELA,
      opcoes_parcelamento: [],
    };
  }

  // Contrapartida unitária (R$/m²)
  // C = (At/Ac) × V × Fs × Fp × Fr
  const c_unitario = (at / ac) * v * fs * fp * fr;

  // Valor total da outorga
  const c_total = c_unitario * area_outorgavel;

  // Calcular opções de parcelamento (Art. 13, §2º)
  // Máximo 12 parcelas fixas mensais; valor mínimo de R$ 500/parcela
  const opcoes_parcelamento: OpcaoParcelamento[] = [];
  for (let n = 1; n <= PARCELAS_MAXIMAS; n++) {
    const valor_parcela = c_total / n;
    if (valor_parcela >= VALOR_MINIMO_PARCELA) {
      opcoes_parcelamento.push({
        n_parcelas: n,
        valor_parcela,
        valor_total: c_total,
      });
    }
  }

  return {
    area_outorgavel,
    c_unitario,
    c_total,
    isento: false,
    detalhes: {
      at,
      ac,
      v,
      fs,
      fp,
      fr,
      ca_basico_area,
      ca_maximo_area,
      area_excedente,
    },
    parcelas_maximas: PARCELAS_MAXIMAS,
    valor_minimo_parcela: VALOR_MINIMO_PARCELA,
    opcoes_parcelamento,
  };
}

// Validações de entrada
export interface ErroValidacao {
  campo: string;
  mensagem: string;
}

export function validarEntradaRegularizacao(
  entrada: Partial<EntradaRegularizacao>
): ErroValidacao[] {
  const erros: ErroValidacao[] = [];

  if (!entrada.area_terreno || entrada.area_terreno <= 0)
    erros.push({ campo: "area_terreno", mensagem: "Área do terreno deve ser maior que zero." });

  if (!entrada.area_computavel || entrada.area_computavel <= 0)
    erros.push({ campo: "area_computavel", mensagem: "Área construída computável deve ser maior que zero." });

  if (entrada.ca_basico === undefined || entrada.ca_basico < 0)
    erros.push({ campo: "ca_basico", mensagem: "CA básico inválido." });

  if (entrada.ca_maximo === undefined || entrada.ca_maximo <= 0)
    erros.push({ campo: "ca_maximo", mensagem: "CA máximo deve ser maior que zero." });

  if (entrada.ca_basico !== undefined && entrada.ca_maximo !== undefined && entrada.ca_basico > entrada.ca_maximo)
    erros.push({ campo: "ca_maximo", mensagem: "CA máximo deve ser maior ou igual ao CA básico." });

  if (!entrada.v_terreno || entrada.v_terreno <= 0)
    erros.push({ campo: "v_terreno", mensagem: "Valor do terreno (V) deve ser maior que zero." });

  if (entrada.fp === undefined || entrada.fp < 0 || entrada.fp > 1.5)
    erros.push({ campo: "fp", mensagem: "Fator de planejamento (Fp) deve estar entre 0 e 1,5." });

  if (entrada.fs === undefined || entrada.fs < 0 || entrada.fs > 1)
    erros.push({ campo: "fs", mensagem: "Fator de interesse social (Fs) deve estar entre 0 e 1." });

  return erros;
}
