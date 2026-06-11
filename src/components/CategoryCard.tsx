import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  category: {
    id: number
    name: string
    slug: string
    description: string | null
    image: string | null
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative aspect-[16/10] rounded-xl overflow-hidden block"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#4a4a4a]" />
      )}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <h3 className="text-xl font-semibold text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {category.name}
        </h3>
        <span className="flex items-center gap-1 text-sm text-white/80 mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Keşfet <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}
