import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  Package,
  ChevronDown,
} from 'lucide-react'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { data: cartCount } = trpc.cart.getCount.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  })

  const { data: favCount } = trpc.favorite.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e5e5]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-[0.1em] text-[#1a1a1a]">
            RUTESU
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-[#1a1a1a] hover:text-[#6b6b6b] transition-colors">
              Ana Sayfa
            </Link>
            <Link to="/categories" className="text-sm font-medium text-[#1a1a1a] hover:text-[#6b6b6b] transition-colors">
              Kategoriler
            </Link>
            <Link to="/products" className="text-sm font-medium text-[#1a1a1a] hover:text-[#6b6b6b] transition-colors">
              Ürünler
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-10 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-lg bg-[#fafafa] focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
              </div>
            </form>

            {/* Favorites */}
            <Link to="/favorites" className="relative p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-[#1a1a1a]" />
              {isAuthenticated && favCount && favCount.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1a1a1a] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {favCount.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors">
              <ShoppingBag className="w-5 h-5 text-[#1a1a1a]" />
              {isAuthenticated && cartCount !== undefined && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1a1a1a] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-[#1a1a1a]" />
                  <ChevronDown className="w-3 h-3 text-[#999] hidden md:block" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e5e5e5] rounded-xl shadow-lg z-50 py-1">
                      <div className="px-4 py-2 border-b border-[#eee]">
                        <p className="text-sm font-medium text-[#1a1a1a]">{user?.name}</p>
                        <p className="text-xs text-[#999] truncate">{user?.email}</p>
                      </div>
                      <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#4a4a4a] hover:bg-[#f5f5f5] transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Package className="w-4 h-4" /> Siparişlerim
                      </Link>
                      <Link to="/favorites" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#4a4a4a] hover:bg-[#f5f5f5] transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Heart className="w-4 h-4" /> Favorilerim
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#4a4a4a] hover:bg-[#f5f5f5] transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4" /> Profilim
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-[#f5f5f5] transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-lg hover:bg-[#4a4a4a] transition-colors">
                <User className="w-4 h-4" /> Giriş Yap
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e5e5e5] bg-white">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#e5e5e5] rounded-lg bg-[#fafafa] focus:outline-none focus:border-[#1a1a1a]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            </form>
            <Link to="/" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Ana Sayfa</Link>
            <Link to="/categories" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Kategoriler</Link>
            <Link to="/products" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Ürünler</Link>
            {!isAuthenticated && (
              <Link to="/login" className="block py-2 text-sm font-medium text-[#c8a97e]" onClick={() => setMobileMenuOpen(false)}>Giriş Yap / Kayıt Ol</Link>
            )}
            {isAuthenticated && (
              <>
                <Link to="/orders" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Siparişlerim</Link>
                <Link to="/favorites" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Favorilerim</Link>
                <Link to="/profile" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Profilim</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false) }} className="block py-2 text-sm text-[#ef4444]">Çıkış Yap</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
