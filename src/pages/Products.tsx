import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { trpc } from '@/providers/trpc'
import ProductCard from '@/components/ProductCard'
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react'

export default function Products() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || undefined

  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc' | 'name'>('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const { data: productsData, isLoading } = trpc.product.list.useQuery({
    sort,
    page,
    limit: 12,
    search: searchQuery,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  })

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex items-center gap-1.5 text-sm text-[#999] mb-6">
          <Link to="/" className="hover:text-[#1a1a1a]">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1a1a1a]">{searchQuery ? `Arama: "${searchQuery}"` : 'Tüm Ürünler'}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">
            {searchQuery ? `Arama Sonuçları` : 'Tüm Ürünler'}
          </h1>
          <span className="text-sm text-[#999]">
            {productsData?.total || 0} ürün
          </span>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-[#e5e5e5]">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#e5e5e5] rounded-lg hover:border-[#1a1a1a] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filtreler
          </button>

          {showFilters && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min TL"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]"
              />
              <span className="text-[#999]">-</span>
              <input
                type="number"
                placeholder="Max TL"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#1a1a1a]"
              />
              <button
                onClick={() => { setMinPrice(''); setMaxPrice('') }}
                className="p-2 text-[#999] hover:text-[#1a1a1a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="ml-auto px-4 py-2 text-sm border border-[#e5e5e5] rounded-lg bg-white focus:outline-none focus:border-[#1a1a1a]"
          >
            <option value="newest">En Yeniler</option>
            <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="name">İsim (A-Z)</option>
          </select>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#eee] rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {productsData?.products && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {productsData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {productsData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                      p === page
                        ? 'bg-[#1a1a1a] text-white'
                        : 'bg-white border border-[#e5e5e5] text-[#1a1a1a] hover:border-[#1a1a1a]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
