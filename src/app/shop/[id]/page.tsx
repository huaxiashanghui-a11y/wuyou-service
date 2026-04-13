import ProductDetailClient from './ProductDetailClient'
import { notFound } from 'next/navigation'

// Demo products
const products = {
  '1': {
    id: '1',
    name: '王者荣耀点卡 100元',
    description: '官方直充，快速到账，安全可靠。支持微信、支付宝、QQ钱包等多种支付方式。充值后直接到账游戏账户，无需等待。',
    price: 95,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800&h=600&fit=crop',
    category: 'game',
    stock: 999,
    sold: 5200,
    featured: true,
    createdAt: new Date()
  },
  '2': {
    id: '2',
    name: '原神月卡 30元',
    description: '原神祈月礼遇，快速充值。购买后立即到账，畅享原神世界。',
    price: 28,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&h=600&fit=crop',
    category: 'game',
    stock: 999,
    sold: 3500,
    featured: true,
    createdAt: new Date()
  },
  '3': {
    id: '3',
    name: 'Steam充值卡 100美元',
    description: 'Steam钱包充值码，全球通用。适用于Steam平台所有消费。',
    price: 680,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=600&fit=crop',
    category: 'game',
    stock: 50,
    sold: 1200,
    featured: true,
    createdAt: new Date()
  }
}

export function generateStaticParams() {
  return Object.keys(products).map((id) => ({
    id,
  }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const product = products[params.id]
  if (!product) return { title: '商品未找到' }

  return {
    title: `${product.name} - 无忧服务`,
    description: product.description,
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products[params.id]

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
