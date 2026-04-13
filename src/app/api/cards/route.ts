import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo
let demoCards: any[] = [
  { id: '1', productId: '1', productName: '王者荣耀点卡 100元', code: 'WYRC-ABCD-1234-5678', used: false, createdAt: new Date().toISOString() },
  { id: '2', productId: '1', productName: '王者荣耀点卡 100元', code: 'WYRC-ABCD-1234-5679', used: true, createdAt: new Date().toISOString() },
  { id: '3', productId: '2', productName: '原神月卡 30元', code: 'YSYK-EFGH-9876-5432', used: false, createdAt: new Date().toISOString() },
  { id: '4', productId: '3', productName: 'Steam充值卡 100美元', code: 'STMC-IJKL-2468-1357', password: 'PWD123', used: false, createdAt: new Date().toISOString() },
]

// GET - Get cards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const status = searchParams.get('status')

    let result = demoCards

    if (productId) {
      result = result.filter(c => c.productId === productId)
    }

    if (status === 'available') {
      result = result.filter(c => !c.used)
    } else if (status === 'used') {
      result = result.filter(c => c.used)
    }

    return NextResponse.json({
      success: true,
      cards: result,
      total: result.length,
      available: result.filter((c: any) => !c.used).length
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}

// POST - Add cards
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    // In production, verify admin token
    // if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    //   return NextResponse.json({ success: false, message: '未授权' }, { status: 401 })
    // }

    const { productId, codes, passwords } = await request.json()

    if (!productId || !codes || !Array.isArray(codes)) {
      return NextResponse.json(
        { success: false, message: '参数错误' },
        { status: 400 }
      )
    }

    const newCards = codes.map((code: string, index: number) => ({
      id: `card-${Date.now()}-${index}`,
      productId,
      productName: '', // Would be fetched from products
      code: code.trim(),
      password: passwords?.[index]?.trim() || null,
      used: false,
      createdAt: new Date().toISOString()
    }))

    demoCards.push(...newCards)

    return NextResponse.json({
      success: true,
      message: `成功导入 ${newCards.length} 个卡密`,
      count: newCards.length
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}

// DELETE - Delete card
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('id')

    if (!cardId) {
      return NextResponse.json(
        { success: false, message: '缺少卡密ID' },
        { status: 400 }
      )
    }

    const cardIndex = demoCards.findIndex(c => c.id === cardId)
    if (cardIndex === -1) {
      return NextResponse.json(
        { success: false, message: '卡密不存在' },
        { status: 404 }
      )
    }

    demoCards.splice(cardIndex, 1)

    return NextResponse.json({
      success: true,
      message: '卡密已删除'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}
