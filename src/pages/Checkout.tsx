import { useState } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const { data: cartItems } = trpc.cart.list.useQuery(undefined, { enabled: isAuthenticated, retry: false })
  const { data: addresses } = trpc.address.list.useQuery(undefined, { enabled: isAuthenticated, retry: false })

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping')
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate()
      utils.cart.getCount.invalidate()
      utils.order.list.invalidate()
      toast.success('Siparişiniz alındı!')
      setStep('success')
    },
  })

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999] mb-4">Sipariş vermek için giriş yapın</p>
        <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Giriş Yap
        </button>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999] mb-4">Sepetiniz boş</p>
        <button onClick={() => navigate('/products')} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Alışverişe Başla
        </button>
      </div>
    )
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.salePrice ? parseFloat(item.product.salePrice) : parseFloat(item.product.price)
    return sum + price * item.quantity
  }, 0)
  const shipping = subtotal >= 150 ? 0 : 29.90
  const total = subtotal + shipping

  const handlePayment = () => {
    if (!selectedAddress && addresses && addresses.length > 0) {
      toast.error('Lütfen bir teslimat adresi seçin')
      return
    }
    if (cardNumber.length < 16) {
      toast.error('Geçerli bir kart numarası girin')
      return
    }
    if (!cardHolder) {
      toast.error('Kart üzerindeki ismi girin')
      return
    }
    if (expiry.length < 5) {
      toast.error('Son kullanma tarihini girin')
      return
    }
    if (cvv.length < 3) {
      toast.error('CVV kodunu girin')
      return
    }

    const addr = addresses?.find((a) => a.id === selectedAddress)
    const shippingAddress = addr
      ? { fullName: addr.fullName, phone: addr.phone, address: addr.address, city: addr.city, postalCode: addr.postalCode }
      : { fullName: '', phone: '', address: '', city: '', postalCode: '' }

    createOrder.mutate({
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.salePrice || item.product.price,
        totalPrice: ((item.product.salePrice ? parseFloat(item.product.salePrice) : parseFloat(item.product.price)) * item.quantity).toFixed(2),
      })),
      shippingAddress,
      paymentInfo: { cardNumber, cardHolder },
      totalAmount: total.toFixed(2),
    })
  }

  if (step === 'success') {
    return (
      <div className="py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Siparişiniz Alındı!</h1>
          <p className="text-sm text-[#6b6b6b] mb-6">Siparişiniz başarıyla oluşturuldu. Email adresinize onay maili gönderildi.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/orders')} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#4a4a4a]">
              Siparişlerim
            </button>
            <button onClick={() => navigate('/')} className="px-6 py-2.5 border border-[#e5e5e5] text-sm font-medium rounded-lg hover:border-[#1a1a1a]">
              Ana Sayfa
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['Sepet', 'Teslimat', 'Ödeme', 'Onay'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                i < 2 ? 'bg-[#1a1a1a] text-white' : i === 2 && step === 'payment' ? 'bg-[#1a1a1a] text-white' : 'bg-[#eee] text-[#999]'
              }`}>
                {i < 2 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i < 2 || (i === 2 && step === 'payment') ? 'text-[#1a1a1a] font-medium' : 'text-[#999]'}`}>{s}</span>
              {i < 3 && <div className="w-8 h-px bg-[#e5e5e5] ml-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            {step === 'shipping' && (
              <div className="bg-white p-6 rounded-xl border border-[#eee]">
                <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Teslimat Adresi</h2>
                {addresses && addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress === addr.id ? 'border-[#1a1a1a] bg-[#fafafa]' : 'border-[#e5e5e5]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1"
                        />
                        <div className="text-sm">
                          <p className="font-medium text-[#1a1a1a]">{addr.title} - {addr.fullName}</p>
                          <p className="text-[#6b6b6b] mt-0.5">{addr.address}, {addr.city} {addr.postalCode}</p>
                          <p className="text-[#999] text-xs mt-0.5">{addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#999] mb-4">Kayıtlı adresiniz bulunmuyor</p>
                    <button onClick={() => navigate('/profile')} className="px-4 py-2 text-sm border border-[#e5e5e5] rounded-lg hover:border-[#1a1a1a]">
                      Profilden Adres Ekle
                    </button>
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setStep('payment')}
                    className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#4a4a4a]"
                  >
                    Devam Et
                  </button>
                </div>
              </div>
            )}

            {/* Payment */}
            {step === 'payment' && (
              <div className="bg-white p-6 rounded-xl border border-[#eee]">
                <button onClick={() => setStep('shipping')} className="flex items-center gap-1 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] mb-4">
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
                <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Kart Bilgileri</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Kart Numarası</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Kart Üzerindeki İsim</label>
                    <input
                      type="text"
                      placeholder="Ad Soyad"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Son Kullanma (AA/YY)</label>
                      <input
                        type="text"
                        placeholder="12/26"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                        className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={createOrder.isPending}
                  className="w-full mt-6 py-3.5 bg-[#1a1a1a] text-white font-medium rounded-lg hover:bg-[#4a4a4a] disabled:opacity-50 transition-colors"
                >
                  {createOrder.isPending ? 'İşleniyor...' : `Siparişi Tamamla - ${total.toFixed(2)} TL`}
                </button>
                <p className="text-center text-xs text-[#999] mt-3">Bu bir demo ödeme sistemidir. Gerçek ödeme alınmaz.</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl border border-[#eee] h-fit">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Sipariş Özeti</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cartItems.map((item) => {
                const price = item.product.salePrice ? parseFloat(item.product.salePrice) : parseFloat(item.product.price)
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-[#999]">{item.quantity} x {price.toFixed(2)} TL</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-[#e5e5e5] mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Ara Toplam</span><span>{subtotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Kargo</span><span>{shipping === 0 ? 'Ücretsiz' : `${shipping.toFixed(2)} TL`}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#1a1a1a] pt-2">
                <span>Toplam</span><span className="text-lg">{total.toFixed(2)} TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
