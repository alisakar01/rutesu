import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import ProductCard from '@/components/ProductCard'
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const { data: product, isLoading } = trpc.product.getBySlug.useQuery({ slug: slug! })
  const { data: isFav } = trpc.favorite.isFavorite.useQuery(
    { productId: product?.id || 0 },
    { enabled: isAuthenticated && !!product }
  )
  const { data: relatedProducts } = trpc.product.getRelated.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product }
  )

  const utils = trpc.useUtils()
  const toggleFav = trpc.favorite.toggle.useMutation({
    onSuccess: (data) => {
      utils.favorite.list.invalidate()
      utils.favorite.isFavorite.invalidate({ productId: product?.id })
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

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-[#eee] rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-[#eee] rounded animate-pulse" />
              <div className="h-6 w-1/4 bg-[#eee] rounded animate-pulse" />
              <div className="h-24 w-full bg-[#eee] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999]">Ürün bulunamadı</p>
      </div>
    )
  }

  const hasDiscount = product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price)
  const images: string[] = product.images ? JSON.parse(product.images as string) : [product.image]
  const inStock = (product.stock || 0) > 0

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-[#999] mb-6">
          <Link to="/" className="hover:text-[#1a1a1a]">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-[#1a1a1a]">Ürünler</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1a1a1a] truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-[3/4] bg-[#f5f5f5] rounded-xl overflow-hidden">
              <img
                src={images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-[#1a1a1a]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-1">{product.name}</h1>
              <p className="text-sm text-[#6b6b6b]">{product.slug.split('-').slice(0, -1).join(' ')}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#1a1a1a]">
                {parseFloat(hasDiscount ? product.salePrice! : product.price).toFixed(2)} TL
              </span>
              {hasDiscount && (
                <span className="text-lg text-[#999] line-through">
                  {parseFloat(product.price).toFixed(2)} TL
                </span>
              )}
            </div>

            {/* Stock */}
            <div>
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                  Stokta ({product.stock} adet)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 text-xs font-medium rounded-full">
                  Tükendi
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-[#6b6b6b] leading-relaxed">{product.description}</p>
            )}

            {/* Quantity */}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#1a1a1a]">Adet:</span>
                <div className="flex items-center border border-[#e5e5e5] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('Sepete eklemek için giriş yapın')
                    navigate('/login')
                    return
                  }
                  if (!inStock) {
                    toast.error('Bu ürün stokta yok')
                    return
                  }
                  addToCart.mutate({ productId: product.id, quantity })
                }}
                disabled={!inStock || addToCart.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1a1a1a] text-white font-medium rounded-lg hover:bg-[#4a4a4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {addToCart.isPending ? 'Ekleniyor...' : 'Sepete Ekle'}
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('Favorilere eklemek için giriş yapın')
                    navigate('/login')
                    return
                  }
                  toggleFav.mutate({ productId: product.id })
                }}
                className="px-4 py-3.5 border border-[#e5e5e5] rounded-lg hover:border-[#1a1a1a] transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-[#ef4444] text-[#ef4444]' : 'text-[#1a1a1a]'}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#e5e5e5]">
              {[
                { icon: Truck, text: 'Ücretsiz Kargo' },
                { icon: Shield, text: 'Güvenli Ödeme' },
                { icon: RotateCcw, text: '14 Gün İade' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <item.icon className="w-5 h-5 text-[#999]" />
                  <span className="text-xs text-[#6b6b6b]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
