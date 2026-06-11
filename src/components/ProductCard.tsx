import { Link } from 'react-router'
import { Heart, ShoppingBag } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  slug: string
  price: string
  salePrice: string | null
  image: string
  stock: number | null
  isNew: boolean | null
  featured: boolean | null
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth()
  const utils = trpc.useUtils()

  const { data: isFav } = trpc.favorite.isFavorite.useQuery(
    { productId: product.id },
    { enabled: isAuthenticated, retry: false }
  )

  const toggleFav = trpc.favorite.toggle.useMutation({
    onSuccess: (data) => {
      utils.favorite.list.invalidate()
      utils.favorite.isFavorite.invalidate({ productId: product.id })
      toast.success(data.isFavorite ? 'Favorilere eklendi' : 'Favorilerden çıkarıldı')
    },
  })

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate()
      utils.cart.getCount.invalidate()
      toast.success('Sepete eklendi')
    },
  })

  const hasDiscount = product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price)
  const displayPrice = hasDiscount ? product.salePrice : product.price
  const originalPrice = hasDiscount ? product.price : null

  return (
    <div className="group bg-white rounded-xl border border-[#eee] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-[#1a1a1a] text-white text-[11px] font-medium rounded-full">
              Yeni
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-[#ef4444] text-white text-[11px] font-medium rounded-full">
              İndirim
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error('Favorilere eklemek için giriş yapın')
              return
            }
            toggleFav.mutate({ productId: product.id })
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 ${isFav ? 'fill-[#ef4444] text-[#ef4444]' : 'text-[#1a1a1a]'}`}
          />
        </button>

        {/* Add to Cart */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error('Sepete eklemek için giriş yapın')
              return
            }
            addToCart.mutate({ productId: product.id, quantity: 1 })
          }}
          className="absolute bottom-3 right-3 w-9 h-9 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#4a4a4a]"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-[#1a1a1a] truncate hover:text-[#4a4a4a] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-base font-semibold text-[#1a1a1a]">
            {parseFloat(displayPrice || '0').toFixed(2)} TL
          </span>
          {originalPrice && (
            <span className="text-sm text-[#999] line-through">
              {parseFloat(originalPrice).toFixed(2)} TL
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
