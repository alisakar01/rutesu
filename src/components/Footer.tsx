import { Link } from 'react-router'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/70">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold tracking-[0.1em] text-white">
              RUTESU
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Kaliteli ürünler, uygun fiyatlar ve güvenli alışveriş deneyimi. Her zaman yanınızdayız.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Ürünler</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Kategoriler</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Müşteri Hizmetleri</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/orders" className="hover:text-white transition-colors">Siparişlerim</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Favorilerim</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Profilim</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c8a97e]" />
                <span>destek@rutesu.shop</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c8a97e]" />
                <span>+90 555 123 4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c8a97e] mt-0.5" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Rutesu Shop. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-white/50">rutesu.shop</p>
        </div>
      </div>
    </footer>
  )
}
