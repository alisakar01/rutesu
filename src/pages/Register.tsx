import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Eye, EyeOff, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [registered, setRegistered] = useState(false)

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      setRegistered(true)
      toast.success('Kayıt başarılı! Lütfen emailinizi doğrulayın.')
    },
    onError: (err) => {
      toast.error(err.message || 'Kayıt başarısız')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Tüm alanları doldurun')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor')
      return
    }
    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı')
      return
    }
    registerMutation.mutate({ name, email, password })
  }

  if (registered) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Kaydınız Tamamlandı!</h2>
          <p className="text-sm text-[#6b6b6b] mb-4">Email adresinize doğrulama linki gönderildi. Lütfen emailinizi kontrol edin.</p>
          <Link to="/" className="inline-block px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] items-center justify-center">
        <div className="text-center text-white">
          <ShoppingBag className="w-16 h-16 text-[#c8a97e] mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">Rutesu Shop</h2>
          <p className="text-white/60 max-w-sm">Aramıza katılın, binlerce ürüne erişim sağlayın.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Hesap Oluştur</h1>
            <p className="text-sm text-[#6b6b6b] mt-1">Yeni bir hesap oluşturun</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ad Soyad"
                className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Şifre Tekrar</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5"
                required
              />
            </div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3 bg-[#1a1a1a] text-white font-medium rounded-lg hover:bg-[#4a4a4a] disabled:opacity-50 transition-colors"
            >
              {registerMutation.isPending ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="text-center text-sm text-[#6b6b6b] mt-6">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-[#c8a97e] font-medium hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
