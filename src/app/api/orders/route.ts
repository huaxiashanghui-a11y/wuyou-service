import { NextRequest, NextResponse } from 'next/server'

// Demo data - in production, use Firebase
const demoProducts: Record<string, any> = {
  '1': {
    id: '1',
    name: '王者荣耀点卡 100元',
    description: '官方直充，快速到账',
    price: 95,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 5200,
    featured: true
  },
  '2': {
    id: '2',
    name: '原神月卡 30元',
    description: '原神祈月礼遇，快速充值',
    price: 28,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 3500,
    featured: true
  },
  '3': {
    id: '3',
    name: 'Steam充值卡 100美元',
    description: 'Steam钱包充值码，全球通用',
    price: 680,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop',
    category: 'game',
    stock: 50,
    sold: 1200,
    featured: true
  },
  '4': {
    id: '4',
    name: '腾讯视频VIP月卡',
    description: '腾讯视频会员，畅享海量影视',
    price: 20,
    originalPrice: 25,
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 999,
    sold: 8000,
    featured: false
  }
}

// Demo cards storage
const demoCards: Record<string, string[][]> = {
  '1': [
    ['WYRC-ABCD-1234-5678'],
    ['WYRC-ABCD-1234-5679'],
    ['WYRC-EFGH-9876-5432']
  ],
  '2': [
    ['YSYK-ABCD-1111-2222'],
    ['YSYK-ABCD-3333-4444']
  ],
  '3': [
    ['STMC-IJKL-2468-1357', 'PWD123']
  ],
  '4': [
    ['TXSP-MNOP-5555-6666']
  ]
}

// Demo orders storage
let demoOrders: any[] = []

function generateOrderId() {
  return `WY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, email } = await request.json()

    // Validate input
    if (!productId || !quantity || !email) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      )
    }

    // Get product
    const product = demoProducts[productId]
    if (!product) {
      return NextResponse.json(
        { success: false, message: '商品不存在' },
        { status: 404 }
      )
    }

    // Check stock
    const availableCards = demoCards[productId] || []
    if (availableCards.length < quantity) {
      return NextResponse.json(
        { success: false, message: '库存不足' },
        { status: 400 }
      )
    }

    // Get cards
    const cards = availableCards.splice(0, quantity)

    // Create order
    const orderId = generateOrderId()
    const totalAmount = product.price * quantity

    const order = {
      id: orderId,
      orderId,
      email,
      productId,
      productName: product.name,
      quantity,
      totalAmount,
      cards: cards.map((card, index) => ({
        code: card[0],
        password: card[1] || null
      })),
      status: 'completed',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString()
    }

    // Save order
    demoOrders.push(order)

    // Update product stock (demo)
    if (demoProducts[productId]) {
      demoProducts[productId].stock -= quantity
      demoProducts[productId].sold += quantity
    }

    // In production, you would:
    // 1. Save to Firebase
    // 2. Send email with cards
    // 3. Process payment

    return NextResponse.json({
      success: true,
      message: '订单创建成功',
      orderId,
      order
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}

// GET - Query orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const email = searchParams.get('email')

    if (!orderId && !email) {
      return NextResponse.json(
        { success: false, message: '请提供订单号或邮箱' },
        { status: 400 }
      )
    }

    // Find order
    let result: any = null

    if (orderId) {
      result = demoOrders.find(o => o.orderId === orderId)
    } else if (email) {
      // Find all orders for this email
      const userOrders = demoOrders.filter(o => o.email === email)
      if (userOrders.length > 0) {
        return NextResponse.json({
          success: true,
          orders: userOrders
        })
      }
    }

    if (result) {
      return NextResponse.json({
        success: true,
        order: result
      })
    } else {
      return NextResponse.json(
        { success: false, message: '未找到订单' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Order query error:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}
