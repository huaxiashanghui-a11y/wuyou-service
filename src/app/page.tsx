import HeroCarousel from '@/components/HeroCarousel'
import Categories from '@/components/Categories'
import ProductGrid from '@/components/ProductGrid'
import { getFeaturedProducts } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Demo data - 在实际部署时从 Firebase 获取
  const featuredProducts = [
    {
      id: '1',
      name: '王者荣耀点卡 100元',
      description: '官方直充，快速到账，安全可靠',
      price: 95,
      originalPrice: 100,
      image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
      category: 'game',
      stock: 999,
      sold: 5200,
      featured: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: '原神月卡 30元',
      description: '原神祈月礼遇，快速充值',
      price: 28,
      originalPrice: 30,
      image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=300&fit=crop',
      category: 'game',
      stock: 999,
      sold: 3500,
      featured: true,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Steam充值卡 100美元',
      description: 'Steam钱包充值码，全球通用',
      price: 680,
      originalPrice: 720,
      image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop',
      category: 'game',
      stock: 50,
      sold: 1200,
      featured: true,
      createdAt: new Date()
    },
    {
      id: '4',
      name: '腾讯视频VIP月卡',
      description: '腾讯视频会员，畅享海量影视',
      price: 20,
      originalPrice: 25,
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop',
      category: 'gift',
      stock: 999,
      sold: 8000,
      featured: false,
      createdAt: new Date()
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories */}
      <Categories />

      {/* Featured Products */}
      <ProductGrid
        products={featuredProducts}
        title="热门推荐"
        showViewAll={true}
        viewAllLink="/shop"
      />

      {/* Banner */}
      <section className="py-12">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                安全可靠的充值服务
              </h2>
              <p className="text-gray-600 mb-6">
                我们提供7x24小时不间断的充值服务，支持多种支付方式，
                资金安全有保障，让您的游戏生活更加便捷。
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                  官方渠道
                </span>
                <span className="px-4 py-2 bg-secondary-50 text-secondary-600 rounded-full text-sm font-medium">
                  快速到账
                </span>
                <span className="px-4 py-2 bg-accent-50 text-accent-600 rounded-full text-sm font-medium">
                  安全保障
                </span>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                alt="Safe Payment"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
