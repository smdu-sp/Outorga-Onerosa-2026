import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-4">
            <span>Prefeitura de São Paulo</span>
            <span>·</span>
            <span>2024/2025</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Calculadora de Outorga Onerosa
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Cálculo do OODC – Outorga Onerosa do Direito de Construir no
            Município de São Paulo.
          </p>
          <p className="text-sm text-gray-500">
            Suporta dois modelos: <strong>Regularização de Edificações</strong>{" "}
            (Lei nº 17.202/2019, Art. 13) e{" "}
            <strong>OODC – Plano Diretor</strong> (Lei nº 16.050/2014, Arts.
            115–128), com modo simplificado e avançado.
          </p>
        </div>
      </div>

      {/* Seleção de calculadora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regularização */}
        <Link
          href="/regularizacao"
          className="group bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
              🏗
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                Regularização de Edificações
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Cálculo da outorga onerosa para regularização de edificações
                concluídas até 31/07/2014, com área computável acima do CA
                básico.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full">
                  Lei 17.202/2019
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Art. 13, §1º
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Fr = 1,2 / 0,5 / 0
                </span>
              </div>
              <div className="mt-4 text-xs bg-orange-50 border border-orange-100 rounded p-2 text-orange-800">
                <strong>Fórmula:</strong>{" "}
                <code>C = (At/Ac) × V × Fs × Fp × Fr</code>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 gap-1 transition-all">
            Abrir calculadora <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        {/* OODC - Plano Diretor */}
        <Link
          href="/oodc"
          className="group bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
              🏢
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                OODC – Plano Diretor
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Cálculo da outorga onerosa para novos empreendimentos,
                ampliações e obras que ultrapassem o CA básico da zona, com
                suporte a até 7 lotes.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                  PDE – Lei 16.050/2014
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Arts. 115–128
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Até 7 lotes
                </span>
              </div>
              <div className="mt-4 text-xs bg-blue-50 border border-blue-100 rounded p-2 text-blue-800">
                <strong>Fórmula:</strong>{" "}
                <code>C = (CA_bas×At/Ac) × V_max × Fp × Fs</code>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 gap-1 transition-all">
            Abrir calculadora <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>
      </div>

      {/* Legislação */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Base Legislativa</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {[
            { lei: "Lei nº 16.050/2014", nome: "Plano Diretor Estratégico (PDE)", cor: "blue" },
            { lei: "Lei nº 16.402/2016", nome: "Lei de Parcelamento, Uso e Ocupação do Solo (LPUOS)", cor: "indigo" },
            { lei: "Lei nº 17.202/2019", nome: "Regularização de Edificações (OODC Regularização)", cor: "orange" },
            { lei: "Lei nº 17.844/2022", nome: "Alteração à legislação urbanística", cor: "gray" },
            { lei: "Lei nº 17.975/2023", nome: "Atualização urbanística", cor: "gray" },
            { lei: "Lei nº 18.081/2024", nome: "Atualização urbanística", cor: "gray" },
          ].map((l) => (
            <div
              key={l.lei}
              className="flex flex-col gap-0.5 border border-gray-100 rounded-lg p-3 bg-gray-50"
            >
              <span className="font-mono text-xs font-bold text-gray-700">{l.lei}</span>
              <span className="text-xs text-gray-500">{l.nome}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-center text-gray-400">
        Esta calculadora tem caráter estimativo. Para fins legais, consulte a Secretaria
        Municipal de Licenciamento (SEL) ou a SMUL/PMSP.
      </p>
    </div>
  );
}
