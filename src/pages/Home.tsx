import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const { data: categories } = trpc.category.list.useQuery()
  const { data: featuredProducts } = trpc.product.getFeatured.useQuery()
  const { data: newProducts } = trpc.product.getNew.useQuery()

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || 'Abonelik başarılı!')
      setNewsletterEmail('')
    },
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 max-w-xl">
            <p className="text-[#c8a97e] text-sm font-medium tracking-wider mb-3">2026 İLKBAHAR/YAZ</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Yeni Sezon<br />Koleksiyonu
            </h1>
            <p className="text-white/70 text-base mb-8 leading-relaxed">
              Trend ürünleri keşfedin, özel fırsatları yakalayın. Kaliteli ürünler, uygun fiyatlarla sizi bekliyor.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c8a97e] text-white font-medium rounded-lg hover:bg-[#b8986e] transition-colors"
            >
              Alışverişe Başla <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="w-36 h-48 md:w-44 md:h-56 bg-white/10 rounded-xl overflow-hidden rotate-[-3deg]">
                <img src="/product-hero-1.jpg" alt="" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="w-36 h-48 md:w-44 md:h-56 bg-white/10 rounded-xl overflow-hidden rotate-[3deg] mt-6">
                <img src="/product-hero-2.jpg" alt="" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-white/40" />
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, text: 'Ücretsiz Kargo', sub: '150 TL üzeri' },
              { icon: Shield, text: 'Güvenli Ödeme', sub: '256-bit SSL' },
              { icon: RotateCcw, text: 'Kolay İade', sub: '14 gün içinde' },
              { icon: Headphones, text: '7/24 Destek', sub: 'Yardım merkezi' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#1a1a1a]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{item.text}</p>
                  <p className="text-xs text-[#999]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-2">Kategoriler</h2>
            <p className="text-sm text-[#6b6b6b]">İhtiyacınız olan her şey tek bir yerde</p>
          </div>
          {categories && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-1">Öne Çıkanlar</h2>
              <p className="text-sm text-[#6b6b6b]">En çok tercih edilen ürünler</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1 text-sm font-medium text-[#1a1a1a] hover:text-[#c8a97e] transition-colors">
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {featuredProducts && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Campaign Banner */}
      <section className="bg-[#c8a97e] py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ücretsiz Kargo</h2>
          <p className="text-white/80 text-sm md:text-base">150 TL üzeri siparişlerinizde kargo ücretsiz</p>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-1">Yeni Gelenler</h2>
              <p className="text-sm text-[#6b6b6b]">En son eklenen ürünler</p>
            </div>
          </div>
          {newProducts && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-20 bg-[#f5f5f5]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">Fırsatları Kaçırma</h2>
          <p className="text-sm text-[#6b6b6b] mb-6">
            Yeni ürünler ve özel indirimler için bültenimize abone ol
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (newsletterEmail) {
                subscribeMutation.mutate({ email: newsletterEmail })
              }
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Email adresiniz"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-sm border border-[#e5e5e5] rounded-lg bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-[#1a1a1a] rounded-lg hover:bg-[#4a4a4a] transition-colors whitespace-nowrap"
            >
              Abone Ol
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
