import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { ArrowLeft, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
      setSent(true)
      toast.success('Sıfırlama linki gönderildi!')
    },
    onError: (err) => {
      toast.error(err.message || 'Bir hata oluştu')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Email adresi girin')
      return
    }
    forgotMutation.mutate({ email })
  }

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[#1a1a1a]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Email Gönderildi</h2>
          <p className="text-sm text-[#6b6b6b] mb-6">Şifre sıfırlama linki email adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
            Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] mb-6">
          <ArrowLeft className="w-4 h-4" /> Girişe dön
        </Link>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Şifremi Unuttum</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Şifre sıfırlama linki almak için email adresinizi girin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            className="w-full px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5"
            required
          />
          <button
            type="submit"
            disabled={forgotMutation.isPending}
            className="w-full py-3 bg-[#1a1a1a] text-white font-medium rounded-lg hover:bg-[#4a4a4a] disabled:opacity-50 transition-colors"
          >
            {forgotMutation.isPending ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
          </button>
        </form>
      </div>
    </div>
  )
}
