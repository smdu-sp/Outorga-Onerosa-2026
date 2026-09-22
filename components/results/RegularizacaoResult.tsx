"use client";
import { ResultadoRegularizacao } from "@/lib/types";
import { formatBRL, formatArea, formatNumero } from "@/lib/utils";
import { Card, CardTitle, CardSection } from "@/components/ui/Card";

interface Props {
  resultado: ResultadoRegularizacao;
}

function Linha({ label, valor }: { label: string; valor: string | React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-sm text-gray-600 flex-1">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{valor}</span>
    </div>
  );
}

export default function RegularizacaoResult({ resultado }: Props) {
  if (resultado.isento) {
    return (
      <Card variant="success">
        <CardTitle>Resultado do Cálculo</CardTitle>
        <div className="flex items-start gap-3 bg-green-100 border border-green-200 rounded-lg p-3">
          <span className="text-green-600 text-xl mt-0.5">✓</span>
          <div>
            <p className="font-semibold text-green-800">Imóvel Isento de Outorga Onerosa</p>
            <p className="text-sm text-green-700 mt-1">{resultado.motivo_isencao}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Base legal: Art. 13, §7º da Lei nº 17.202/2019
        </p>
      </Card>
    );
  }

  if (resultado.area_outorgavel === 0) {
    return (
      <Card variant="highlight">
        <CardTitle>Resultado do Cálculo</CardTitle>
        <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3">
          <span className="text-blue-600 text-xl mt-0.5">ℹ</span>
          <div>
            <p className="font-semibold text-blue-800">Sem Incidência de Outorga Onerosa</p>
            {resultado.motivo_isencao && (
              <p className="text-sm text-blue-700 mt-1">{resultado.motivo_isencao}</p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  const d = resultado.detalhes;

  return (
    <div className="flex flex-col gap-4">
      {/* Resultado principal */}
      <Card variant="highlight">
        <CardTitle>Resultado do Cálculo – Lei nº 17.202/2019</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">Área Sujeita à Outorga</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatArea(resultado.area_outorgavel, 2)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">Contrapartida por m²</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatBRL(resultado.c_unitario)}
            </p>
          </div>
          <div className="bg-blue-700 rounded-lg p-4 border border-blue-800">
            <p className="text-xs text-blue-200 mb-1">Valor Total da Outorga</p>
            <p className="text-2xl font-bold text-white">
              {formatBRL(resultado.c_total)}
            </p>
          </div>
        </div>
      </Card>

      {/* Memória de cálculo */}
      <Card>
        <CardTitle>Memória de Cálculo</CardTitle>
        <p className="text-xs text-gray-400 mb-3 font-mono">
          C = (At/Ac) × V × Fs × Fp × Fr
        </p>
        <Linha label="Área do terreno (At)" valor={formatArea(d.at, 2)} />
        <Linha label="Área computável total (Ac)" valor={formatArea(d.ac, 2)} />
        <Linha label="Razão At/Ac" valor={formatNumero(d.at / d.ac)} />
        <Linha label="Valor do terreno (V)" valor={`${formatBRL(d.v)} /m²`} />
        <Linha label="Fator de interesse social (Fs)" valor={formatNumero(d.fs, 2)} />
        <Linha label="Fator de planejamento (Fp)" valor={formatNumero(d.fp, 2)} />
        <Linha
          label={`Fator de regularização (Fr)`}
          valor={
            <span>
              <strong>{d.fr}</strong>
              {d.fr === 1.2 && <span className="text-xs text-gray-500 ml-1">(padrão)</span>}
              {d.fr === 0.5 && <span className="text-xs text-orange-600 ml-1">(com demolição)</span>}
              {d.fr === 0.0 && <span className="text-xs text-red-600 ml-1">(APP)</span>}
            </span>
          }
        />
        <CardSection>
          <Linha label="CA básico × At" valor={formatArea(d.ca_basico_area)} />
          <Linha label="CA máximo × At" valor={formatArea(d.ca_maximo_area)} />
          <Linha
            label="Área excedente ao CA básico"
            valor={formatArea(Math.max(0, d.ac - d.ca_basico_area))}
          />
          <Linha
            label="Área outorgável (excedente limitado ao CA máx)"
            valor={
              <span className="font-bold text-blue-700">
                {formatArea(resultado.area_outorgavel)}
              </span>
            }
          />
        </CardSection>
      </Card>

      {/* Parcelamento */}
      {resultado.opcoes_parcelamento.length > 0 && (
        <Card>
          <CardTitle>Opções de Parcelamento (Art. 13, §2º)</CardTitle>
          <p className="text-xs text-gray-500 mb-3">
            Máximo de 12 parcelas fixas mensais; valor mínimo de R$ 500,00 por parcela.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2 text-gray-600 font-medium">Parcelas</th>
                  <th className="text-right pb-2 text-gray-600 font-medium">Valor por Parcela</th>
                  <th className="text-right pb-2 text-gray-600 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {resultado.opcoes_parcelamento.map((op) => (
                  <tr key={op.n_parcelas} className="border-b border-gray-50">
                    <td className="py-2">
                      {op.n_parcelas === 1 ? "À vista" : `${op.n_parcelas}×`}
                    </td>
                    <td className="py-2 text-right font-medium">
                      {formatBRL(op.valor_parcela)}
                    </td>
                    <td className="py-2 text-right text-gray-500">
                      {formatBRL(op.valor_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Aviso legal */}
      <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <strong>Nota:</strong> Este cálculo tem caráter estimativo. O valor oficial
        da outorga onerosa será fixado pelo Município com base no processo de
        regularização protocolado. Consulte a Secretaria Municipal de Licenciamento (SEL).
        Prazo para protocolo: até 31/12/2025 (Art. 22 – Lei nº 17.202/2019, redação pela Lei nº 18.209/2024).
      </div>
    </div>
  );
}
