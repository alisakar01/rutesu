import { Link, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import ProductCard from '@/components/ProductCard'
import { Heart } from 'lucide-react'

export default function Favorites() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data: favorites, isLoading } = trpc.favorite.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  })

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999] mb-4">Favorilerinizi görmek için giriş yapın</p>
        <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Giriş Yap
        </button>
      </div>
    )
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="py-20 text-center">
        <Heart className="w-16 h-16 text-[#ddd] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Favorileriniz Boş</h2>
        <p className="text-sm text-[#999] mb-4">Beğendiğiniz ürünleri favorilere ekleyin.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Keşfetmeye Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8">Favorilerim ({favorites.length})</h1>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#eee] rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
