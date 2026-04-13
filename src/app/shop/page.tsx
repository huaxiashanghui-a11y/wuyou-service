import ShopClient from './ShopClient'

// Demo products
const products = [
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
    createdAt: new Date()
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
    createdAt: new Date()
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
    createdAt: new Date()
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
    createdAt: new Date()
  }
]

const categories = [
  { id: 'game', name: '游戏点卡' },
  { id: 'gift', name: '礼品卡' },
  { id: 'recharge', name: '话费充值' },
  { id: 'support', name: '增值服务' }
]

export const metadata = {
  title: '点卡商城 - 无忧服务',
  description: '浏览我们精选的游戏点卡和充值服务',
}

export default function ShopPage() {
  return <ShopClient products={products} categories={categories} />
}
