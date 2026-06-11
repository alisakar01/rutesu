import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { trpc } from '@/providers/trpc'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true)
      toast.success('Şifreniz sıfırlandı!')
    },
    onError: (err) => {
      toast.error(err.message || 'Bir hata oluştu')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error('Geçersiz token')
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
    resetMutation.mutate({ token, password })
  }

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Geçersiz Link</h2>
          <p className="text-sm text-[#6b6b6b] mb-4">Şifre sıfırlama linki geçersiz.</p>
          <Link to="/forgot-password" className="text-[#c8a97e] font-medium hover:underline">Tekrar Talep Et</Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Şifre Sıfırlandı!</h2>
          <p className="text-sm text-[#6b6b6b] mb-6">Şifreniz başarıyla değiştirildi.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
            Giriş Yap
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Yeni Şifre Oluştur</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Yeni şifrenizi girin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni şifre"
              className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a] pr-10"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Şifre tekrar"
            className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]"
            required
          />
          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="w-full py-3 bg-[#1a1a1a] text-white font-medium rounded-lg hover:bg-[#4a4a4a] disabled:opacity-50"
          >
            {resetMutation.isPending ? 'İşleniyor...' : 'Şifreyi Sıfırla'}
          </button>
        </form>
      </div>
    </div>
  )
}
