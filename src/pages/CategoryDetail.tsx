import { useParams, Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import ProductCard from '@/components/ProductCard'
import { ChevronRight } from 'lucide-react'

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: category } = trpc.category.getBySlug.useQuery({ slug: slug! })
  const { data: productsData, isLoading } = trpc.product.list.useQuery(
    { categorySlug: slug },
    { enabled: !!slug }
  )

  if (!category && !isLoading) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#999]">Kategori bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-[#999] mb-6">
          <Link to="/" className="hover:text-[#1a1a1a]">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/categories" className="hover:text-[#1a1a1a]">Kategoriler</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1a1a1a]">{category?.name}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">{category?.name}</h1>
          {category?.description && (
            <p className="text-sm text-[#6b6b6b]">{category.description}</p>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#eee] rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {productsData?.products && (
          <>
            <p className="text-sm text-[#999] mb-4">{productsData.total} ürün</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {productsData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {productsData.products.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-[#999]">Bu kategoride henüz ürün bulunmuyor.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
