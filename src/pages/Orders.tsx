import { Link, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { Package, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-600', label: 'Beklemede' },
  processing: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'İşleniyor' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Kargoya Verildi' },
  delivered: { bg: 'bg-green-50', text: 'text-green-600', label: 'Tamamlandı' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-600', label: 'İptal Edildi' },
}

export default function Orders() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const { data: orders } = trpc.order.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  })

  const cancelMutation = trpc.order.cancel.useMutation({
    onSuccess: () => {
      utils.order.list.invalidate()
      toast.success('Sipariş iptal edildi')
    },
  })

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999] mb-4">Siparişlerinizi görmek için giriş yapın</p>
        <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Giriş Yap
        </button>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-[#ddd] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Henüz Siparişiniz Yok</h2>
        <p className="text-sm text-[#999] mb-4">İlk siparişinizi vermek için alışverişe başlayın.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8">Siparişlerim</h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusColors[order.status] || statusColors.pending
            return (
              <div key={order.id} className="bg-white p-5 rounded-xl border border-[#eee]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-[#999]" />
                    <span className="text-sm font-medium text-[#1a1a1a]">{order.orderNumber}</span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <span className="text-sm text-[#999]">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[#6b6b6b]">
                    Toplam: <span className="font-semibold text-[#1a1a1a]">{parseFloat(order.totalAmount).toFixed(2)} TL</span>
                  </p>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => cancelMutation.mutate({ orderId: order.id })}
                        className="px-4 py-2 text-xs border border-[#e5e5e5] rounded-lg hover:border-[#ef4444] hover:text-[#ef4444] transition-colors"
                      >
                        İptal Et
                      </button>
                    )}
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-4 py-2 text-xs bg-[#1a1a1a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors"
                    >
                      Detaylar
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
