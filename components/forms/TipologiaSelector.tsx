"use client";
import { useEffect } from "react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { TIPOLOGIAS, CATEGORIAS_TIPOLOGIA, getTipologia } from "@/lib/data/fatores";

interface Props {
  tipologia_id: string;
  fs: number;
  isento: boolean;
  onTipologiaChange: (id: string) => void;
  onFsChange: (v: number) => void;
  onIsentoChange: (v: boolean) => void;
  modo: "simplificado" | "avancado";
}

export default function TipologiaSelector({
  tipologia_id,
  fs,
  isento,
  onTipologiaChange,
  onFsChange,
  onIsentoChange,
  modo,
}: Props) {
  useEffect(() => {
    if (!tipologia_id) return;
    const tip = getTipologia(tipologia_id);
    if (!tip) return;
    onFsChange(tip.fs);
    onIsentoChange(!!tip.isento_regularizacao);
  }, [tipologia_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3">
      <Select
        label="Uso / Tipologia"
        required
        value={tipologia_id}
        onChange={(e) => onTipologiaChange(e.target.value)}
      >
        <option value="">— Selecione o uso —</option>
        {CATEGORIAS_TIPOLOGIA.map((cat) => (
          <optgroup key={cat} label={cat}>
            {TIPOLOGIAS.filter((t) => t.categoria === cat).map((t) => (
              <option key={t.id} value={t.id}>
                {t.descricao}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>

      {modo === "avancado" && (
        <Input
          label="Fator de Interesse Social (Fs)"
          type="number"
          step="0.05"
          min={0}
          max={1}
          value={fs}
          onChange={(e) => onFsChange(parseFloat(e.target.value) || 0)}
          hint="Quadro 16A – Lei 13.885/2004"
          required
        />
      )}

      {modo === "simplificado" && tipologia_id && (
        <div className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded p-2">
          <span className="font-medium">Fs automático: </span>
          {fs.toFixed(2)}
          {isento && (
            <span className="ml-2 text-green-600 font-medium">
              ✓ Isento (Art. 13 §7º)
            </span>
          )}
        </div>
      )}

      {isento && (
        <div className="text-xs bg-green-50 border border-green-200 text-green-700 rounded p-2">
          Este uso é isento de outorga onerosa para regularização conforme Art. 13, §7º
          da Lei nº 17.202/2019 (uso institucional, religioso ou CEI/creche sem fins lucrativos).
        </div>
      )}
    </div>
  );
}
