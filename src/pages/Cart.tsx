import { Link, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cart() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const { data: cartItems } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  })

  const updateQty = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate()
      utils.cart.getCount.invalidate()
    },
  })

  const removeItem = trpc.cart.remove.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate()
      utils.cart.getCount.invalidate()
      toast.success('Ürün sepetten çıkarıldı')
    },
  })

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-[#ddd] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Sepetinizi görmek için giriş yapın</h2>
        <Link to="/login" className="inline-block mt-4 px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#4a4a4a] transition-colors">
          Giriş Yap
        </Link>
      </div>
    )
  }

  const subtotal = cartItems?.reduce((sum, item) => {
    const price = item.product.salePrice ? parseFloat(item.product.salePrice) : parseFloat(item.product.price)
    return sum + price * item.quantity
  }, 0) || 0

  const shipping = subtotal >= 150 ? 0 : 29.90
  const total = subtotal + shipping

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-[#ddd] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Sepetiniz Boş</h2>
        <p className="text-sm text-[#999] mb-4">Sepetinizde ürün bulunmuyor.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#4a4a4a] transition-colors">
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8">Sepetim ({cartItems.length} ürün)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const price = item.product.salePrice ? parseFloat(item.product.salePrice) : parseFloat(item.product.price)
              return (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-[#eee]">
                  <Link to={`/product/${item.product.slug}`} className="w-24 h-24 md:w-28 md:h-28 bg-[#f5f5f5] rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${item.product.slug}`} className="text-sm font-medium text-[#1a1a1a] hover:text-[#4a4a4a] truncate">
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem.mutate({ productId: item.productId })}
                        className="p-1.5 text-[#999] hover:text-[#ef4444] transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-[#1a1a1a] mt-1">{price.toFixed(2)} TL</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#e5e5e5] rounded-lg">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeItem.mutate({ productId: item.productId })
                            } else {
                              updateQty.mutate({ productId: item.productId, quantity: item.quantity - 1 })
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#f5f5f5]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#f5f5f5]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-[#1a1a1a]">{(price * item.quantity).toFixed(2)} TL</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl border border-[#eee] h-fit">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Sipariş Özeti</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Ara Toplam</span>
                <span>{subtotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Kargo</span>
                <span>{shipping === 0 ? 'Ücretsiz' : `${shipping.toFixed(2)} TL`}</span>
              </div>
              <div className="border-t border-[#e5e5e5] pt-3 flex justify-between font-semibold text-[#1a1a1a]">
                <span>Toplam</span>
                <span className="text-lg">{total.toFixed(2)} TL</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1a1a1a] text-white font-medium rounded-lg hover:bg-[#4a4a4a] transition-colors"
            >
              Satın Al <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/products" className="block text-center mt-3 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
