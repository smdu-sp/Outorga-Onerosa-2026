"use client";
import { ResultadoOODC } from "@/lib/types";
import { formatBRL, formatArea, formatNumero } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/Card";

interface Props {
  resultado: ResultadoOODC;
}

export default function OodcResult({ resultado }: Props) {
  if (resultado.lotes.length === 0) {
    return null;
  }

  const { totais, lotes } = resultado;

  return (
    <div className="flex flex-col gap-4">
      {/* Totais */}
      <Card variant="highlight">
        <CardTitle>Resultado OODC – Plano Diretor Estratégico</CardTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500">Área Computável Total</p>
            <p className="text-lg font-bold text-gray-900">
              {formatArea(totais.area_computavel, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500">Área Outorgável Total</p>
            <p className="text-lg font-bold text-gray-900">
              {formatArea(totais.area_outorgavel, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500">Valor Bruto</p>
            <p className="text-lg font-bold text-gray-900">
              {formatBRL(totais.valor_bruto)}
            </p>
          </div>
          <div className="bg-blue-700 rounded-lg p-3 border border-blue-800">
            <p className="text-xs text-blue-200">Valor Líquido</p>
            <p className="text-lg font-bold text-white">
              {formatBRL(totais.valor_liquido)}
            </p>
          </div>
        </div>
      </Card>

      {/* Detalhamento por lote */}
      <Card>
        <CardTitle>Detalhamento por Lote</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 text-xs text-gray-500 uppercase">
                <th className="text-left pb-2 pr-4">Lote</th>
                <th className="text-right pb-2 pr-3">Área Terreno</th>
                <th className="text-right pb-2 pr-3">Área Computável</th>
                <th className="text-right pb-2 pr-3">CA Básico × At</th>
                <th className="text-right pb-2 pr-3">Benefício</th>
                <th className="text-right pb-2 pr-3">TDC</th>
                <th className="text-right pb-2 pr-3">Área Outorgável</th>
                <th className="text-right pb-2 pr-3">C Unit. (R$/m²)</th>
                <th className="text-right pb-2">Valor Outorga</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((l) => (
                <tr key={l.lote_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium text-gray-700">#{l.lote_id}</td>
                  <td className="py-2 pr-3 text-right">{formatNumero(l.area_terreno, 2)}</td>
                  <td className="py-2 pr-3 text-right">{formatNumero(l.area_computavel, 2)}</td>
                  <td className="py-2 pr-3 text-right">{formatNumero(l.ca_basico_area, 2)}</td>
                  <td className="py-2 pr-3 text-right text-green-700">{formatNumero(l.beneficio, 2)}</td>
                  <td className="py-2 pr-3 text-right text-orange-700">{formatNumero(l.tdc, 2)}</td>
                  <td className="py-2 pr-3 text-right font-semibold text-blue-700">
                    {formatNumero(l.area_outorgavel, 2)}
                  </td>
                  <td className="py-2 pr-3 text-right">{formatBRL(l.c_unitario)}</td>
                  <td className="py-2 text-right font-bold">{formatBRL(l.valor_outorga)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 font-semibold bg-gray-50">
                <td className="py-2 pr-4 text-gray-700">TOTAL</td>
                <td className="py-2 pr-3 text-right">—</td>
                <td className="py-2 pr-3 text-right">{formatNumero(totais.area_computavel, 2)}</td>
                <td className="py-2 pr-3 text-right">—</td>
                <td className="py-2 pr-3 text-right text-green-700">
                  {formatNumero(lotes.reduce((s, l) => s + l.beneficio, 0), 2)}
                </td>
                <td className="py-2 pr-3 text-right text-orange-700">
                  {formatNumero(lotes.reduce((s, l) => s + l.tdc, 0), 2)}
                </td>
                <td className="py-2 pr-3 text-right text-blue-700">
                  {formatNumero(totais.area_outorgavel, 2)}
                </td>
                <td className="py-2 pr-3 text-right">—</td>
                <td className="py-2 text-right text-blue-700">{formatBRL(totais.valor_bruto)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Legenda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="font-semibold mb-1 text-gray-800">Fórmula do custo unitário:</p>
          <code className="font-mono text-blue-700">
            C = (CA_bas × At / Ac) × V_max × Fp × Fs
          </code>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="font-semibold mb-1 text-gray-800">Área outorgável por lote:</p>
          <code className="font-mono text-blue-700">
            Ac − (CA_bas×At + Benefício + TDC)
          </code>
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <strong>Nota:</strong> Cálculo estimativo baseado na planilha OODC v1.1.0 e PDE (Lei nº 16.050/2014).
        Para fins legais, o valor é fixado no processo junto à SEL / SMUL.
      </div>
    </div>
  );
}
