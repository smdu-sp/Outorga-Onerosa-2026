// ============================================================
// TIPOS COMPARTILHADOS
// ============================================================

export type Modo = "simplificado" | "avancado";
export type TipoCalculo = "regularizacao" | "oodc";

// ------ DADOS DE REFERÊNCIA ------

export interface Zona {
  id: string;
  nome: string;
  descricao: string;
  ca_basico: number;
  ca_maximo: number;
  fp: number;
  grupo: string; // Ex: "Residencial", "Mista", "Central", "Eixo"
}

export interface TipologiaUso {
  id: string;
  codigo: string;
  descricao: string;
  fs: number;
  categoria: "HIS" | "HMP" | "Residencial" | "NaoResidencial" | "Misto" | "Institucional";
  isento_regularizacao?: boolean;
}

// ------ FORMULÁRIO REGULARIZAÇÃO (Lei 17.202/2019) ------

export interface EntradaRegularizacao {
  // Identificação
  sql?: string;
  endereco?: string;

  // Área
  area_terreno: number;           // At (m²)
  area_computavel: number;        // Ac total (m²)
  area_regularizar: number;       // área objeto de regularização (m²)

  // Parâmetros urbanísticos
  zona_id: string;
  ca_basico: number;              // CA básico da zona
  ca_maximo: number;              // CA máximo da zona (ou lei específica)

  // Valores dos fatores
  v_terreno: number;              // V - valor do m² do terreno (Quadro 14)
  fp: number;                     // Fator de planejamento (Quadro 15A)
  fs: number;                     // Fator de interesse social (Quadro 16A)
  fr: FatorRegularizacao;         // Fator de regularização

  // Uso
  tipologia_id: string;
  isento?: boolean;               // imóvel isento (institucional, religioso, etc.)

  // Modo
  modo: Modo;
}

export type FatorRegularizacao = 1.2 | 0.5 | 0.0;

export interface ResultadoRegularizacao {
  area_outorgavel: number;        // área sujeita à outorga (m²)
  c_unitario: number;             // contrapartida por m² (R$/m²)
  c_total: number;                // contrapartida total (R$)
  isento: boolean;
  motivo_isencao?: string;
  detalhes: {
    at: number;
    ac: number;
    v: number;
    fs: number;
    fp: number;
    fr: number;
    ca_basico_area: number;       // CA básico × At
    ca_maximo_area: number;       // CA máximo × At
    area_excedente: number;       // Ac - CA_bas × At
  };
  // Parcelamento
  parcelas_maximas: 12;
  valor_minimo_parcela: 500;
  opcoes_parcelamento: OpcaoParcelamento[];
}

export interface OpcaoParcelamento {
  n_parcelas: number;
  valor_parcela: number;
  valor_total: number;
}

// ------ FORMULÁRIO OODC - PLANO DIRETOR ------

export interface LoteOODC {
  id: number;
  // Áreas do lote
  area_terreno: number;           // At (m²) - área do terreno
  area_computavel: number;        // Ac total computável prevista (m²)

  // Coeficientes
  ca_basico: number;
  ca_maximo: number;

  // Fatores
  zona_id: string;
  tipologia_id: string;
  v_terreno: number;              // V (R$/m²)
  fp: number;
  fs: number;

  // Benefícios (reduções na área outorgável)
  area_fruicao_residencial: number;    // área de fruição residencial
  area_doacao_verde: number;           // área doação verde (Fp aplicado)
  area_doacao_melhoria: number;        // área doação de melhoria viária
  area_doacao_cal: number;             // área doação (cálculo alternativo)
  area_tdc: number;                    // TDC (Transferência Direito de Construir)
  area_isenta_his: number;             // área isenta HIS

  // Base legal para cada tipo de área
  base_legal_frui: BaseLegalFruicao;
  base_legal_mel: BaseLegalMelhoria;
  base_legal_cal: BaseLegalCal;
}

export type BaseLegalFruicao = 0 | 1 | 2;  // 0=não aplica, 1=CA_max, 2=CA_adic
export type BaseLegalMelhoria = 0 | 1 | 2; // 0=não aplica, 1=CA_max, 2=CA_adic
export type BaseLegalCal = 0 | 1 | 2 | 3 | 4; // conforme planilha

export interface EntradaOODC {
  modo: Modo;
  assunto: AssuntoOODC;
  lotes: LoteOODC[];
}

export type AssuntoOODC =
  | "Novo"
  | "Acrescimo"
  | "Regularizacao"
  | "HIS"
  | "HMP"
  | "Institucional";

export interface ResultadoLoteOODC {
  lote_id: number;
  area_terreno: number;
  ca_basico_area: number;
  ca_maximo_area: number;
  area_computavel: number;
  beneficio: number;
  tdc: number;
  area_outorgavel: number;       // área que efetivamente paga outorga
  c_unitario: number;            // custo por m²
  valor_outorga: number;         // R$
}

export interface ResultadoOODC {
  lotes: ResultadoLoteOODC[];
  totais: {
    area_computavel: number;
    area_outorgavel: number;
    valor_bruto: number;
    valor_recolhido: number;     // já pago (TDC etc)
    valor_liquido: number;
  };
}
