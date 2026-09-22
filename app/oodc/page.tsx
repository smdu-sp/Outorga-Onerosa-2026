"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ZonaSelector from "@/components/forms/ZonaSelector";
import TipologiaSelector from "@/components/forms/TipologiaSelector";
import OodcResult from "@/components/results/OodcResult";
import { Card, CardTitle, CardSection } from "@/components/ui/Card";
import { calcularOODC, loteVazio } from "@/lib/calculations/oodc";
import { EntradaOODC, LoteOODC, ResultadoOODC, Modo, AssuntoOODC } from "@/lib/types";
import { formatBRL, formatArea } from "@/lib/utils";

const MAX_LOTES = 7;

function LoteForm({
  lote,
  index,
  modo,
  onChange,
  onRemove,
  podeRemover,
}: {
  lote: LoteOODC;
  index: number;
  modo: Modo;
  onChange: (l: LoteOODC) => void;
  onRemove: () => void;
  podeRemover: boolean;
}) {
  function set<K extends keyof LoteOODC>(key: K, value: LoteOODC[K]) {
    onChange({ ...lote, [key]: value });
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <CardTitle className="mb-0">Lote #{lote.id}</CardTitle>
        {podeRemover && (
          <button
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 border border-red-200 rounded"
          >
            Remover
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Áreas */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Área do Terreno (At)"
            type="number"
            step="1"
            min={0}
            value={lote.area_terreno || ""}
            onChange={(e) => set("area_terreno", parseFloat(e.target.value) || 0)}
            unit="m²"
            required
          />
          <Input
            label="Área Computável (Ac)"
            type="number"
            step="1"
            min={0}
            value={lote.area_computavel || ""}
            onChange={(e) => set("area_computavel", parseFloat(e.target.value) || 0)}
            unit="m²"
            required
          />
        </div>

        {/* Zona */}
        <ZonaSelector
          zona_id={lote.zona_id}
          ca_basico={lote.ca_basico}
          ca_maximo={lote.ca_maximo}
          v_terreno={lote.v_terreno}
          fp={lote.fp}
          onZonaChange={(v) => set("zona_id", v)}
          onCaBasicoChange={(v) => set("ca_basico", v)}
          onCaMaximoChange={(v) => set("ca_maximo", v)}
          onVChange={(v) => set("v_terreno", v)}
          onFpChange={(v) => set("fp", v)}
          modo={modo}
        />

        {/* Tipologia */}
        <TipologiaSelector
          tipologia_id={lote.tipologia_id}
          fs={lote.fs}
          isento={false}
          onTipologiaChange={(v) => set("tipologia_id", v)}
          onFsChange={(v) => set("fs", v)}
          onIsentoChange={() => {}}
          modo={modo}
        />

        {/* Benefícios – apenas modo avançado */}
        {modo === "avancado" && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Reduções de Área (Benefícios)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Fruição Residencial"
                type="number"
                step="1"
                min={0}
                value={lote.area_fruicao_residencial || ""}
                onChange={(e) => set("area_fruicao_residencial", parseFloat(e.target.value) || 0)}
                unit="m²"
                hint="Área de fruição (ativação do térreo)"
              />
              <Select
                label="Base Legal Fruição"
                value={String(lote.base_legal_frui)}
                onChange={(e) => set("base_legal_frui", parseInt(e.target.value) as 0 | 1 | 2)}
              >
                <option value="0">Não se aplica</option>
                <option value="1">CA máximo</option>
                <option value="2">CA adicional</option>
              </Select>
              <Input
                label="Doação Verde (parque/praça)"
                type="number"
                step="1"
                min={0}
                value={lote.area_doacao_verde || ""}
                onChange={(e) => set("area_doacao_verde", parseFloat(e.target.value) || 0)}
                unit="m²"
              />
              <Input
                label="Doação Melhoria Viária"
                type="number"
                step="1"
                min={0}
                value={lote.area_doacao_melhoria || ""}
                onChange={(e) => set("area_doacao_melhoria", parseFloat(e.target.value) || 0)}
                unit="m²"
              />
              <Input
                label="TDC (Transferência Direito de Construir)"
                type="number"
                step="1"
                min={0}
                value={lote.area_tdc || ""}
                onChange={(e) => set("area_tdc", parseFloat(e.target.value) || 0)}
                unit="m²"
              />
              <Input
                label="Área Isenta (HIS)"
                type="number"
                step="1"
                min={0}
                value={lote.area_isenta_his || ""}
                onChange={(e) => set("area_isenta_his", parseFloat(e.target.value) || 0)}
                unit="m²"
              />
            </div>
          </div>
        )}

        {/* Preview do CA */}
        {lote.area_terreno > 0 && (
          <div className="text-xs bg-blue-50 border border-blue-100 rounded p-2 grid grid-cols-3 gap-2">
            <div>
              <p className="text-gray-500">CA Básico × At</p>
              <p className="font-semibold text-gray-800">{formatArea(lote.ca_basico * lote.area_terreno, 0)}</p>
            </div>
            <div>
              <p className="text-gray-500">CA Máx × At</p>
              <p className="font-semibold text-gray-800">{formatArea(lote.ca_maximo * lote.area_terreno, 0)}</p>
            </div>
            <div>
              <p className="text-gray-500">Excedente</p>
              <p className="font-semibold text-blue-700">
                {formatArea(Math.max(0, lote.area_computavel - lote.ca_basico * lote.area_terreno), 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function OodcPage() {
  const [modo, setModo] = useState<Modo>("simplificado");
  const [assunto, setAssunto] = useState<AssuntoOODC>("Novo");
  const [lotes, setLotes] = useState<LoteOODC[]>([loteVazio(1)]);
  const [resultado, setResultado] = useState<ResultadoOODC | null>(null);

  function addLote() {
    if (lotes.length >= MAX_LOTES) return;
    setLotes((prev) => [...prev, loteVazio(prev.length + 1)]);
  }

  function removeLote(idx: number) {
    setLotes((prev) => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, id: i + 1 })));
    setResultado(null);
  }

  function updateLote(idx: number, lote: LoteOODC) {
    setLotes((prev) => prev.map((l, i) => (i === idx ? lote : l)));
    setResultado(null);
  }

  function calcular() {
    const entrada: EntradaOODC = { modo, assunto, lotes };
    setResultado(calcularOODC(entrada));
  }

  function limpar() {
    setLotes([loteVazio(1)]);
    setResultado(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <a href="/" className="hover:text-blue-600">Início</a>
          <span>›</span>
          <span>OODC – Plano Diretor</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          OODC – Outorga Onerosa do Direito de Construir
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          PDE – Lei nº 16.050/2014 (Arts. 115–128) · Suporte a até {MAX_LOTES} lotes
        </p>
      </div>

      {/* Toggle modo + assunto */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Modo:</span>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            <button
              onClick={() => setModo("simplificado")}
              className={`px-4 py-1.5 transition-colors ${
                modo === "simplificado"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Simplificado
            </button>
            <button
              onClick={() => setModo("avancado")}
              className={`px-4 py-1.5 transition-colors ${
                modo === "avancado"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Avançado
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Assunto:</span>
          <select
            value={assunto}
            onChange={(e) => setAssunto(e.target.value as AssuntoOODC)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Novo">Novo empreendimento</option>
            <option value="Acrescimo">Acréscimo / ampliação</option>
            <option value="Regularizacao">Regularização</option>
            <option value="HIS">HIS – Habitação de Interesse Social</option>
            <option value="HMP">HMP – Habitação de Mercado Popular</option>
            <option value="Institucional">Institucional / Equipamento Público</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Lotes */}
        <div className="flex flex-col gap-4">
          {lotes.map((lote, idx) => (
            <LoteForm
              key={lote.id}
              lote={lote}
              index={idx}
              modo={modo}
              onChange={(l) => updateLote(idx, l)}
              onRemove={() => removeLote(idx)}
              podeRemover={lotes.length > 1}
            />
          ))}

          {/* Adicionar lote */}
          {lotes.length < MAX_LOTES && (
            <button
              onClick={addLote}
              className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-500 hover:text-blue-600 rounded-xl py-4 text-sm font-medium transition-colors"
            >
              + Adicionar Lote ({lotes.length}/{MAX_LOTES})
            </button>
          )}

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={calcular}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              Calcular OODC
            </button>
            <button
              onClick={limpar}
              className="px-4 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Resultado */}
        <div className="flex flex-col gap-4">
          {resultado ? (
            <OodcResult resultado={resultado} />
          ) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400">
              <div className="text-4xl mb-3">🏢</div>
              <p className="text-sm">
                Preencha os dados dos lotes e clique em{" "}
                <strong>Calcular OODC</strong> para ver o resultado.
              </p>
            </div>
          )}

          {/* Referência técnica */}
          <Card>
            <CardTitle>Referência do Cálculo</CardTitle>
            <div className="text-xs text-gray-500 space-y-2">
              <div className="font-mono bg-gray-50 border border-gray-200 rounded p-2">
                <p>terreno_n = CA_bas_n × At_n</p>
                <p>c_n = (terreno_n / Ac_n) × V_max × Fp_n × Fs_n</p>
                <p>outorga_n = MAX(0, Ac_n − terreno_n − benefício_n − TDC_n)</p>
                <p>valor_n = outorga_n × c_n</p>
              </div>
              <p>
                V_max = maior valor de terreno entre todos os lotes
              </p>
              <p>
                Benefício inclui: fruição, doação verde, doação melhoria viária e TDC.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
