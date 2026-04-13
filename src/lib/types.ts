export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  sold: number;
  featured: boolean;
  createdAt: any;
}

export interface Card {
  id: string;
  productId: string;
  code: string;
  password?: string;
  used: boolean;
  usedBy?: string;
  usedAt?: any;
  createdAt: any;
}

export interface Order {
  id: string;
  orderId: string;
  email: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  cards: Card[];
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  createdAt: any;
  paidAt?: any;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}
