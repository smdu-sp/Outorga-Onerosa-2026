import { TipologiaUso } from "../types";

// Quadro 16A – Fator de Interesse Social (Fs)
// Fonte: Lei nº 13.885/2004, Quadro 16A, atualizado pelo PDE (Lei 16.050/2014)
// e Lei de Parcelamento, Uso e Ocupação do Solo (Lei 16.402/2016)

export const TIPOLOGIAS: TipologiaUso[] = [
  // HIS - Habitação de Interesse Social
  {
    id: "HIS-1",
    codigo: "R2v-HIS1",
    descricao: "HIS 1 – Habitação de Interesse Social faixa 1 (renda até 3 SM)",
    fs: 0.0,
    categoria: "HIS",
    isento_regularizacao: false,
  },
  {
    id: "HIS-2",
    codigo: "R2v-HIS2",
    descricao: "HIS 2 – Habitação de Interesse Social faixa 2 (renda 3 a 6 SM)",
    fs: 0.0,
    categoria: "HIS",
    isento_regularizacao: false,
  },
  // HMP - Habitação de Mercado Popular
  {
    id: "HMP",
    codigo: "R2v-HMP",
    descricao: "HMP – Habitação de Mercado Popular (renda 6 a 10 SM)",
    fs: 0.3,
    categoria: "HMP",
    isento_regularizacao: false,
  },
  // Residencial
  {
    id: "R1",
    codigo: "R1",
    descricao: "R1 – Residência Unifamiliar",
    fs: 0.7,
    categoria: "Residencial",
    isento_regularizacao: false,
  },
  {
    id: "R2h",
    codigo: "R2h",
    descricao: "R2h – Residência Multifamiliar Horizontal",
    fs: 0.7,
    categoria: "Residencial",
    isento_regularizacao: false,
  },
  {
    id: "R2v",
    codigo: "R2v",
    descricao: "R2v – Residência Multifamiliar Vertical",
    fs: 0.7,
    categoria: "Residencial",
    isento_regularizacao: false,
  },
  // Não Residencial
  {
    id: "nR1",
    codigo: "nR1",
    descricao: "nR1 – Uso Não Residencial de Baixo Incômodo",
    fs: 1.0,
    categoria: "NaoResidencial",
    isento_regularizacao: false,
  },
  {
    id: "nR2",
    codigo: "nR2",
    descricao: "nR2 – Uso Não Residencial de Médio Incômodo",
    fs: 1.0,
    categoria: "NaoResidencial",
    isento_regularizacao: false,
  },
  {
    id: "nR3",
    codigo: "nR3",
    descricao: "nR3 – Uso Não Residencial de Alto Incômodo / Especial",
    fs: 1.0,
    categoria: "NaoResidencial",
    isento_regularizacao: false,
  },
  // Misto
  {
    id: "R-nR",
    codigo: "R+nR",
    descricao: "Uso Misto Residencial + Não Residencial",
    fs: 0.7,
    categoria: "Misto",
    isento_regularizacao: false,
  },
  // Institucional / Uso especial (isentos na regularização – Art. 13 §7 Lei 17.202/2019)
  {
    id: "INST-PUB",
    codigo: "Institucional Público",
    descricao: "Uso Institucional / Serviço Social sem fins lucrativos (parceria com Poder Público)",
    fs: 0.5,
    categoria: "Institucional",
    isento_regularizacao: true,
  },
  {
    id: "RELIGIOSO",
    codigo: "Uso Religioso",
    descricao: "Uso Religioso / Local de Culto (inclusive locado) – Lei 17.202/2019 Art. 13 §7",
    fs: 0.5,
    categoria: "Institucional",
    isento_regularizacao: true,
  },
  {
    id: "CEI",
    codigo: "CEI/Creche",
    descricao: "CEI / Creche conveniada com o Poder Público sem fins lucrativos",
    fs: 0.5,
    categoria: "Institucional",
    isento_regularizacao: true,
  },
  // Industrial
  {
    id: "IND",
    codigo: "Ind",
    descricao: "Industrial",
    fs: 1.0,
    categoria: "NaoResidencial",
    isento_regularizacao: false,
  },
];

export function getTipologia(id: string): TipologiaUso | undefined {
  return TIPOLOGIAS.find((t) => t.id === id);
}

export const CATEGORIAS_TIPOLOGIA = [
  "HIS",
  "HMP",
  "Residencial",
  "NaoResidencial",
  "Misto",
  "Institucional",
] as const;
