import { NextRequest, NextResponse } from 'next/server';

// 模拟订单数据
let orders = [
  {
    id: '1',
    orderId: 'WY20240115001',
    email: 'user1@example.com',
    productId: '1',
    productName: '王者荣耀点卡 100元',
    quantity: 1,
    unitPrice: 95,
    totalAmount: 95,
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentTime: new Date().toISOString(),
    cards: [{ code: 'WYRC-ABCD-1234-5678' }]
  },
  {
    id: '2',
    orderId: 'WY20240115002',
    email: 'user2@example.com',
    productId: '2',
    productName: '原神月卡 30元',
    quantity: 2,
    unitPrice: 28,
    totalAmount: 56,
    status: 'paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentTime: new Date().toISOString()
  },
  {
    id: '3',
    orderId: 'WY20240115003',
    email: 'user3@example.com',
    productId: '3',
    productName: 'Steam充值卡 100美元',
    quantity: 1,
    unitPrice: 680,
    totalAmount: 680,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 生成订单号
function generateOrderId() {
  return `WY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// POST - 创建订单
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, email } = await request.json();

    if (!productId || !quantity || !email) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 模拟商品数据
    const products: Record<string, any> = {
      '1': { name: '王者荣耀点卡 100元', price: 95, stock: 999 },
      '2': { name: '原神月卡 30元', price: 28, stock: 999 },
      '3': { name: 'Steam充值卡 100美元', price: 680, stock: 50 }
    };

    const product = products[productId];
    if (!product) {
      return NextResponse.json(
        { success: false, message: '商品不存在' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: '库存不足' },
        { status: 400 }
      );
    }

    // 生成卡密
    const cards = Array.from({ length: quantity }, (_, i) => ({
      code: `${productId.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    }));

    // 创建订单
    const order = {
      id: Date.now().toString(),
      orderId: generateOrderId(),
      email,
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      totalAmount: product.price * quantity,
      status: 'completed' as const,
      cards,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentTime: new Date().toISOString()
    };

    orders.push(order);

    return NextResponse.json({
      success: true,
      message: '订单创建成功',
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

// GET - 查询订单
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');

    if (!orderId && !email) {
      return NextResponse.json(
        { success: false, message: '请提供订单号或邮箱' },
        { status: 400 }
      );
    }

    let result = orders;

    if (orderId) {
      result = result.filter(o => o.orderId === orderId);
    }

    if (email) {
      result = result.filter(o => o.email === email);
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Query orders error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
