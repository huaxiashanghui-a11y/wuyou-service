import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Demo admin password - in production, use environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      return NextResponse.json({ success: true, message: '登录成功' })
    } else {
      return NextResponse.json(
        { success: false, message: '密码错误' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}
