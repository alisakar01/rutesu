import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Eye, EyeOff, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      toast.success('Giriş başarılı!')
      window.location.href = '/'
    },
    onError: (err) => {
      toast.error(err.message || 'Giriş başarısız')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Tüm alanları doldurun')
      return
    }
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-[80vh] flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] items-center justify-center">
        <div className="text-center text-white">
          <ShoppingBag className="w-16 h-16 text-[#c8a97e] mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">Rutesu Shop</h2>
          <p className="text-white/60 max-w-sm">Kaliteli ürünler, uygun fiyatlar ve güvenli alışveriş deneyimi.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Hoş Geldiniz</h1>
            <p className="text-sm text-[#6b6b6b] mt-1">Hesabınıza giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-[#6b6b6b]">Beni hatırla</span>
              </label>
              <Link to="/forgot-password" className="text-[#c8a97e] hover:underline">Şifremi unuttum</Link>
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 bg-[#1a1a1a] text-white font-medium rounded-lg hover:bg-[#4a4a4a] disabled:opacity-50 transition-colors"
            >
              {loginMutation.isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="text-center text-sm text-[#6b6b6b] mt-6">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-[#c8a97e] font-medium hover:underline">Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
