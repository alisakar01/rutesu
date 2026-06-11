import { Link } from 'react-router'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1a1a1a] mb-2">404</h1>
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Sayfa Bulunamadı</h2>
        <p className="text-sm text-[#6b6b6b] mb-6">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#4a4a4a] transition-colors"
        >
          <Home className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
