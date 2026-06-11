import { trpc } from '@/providers/trpc'
import CategoryCard from '@/components/CategoryCard'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

export default function Categories() {
  const { data: categories, isLoading } = trpc.category.list.useQuery()

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-[#999] mb-6">
          <Link to="/" className="hover:text-[#1a1a1a]">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1a1a1a]">Kategoriler</span>
        </div>

        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-8">Tüm Kategoriler</h1>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/10] bg-[#eee] rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {categories && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
