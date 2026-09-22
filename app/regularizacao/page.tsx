"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ZonaSelector from "@/components/forms/ZonaSelector";
import TipologiaSelector from "@/components/forms/TipologiaSelector";
import RegularizacaoResult from "@/components/results/RegularizacaoResult";
import { Card, CardTitle } from "@/components/ui/Card";
import {
  calcularRegularizacao,
  validarEntradaRegularizacao,
} from "@/lib/calculations/regularizacao";
import {
  EntradaRegularizacao,
  ResultadoRegularizacao,
  FatorRegularizacao,
  Modo,
} from "@/lib/types";

const ESTADO_INICIAL: EntradaRegularizacao = {
  area_terreno: 0,
  area_computavel: 0,
  area_regularizar: 0,
  zona_id: "",
  ca_basico: 1.0,
  ca_maximo: 4.0,
  v_terreno: 5000,
  fp: 1.0,
  fs: 0.7,
  fr: 1.2,
  tipologia_id: "",
  isento: false,
  modo: "simplificado",
};

export default function RegularizacaoPage() {
  const [modo, setModo] = useState<Modo>("simplificado");
  const [form, setForm] = useState<EntradaRegularizacao>(ESTADO_INICIAL);
  const [resultado, setResultado] = useState<ResultadoRegularizacao | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});

  function set<K extends keyof EntradaRegularizacao>(key: K, value: EntradaRegularizacao[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (erros[key]) setErros((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function calcular() {
    const entrada = { ...form, modo };
    const errosValidacao = validarEntradaRegularizacao(entrada);
    if (errosValidacao.length > 0) {
      const mapa: Record<string, string> = {};
      errosValidacao.forEach((e) => { mapa[e.campo] = e.mensagem; });
      setErros(mapa);
      return;
    }
    setErros({});
    setResultado(calcularRegularizacao(entrada));
  }

  function limpar() {
    setForm(ESTADO_INICIAL);
    setResultado(null);
    setErros({});
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho da página */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <a href="/" className="hover:text-blue-600">Início</a>
          <span>›</span>
          <span>Regularização</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Outorga Onerosa – Regularização de Edificações
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Lei nº 17.202/2019 – Capítulo VII (Art. 13) · Prazo protocolo: até 31/12/2025
        </p>
      </div>

      {/* Toggle modo */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Formulário */}
        <div className="flex flex-col gap-4">
          {/* Identificação */}
          {modo === "avancado" && (
            <Card>
              <CardTitle>Identificação do Imóvel (opcional)</CardTitle>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="SQL"
                  placeholder="000.000.0000.0"
                  value={form.sql ?? ""}
                  onChange={(e) => set("sql", e.target.value)}
                />
                <Input
                  label="Endereço"
                  placeholder="Rua, nº"
                  value={form.endereco ?? ""}
                  onChange={(e) => set("endereco", e.target.value)}
                />
              </div>
            </Card>
          )}

          {/* Áreas */}
          <Card>
            <CardTitle>Dados do Imóvel</CardTitle>
            <div className="flex flex-col gap-3">
              <Input
                label="Área do Terreno (At)"
                type="number"
                step="1"
                min={0}
                value={form.area_terreno || ""}
                onChange={(e) => set("area_terreno", parseFloat(e.target.value) || 0)}
                unit="m²"
                hint="Área total do lote/terreno"
                required
                error={erros.area_terreno}
              />
              <Input
                label="Área Construída Computável Total (Ac)"
                type="number"
                step="1"
                min={0}
                value={form.area_computavel || ""}
                onChange={(e) => set("area_computavel", parseFloat(e.target.value) || 0)}
                unit="m²"
                hint="Área construída computável total do empreendimento (Art. 13, §1º)"
                required
                error={erros.area_computavel}
              />
              {modo === "avancado" && (
                <Input
                  label="Área a Regularizar"
                  type="number"
                  step="1"
                  min={0}
                  value={form.area_regularizar || ""}
                  onChange={(e) => set("area_regularizar", parseFloat(e.target.value) || 0)}
                  unit="m²"
                  hint="Área objeto específica da regularização"
                />
              )}
            </div>
          </Card>

          {/* Zona e parâmetros */}
          <Card>
            <CardTitle>Zona e Parâmetros Urbanísticos</CardTitle>
            <ZonaSelector
              zona_id={form.zona_id}
              ca_basico={form.ca_basico}
              ca_maximo={form.ca_maximo}
              v_terreno={form.v_terreno}
              fp={form.fp}
              onZonaChange={(v) => set("zona_id", v)}
              onCaBasicoChange={(v) => set("ca_basico", v)}
              onCaMaximoChange={(v) => set("ca_maximo", v)}
              onVChange={(v) => set("v_terreno", v)}
              onFpChange={(v) => set("fp", v)}
              modo={modo}
            />
          </Card>

          {/* Uso e tipologia */}
          <Card>
            <CardTitle>Uso / Tipologia</CardTitle>
            <TipologiaSelector
              tipologia_id={form.tipologia_id}
              fs={form.fs}
              isento={!!form.isento}
              onTipologiaChange={(v) => set("tipologia_id", v)}
              onFsChange={(v) => set("fs", v)}
              onIsentoChange={(v) => set("isento", v)}
              modo={modo}
            />
          </Card>

          {/* Fator de regularização */}
          <Card>
            <CardTitle>Fator de Regularização (Fr)</CardTitle>
            <Select
              value={String(form.fr)}
              onChange={(e) => set("fr", parseFloat(e.target.value) as FatorRegularizacao)}
              hint="Art. 13, §§1º, 8º da Lei nº 17.202/2019"
            >
              <option value="1.2">
                1,2 – Caso padrão (Fr = 1,2)
              </option>
              <option value="0.5">
                0,5 – Com demolição da área excedente ao CA máximo
              </option>
              <option value="0.0">
                0,0 – Área de Preservação Permanente (APP)
              </option>
            </Select>
            <div className="mt-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded p-2">
              {form.fr === 1.2 && "Caso geral: fator de regularização padrão (Art. 13, §1º)."}
              {form.fr === 0.5 &&
                "Quando há necessidade de demolição da área excedente ao CA máximo para obter o Certificado de Regularidade (Art. 13, §8º)."}
              {form.fr === 0.0 &&
                "Em área de Preservação Permanente – APP, o fator de regularização é zero, resultando em outorga = R$ 0 (Art. 13, §8º, in fine)."}
            </div>
          </Card>

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={calcular}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              Calcular Outorga Onerosa
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
            <RegularizacaoResult resultado={resultado} />
          ) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm">
                Preencha os dados e clique em{" "}
                <strong>Calcular</strong> para ver o resultado.
              </p>
            </div>
          )}

          {/* Resumo da fórmula */}
          <Card>
            <CardTitle>Como funciona o cálculo</CardTitle>
            <div className="text-sm text-gray-600 flex flex-col gap-2">
              <div className="font-mono text-xs bg-gray-50 border border-gray-200 rounded p-3 text-center">
                <strong>C = (At/Ac) × V × Fs × Fp × Fr</strong>
              </div>
              <ul className="text-xs text-gray-500 space-y-1 mt-2">
                <li><strong>C</strong> – Contrapartida por m² de potencial adicional</li>
                <li><strong>At</strong> – Área do terreno (m²)</li>
                <li><strong>Ac</strong> – Área construída computável total (m²)</li>
                <li><strong>V</strong> – Valor do m² do terreno (Quadro 14 – Lei 16.050/2014)</li>
                <li><strong>Fs</strong> – Fator de interesse social (Quadro 16A – Lei 13.885/2004)</li>
                <li><strong>Fp</strong> – Fator de planejamento (Quadro 15A – Lei 13.885/2004)</li>
                <li><strong>Fr</strong> – Fator de regularização (1,2 / 0,5 / 0)</li>
              </ul>
              <p className="text-xs text-gray-400 mt-2">
                A outorga incide apenas sobre a área excedente ao CA básico,
                limitada ao CA máximo da zona.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
