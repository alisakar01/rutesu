import { useParams, Link, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { ChevronLeft, Package, Truck, CheckCircle } from 'lucide-react'

const statusLabels: Record<string, string> = {
  pending: 'Beklemede',
  processing: 'İşleniyor',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
}

const statusSteps = [
  { key: 'pending', label: 'Sipariş Alındı', icon: Package },
  { key: 'processing', label: 'Hazırlanıyor', icon: Package },
  { key: 'shipped', label: 'Kargoya Verildi', icon: Truck },
  { key: 'delivered', label: 'Teslim Edildi', icon: CheckCircle },
]

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data: order, isLoading } = trpc.order.getById.useQuery(
    { id: parseInt(id!) },
    { enabled: isAuthenticated && !!id }
  )

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999] mb-4">Giriş yapın</p>
        <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Giriş Yap
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="h-8 w-48 bg-[#eee] rounded animate-pulse mb-6" />
          <div className="h-32 w-full bg-[#eee] rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999]">Sipariş bulunamadı</p>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status)
  const addr = order.shippingAddress as Record<string, string>

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[800px] mx-auto px-4 md:px-6">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] mb-6">
          <ChevronLeft className="w-4 h-4" /> Siparişlerime Dön
        </Link>

        <div className="bg-white p-6 rounded-xl border border-[#eee] mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl font-semibold text-[#1a1a1a]">{order.orderNumber}</h1>
              <p className="text-sm text-[#999] mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
              order.status === 'delivered' ? 'bg-green-50 text-green-600' :
              order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
              order.status === 'shipped' ? 'bg-purple-50 text-purple-600' :
              'bg-yellow-50 text-yellow-600'
            }`}>
              {statusLabels[order.status]}
            </span>
          </div>

          {/* Progress */}
          {order.status !== 'cancelled' && (
            <div className="flex items-center justify-between mt-6">
              {statusSteps.map((step, i) => (
                <div key={step.key} className="flex-1 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i <= currentStepIndex ? 'bg-[#1a1a1a] text-white' : 'bg-[#eee] text-[#999]'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 ${i <= currentStepIndex ? 'text-[#1a1a1a] font-medium' : 'text-[#999]'}`}>
                    {step.label}
                  </span>
                  {i < statusSteps.length - 1 && (
                    <div className={`absolute h-0.5 w-full top-5 left-1/2 ${
                      i < currentStepIndex ? 'bg-[#1a1a1a]' : 'bg-[#eee]'
                    }`} style={{ position: 'relative' }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-white p-6 rounded-xl border border-[#eee] mb-6">
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Sipariş İçeriği</h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.productImage || ''} alt={item.productName || ''} className="w-16 h-16 rounded-lg object-cover bg-[#f5f5f5]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1a1a1a]">{item.productName}</p>
                  <p className="text-xs text-[#999]">{item.quantity} x {parseFloat(item.unitPrice).toFixed(2)} TL</p>
                </div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{parseFloat(item.totalPrice).toFixed(2)} TL</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#e5e5e5] mt-4 pt-4 flex justify-between font-semibold">
            <span>Toplam</span>
            <span>{parseFloat(order.totalAmount).toFixed(2)} TL</span>
          </div>
        </div>

        {/* Address */}
        {addr && (
          <div className="bg-white p-6 rounded-xl border border-[#eee]">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Teslimat Adresi</h2>
            <div className="text-sm text-[#6b6b6b]">
              <p className="font-medium text-[#1a1a1a]">{addr.fullName}</p>
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.postalCode}</p>
              <p className="mt-1">{addr.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
