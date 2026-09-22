import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">SP</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm leading-tight block">
                Calculadora OODC
              </span>
              <span className="text-xs text-gray-500 leading-tight block">
                Outorga Onerosa – São Paulo
              </span>
            </div>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/regularizacao"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              Regularização
            </Link>
            <Link
              href="/oodc"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              OODC – Plano Diretor
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
