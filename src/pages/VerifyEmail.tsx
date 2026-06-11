import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => setStatus('success'),
    onError: () => setStatus('error'),
  })

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token })
    } else {
      setStatus('error')
    }
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Email Doğrulandı!</h2>
          <p className="text-sm text-[#6b6b6b] mb-6">Email adresiniz başarıyla doğrulandı. Artık alışverişe başlayabilirsiniz.</p>
          <Link to="/" className="inline-block px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#4a4a4a]">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <XCircle className="w-16 h-16 text-[#ef4444] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Doğrulama Başarısız</h2>
        <p className="text-sm text-[#6b6b6b] mb-6">Geçersiz veya süresi dolmuş doğrulama linki.</p>
        <Link to="/" className="inline-block px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
