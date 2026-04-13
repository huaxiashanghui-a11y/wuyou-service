import HeroCarousel from '@/components/HeroCarousel';
import Categories from '@/components/Categories';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

// 模拟热门商品数据
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
    status: 'active',
    sort: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    status: 'active',
    sort: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    status: 'active',
    sort: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    status: 'active',
    sort: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: '网易云音乐VIP年卡',
    description: '网易云音乐年度会员，高品质音乐',
    price: 158,
    originalPrice: 188,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 200,
    sold: 1500,
    featured: false,
    status: 'active',
    sort: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: '英雄联盟点券 1000',
    description: 'LOL官方点券充值，秒到账',
    price: 85,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 4500,
    featured: false,
    status: 'active',
    sort: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: '手机话费充值 100元',
    description: '全网运营商通用，秒到账',
    price: 98,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'recharge',
    stock: 999,
    sold: 12000,
    featured: false,
    status: 'active',
    sort: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'QQ超级会员月卡',
    description: 'QQ超级会员特权，尊享体验',
    price: 20,
    originalPrice: 25,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 500,
    sold: 3000,
    featured: false,
    status: 'active',
    sort: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function HomePage() {
  return (
    <div className="container-custom py-8">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories */}
      <Categories />

      {/* Featured Products */}
      <ProductGrid
        products={featuredProducts.filter(p => p.featured)}
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
                <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium">
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

      {/* More Products */}
      <ProductGrid
        products={featuredProducts.filter(p => !p.featured).slice(0, 4)}
        title="更多商品"
        showViewAll={true}
        viewAllLink="/shop"
      />

      {/* CTA Section */}
      <section className="py-12">
        <div className="glass rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">还有其他问题？</h2>
          <p className="text-gray-600 mb-6">
            我们随时为您提供帮助。请通过以下方式联系我们
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/help"
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              查看帮助文档
            </Link>
            <Link
              href="/query"
              className="px-8 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              查询订单
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
