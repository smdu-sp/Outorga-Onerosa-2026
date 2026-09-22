"use client";
import { useEffect } from "react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { ZONAS, GRUPOS_ZONA, getZona } from "@/lib/data/zonas";
import { getValorReferencia, AVISO_QUADRO14 } from "@/lib/data/valores";

interface Props {
  zona_id: string;
  ca_basico: number;
  ca_maximo: number;
  v_terreno: number;
  fp: number;
  onZonaChange: (zona_id: string) => void;
  onCaBasicoChange: (v: number) => void;
  onCaMaximoChange: (v: number) => void;
  onVChange: (v: number) => void;
  onFpChange: (v: number) => void;
  modo: "simplificado" | "avancado";
}

export default function ZonaSelector({
  zona_id,
  ca_basico,
  ca_maximo,
  v_terreno,
  fp,
  onZonaChange,
  onCaBasicoChange,
  onCaMaximoChange,
  onVChange,
  onFpChange,
  modo,
}: Props) {
  // Ao mudar zona, atualiza automaticamente CA e Fp
  useEffect(() => {
    if (!zona_id) return;
    const zona = getZona(zona_id);
    if (!zona) return;
    onCaBasicoChange(zona.ca_basico);
    onCaMaximoChange(zona.ca_maximo);
    onFpChange(zona.fp);
    const vRef = getValorReferencia(zona_id);
    if (vRef) onVChange(vRef.valor_referencia);
  }, [zona_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Zona de Uso"
        required
        value={zona_id}
        onChange={(e) => onZonaChange(e.target.value)}
      >
        <option value="">— Selecione a zona —</option>
        {GRUPOS_ZONA.map((grupo) => (
          <optgroup key={grupo} label={grupo}>
            {ZONAS.filter((z) => z.grupo === grupo).map((z) => (
              <option key={z.id} value={z.id}>
                {z.nome} — {z.descricao.split("(")[0].trim()}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="CA Básico"
          type="number"
          step="0.1"
          min={0}
          value={ca_basico}
          onChange={(e) => onCaBasicoChange(parseFloat(e.target.value) || 0)}
          hint="Coeficiente de aproveitamento básico da zona"
          required
          readOnly={modo === "simplificado"}
        />
        <Input
          label="CA Máximo"
          type="number"
          step="0.1"
          min={0}
          value={ca_maximo}
          onChange={(e) => onCaMaximoChange(parseFloat(e.target.value) || 0)}
          hint="Coeficiente de aproveitamento máximo (ou lei específica)"
          required
          readOnly={modo === "simplificado"}
        />
      </div>

      {modo === "avancado" && (
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Valor do Terreno (V)"
            type="number"
            step="100"
            min={0}
            value={v_terreno}
            onChange={(e) => onVChange(parseFloat(e.target.value) || 0)}
            unit="R$/m²"
            hint="Quadro 14 – Lei 16.050/2014"
            required
          />
          <Input
            label="Fator de Planejamento (Fp)"
            type="number"
            step="0.05"
            min={0}
            max={1.5}
            value={fp}
            onChange={(e) => onFpChange(parseFloat(e.target.value) || 0)}
            hint="Quadro 15A – Lei 13.885/2004"
            required
          />
        </div>
      )}

      {modo === "simplificado" && zona_id && (
        <div className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded p-2">
          <span className="font-medium">Valores automáticos: </span>
          Fp = {fp.toFixed(2)} | V = R$ {v_terreno.toLocaleString("pt-BR")}/m²
          <br />
          {AVISO_QUADRO14}
        </div>
      )}
    </div>
  );
}
