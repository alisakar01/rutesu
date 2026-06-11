import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { User, MapPin, Plus, Trash2, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const [name, setName] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressData, setAddressData] = useState({
    title: '', fullName: '', phone: '', address: '', city: '', postalCode: '', isDefault: false,
  })

  useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user])

  const { data: addresses } = trpc.address.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  })

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate()
      toast.success('Profil güncellendi')
    },
  })

  const createAddress = trpc.address.create.useMutation({
    onSuccess: () => {
      utils.address.list.invalidate()
      setShowAddressForm(false)
      setAddressData({ title: '', fullName: '', phone: '', address: '', city: '', postalCode: '', isDefault: false })
      toast.success('Adres eklendi')
    },
  })

  const removeAddress = trpc.address.remove.useMutation({
    onSuccess: () => {
      utils.address.list.invalidate()
      toast.success('Adres silindi')
    },
  })

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999] mb-4">Profilinizi görmek için giriş yapın</p>
        <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Giriş Yap
        </button>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[800px] mx-auto px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8">Profilim</h1>

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-xl border border-[#eee] mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#1a1a1a]">{user?.name}</p>
              <p className="text-sm text-[#999]">{user?.email}</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              updateProfile.mutate({ name })
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg bg-[#f5f5f5] text-[#999]"
              />
            </div>
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#4a4a4a] disabled:opacity-50"
            >
              {updateProfile.isPending ? 'Güncelleniyor...' : 'Profili Güncelle'}
            </button>
          </form>
        </div>

        {/* Addresses */}
        <div className="bg-white p-6 rounded-xl border border-[#eee]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Adreslerim</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#e5e5e5] rounded-lg hover:border-[#1a1a1a] transition-colors"
            >
              <Plus className="w-4 h-4" /> Yeni Adres
            </button>
          </div>

          {showAddressForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createAddress.mutate(addressData)
              }}
              className="space-y-3 mb-6 p-4 bg-[#fafafa] rounded-lg"
            >
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Başlık (Ev, İş)" value={addressData.title} onChange={(e) => setAddressData({ ...addressData, title: e.target.value })} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]" required />
                <input placeholder="Ad Soyad" value={addressData.fullName} onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Telefon" value={addressData.phone} onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]" required />
                <input placeholder="Şehir" value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]" required />
              </div>
              <input placeholder="Adres" value={addressData.address} onChange={(e) => setAddressData({ ...addressData, address: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]" required />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Posta Kodu" value={addressData.postalCode} onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]" required />
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={addressData.isDefault} onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })} />
                  Varsayılan adres
                </label>
              </div>
              <button
                type="submit"
                disabled={createAddress.isPending}
                className="w-full py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#4a4a4a] disabled:opacity-50"
              >
                {createAddress.isPending ? 'Ekleniyor...' : 'Adres Ekle'}
              </button>
            </form>
          )}

          {addresses && addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex items-start justify-between p-4 border border-[#e5e5e5] rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#999] mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#1a1a1a]">{addr.title}</p>
                        {addr.isDefault && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 bg-[#c8a97e]/10 text-[#c8a97e] text-[10px] font-medium rounded-full">
                            <Star className="w-3 h-3" /> Varsayılan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6b6b6b]">{addr.fullName}</p>
                      <p className="text-sm text-[#999]">{addr.address}, {addr.city} {addr.postalCode}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAddress.mutate({ id: addr.id })}
                    className="p-1.5 text-[#999] hover:text-[#ef4444] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#999] text-center py-4">Henüz adres eklenmemiş.</p>
          )}
        </div>
      </div>
    </div>
  )
}
