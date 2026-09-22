// Quadro 14 – Cadastro de Valor de Terreno para fins de Outorga Onerosa
// Fonte: Anexo à Lei nº 16.050/2014 (PDE), atualizado conforme decretos municipais
// Nota: Os valores abaixo são referência; o valor atual deve ser consultado
//       no Cadastro de Valor de Terreno da PMSP vigente no momento do cálculo.
//
// Os valores são expressos em R$/m² por setor fiscal.
// Para uso na calculadora, organizamos por zona/região fiscal (simplificado).

export interface ValorReferenciaTerrenoZona {
  zona_id: string;
  zona_nome: string;
  distrito: string;
  valor_min: number;  // R$/m² - valor mínimo típico do setor
  valor_max: number;  // R$/m² - valor máximo típico do setor
  valor_referencia: number; // valor médio para uso padrão
}

// Valores de referência organizados por zona (Quadro 14 – PDE)
// Fonte: Planilha OODC e Decreto PMSP de atualização do Quadro 14
// Valores atualizados aproximados para 2024/2025

export const VALORES_REFERENCIA: ValorReferenciaTerrenoZona[] = [
  // Eixos de alta demanda
  { zona_id: "ZEU", zona_nome: "ZEU – Eixo", distrito: "Pinheiros / Itaim / Faria Lima", valor_min: 8000, valor_max: 25000, valor_referencia: 15000 },
  { zona_id: "ZEUP", zona_nome: "ZEUP – Eixo de Preservação", distrito: "Centro Histórico / Vila Madalena", valor_min: 5000, valor_max: 12000, valor_referencia: 8000 },
  { zona_id: "ZEUA", zona_nome: "ZEUA – Eixo Ambiental", distrito: "Tucuruvi / Penha", valor_min: 3000, valor_max: 8000, valor_referencia: 5000 },
  // Zonas mistas
  { zona_id: "ZM-3a", zona_nome: "ZM-3a – Mista Alta Densidade", distrito: "Perdizes / Moema / Vila Mariana", valor_min: 5000, valor_max: 18000, valor_referencia: 10000 },
  { zona_id: "ZM-3b", zona_nome: "ZM-3b – Mista Alta Densidade", distrito: "Lapa / Santo André", valor_min: 4000, valor_max: 12000, valor_referencia: 7500 },
  { zona_id: "ZM-2", zona_nome: "ZM-2 – Mista Média Densidade", distrito: "Tatuapé / Ipiranga", valor_min: 3000, valor_max: 8000, valor_referencia: 5000 },
  { zona_id: "ZM-1", zona_nome: "ZM-1 – Mista Baixa Densidade", distrito: "Periferia urbanizada", valor_min: 1500, valor_max: 5000, valor_referencia: 3000 },
  // Zonas residenciais
  { zona_id: "ZR-4", zona_nome: "ZR-4 – Residencial Alta", distrito: "Alto de Pinheiros / Jardins", valor_min: 5000, valor_max: 20000, valor_referencia: 10000 },
  { zona_id: "ZR-3", zona_nome: "ZR-3 – Residencial Média", distrito: "Vila Prudente / Jabaquara", valor_min: 2500, valor_max: 7000, valor_referencia: 4000 },
  { zona_id: "ZR-2", zona_nome: "ZR-2 – Residencial Baixa", distrito: "Periferia próxima", valor_min: 1500, valor_max: 4000, valor_referencia: 2500 },
  { zona_id: "ZR-1", zona_nome: "ZR-1 – Residencial Muito Baixa", distrito: "Periferia distante", valor_min: 800, valor_max: 2500, valor_referencia: 1500 },
  // Zona central
  { zona_id: "ZC", zona_nome: "ZC – Zona Central", distrito: "Sé / República / Santa Cecília", valor_min: 4000, valor_max: 15000, valor_referencia: 8000 },
  // ZEIS
  { zona_id: "ZEIS-1", zona_nome: "ZEIS-1 – Favelas", distrito: "Várias", valor_min: 500, valor_max: 3000, valor_referencia: 1500 },
  { zona_id: "ZEIS-2", zona_nome: "ZEIS-2 – Glebas vazias", distrito: "Várias", valor_min: 500, valor_max: 3000, valor_referencia: 1500 },
  { zona_id: "ZEIS-3", zona_nome: "ZEIS-3 – Cortiços", distrito: "Centro Expandido", valor_min: 2000, valor_max: 8000, valor_referencia: 4000 },
  { zona_id: "ZEIS-4", zona_nome: "ZEIS-4 – Imóveis públicos", distrito: "Várias", valor_min: 500, valor_max: 3000, valor_referencia: 1500 },
  { zona_id: "ZEIS-5", zona_nome: "ZEIS-5 – Vazios MZU", distrito: "Centro Expandido", valor_min: 2000, valor_max: 8000, valor_referencia: 5000 },
  // Operações Urbanas
  { zona_id: "OU-FV", zona_nome: "OU Faria Lima", distrito: "Itaim Bibi / Pinheiros", valor_min: 10000, valor_max: 30000, valor_referencia: 18000 },
  { zona_id: "OU-CE", zona_nome: "OU Centro", distrito: "Centro / Luz", valor_min: 3000, valor_max: 10000, valor_referencia: 6000 },
  { zona_id: "OU-AL", zona_nome: "OU Água Branca", distrito: "Barra Funda / Lapa", valor_min: 4000, valor_max: 12000, valor_referencia: 7000 },
];

export function getValorReferencia(zona_id: string): ValorReferenciaTerrenoZona | undefined {
  return VALORES_REFERENCIA.find((v) => v.zona_id === zona_id);
}

// Nota importante: O valor do terreno (V) para fins de outorga onerosa é
// extraído do Quadro 14 anexo à Lei 16.050/2014 com base no SETOR FISCAL
// do imóvel, não apenas pela zona de uso. Para cálculos oficiais, consultar
// o sistema Quadro14 da Prefeitura ou utilizar o InfoSolo.
export const AVISO_QUADRO14 =
  "⚠️ Os valores de terreno são referência. Para fins legais, utilize o valor do Quadro 14 vigente consultando o setor fiscal do imóvel no sistema da PMSP.";
