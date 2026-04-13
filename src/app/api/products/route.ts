import { NextRequest, NextResponse } from 'next/server';

// 模拟商品数据
let products = [
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
    featured: false,
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
  }
];

// GET - 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    let filteredProducts = [...products];

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }

    const total = filteredProducts.length;
    const start = (page - 1) * pageSize;
    const items = filteredProducts.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

// POST - 创建商品
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newProduct = {
      ...data,
      id: Date.now().toString(),
      sold: 0,
      sort: products.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);

    return NextResponse.json({
      success: true,
      message: '商品创建成功',
      data: newProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
