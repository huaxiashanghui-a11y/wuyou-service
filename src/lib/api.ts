import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { Product, Card, Order, Category } from './types';

// Products
export async function getProducts(category?: string): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  let q = category && category !== 'all'
    ? query(productsRef, where('category', '==', category), orderBy('createdAt', 'desc'))
    : query(productsRef, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('featured', '==', true), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProduct(id: string): Promise<Product | null> {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('id', '==', id));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, product);
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const productRef = doc(db, 'products', id);
  await updateDoc(productRef, data);
}

export async function deleteProduct(id: string): Promise<void> {
  const productRef = doc(db, 'products', id);
  await deleteDoc(productRef);
}

// Cards
export async function getAvailableCards(productId: string, quantity: number): Promise<Card[]> {
  const cardsRef = collection(db, 'cards');
  const q = query(
    cardsRef,
    where('productId', '==', productId),
    where('used', '==', false),
    orderBy('createdAt')
  );
  const snapshot = await getDocs(q);
  const cards = snapshot.docs.slice(0, quantity).map(doc => ({ id: doc.id, ...doc.data() } as Card));

  for (const card of cards) {
    await updateDoc(doc(db, 'cards', card.id), { used: true });
  }

  return cards;
}

export async function addCards(productId: string, codes: string[], passwords?: string[]): Promise<void> {
  const cardsRef = collection(db, 'cards');
  const batch = codes.map((code, index) => ({
    productId,
    code,
    password: passwords?.[index] || undefined,
    used: false,
    createdAt: new Date()
  }));

  for (const card of batch) {
    await addDoc(cardsRef, card);
  }
}

export async function getCardCount(productId: string): Promise<number> {
  const cardsRef = collection(db, 'cards');
  const q = query(cardsRef, where('productId', '==', productId), where('used', '==', false));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Orders
export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  const ordersRef = collection(db, 'orders');
  const docRef = await addDoc(ordersRef, order);
  return docRef.id;
}

export async function getOrders(): Promise<Order[]> {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('orderId', '==', orderId));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Order;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  const orderRef = doc(db, 'orders', id);
  await updateDoc(orderRef, { status, paidAt: status === 'paid' ? new Date() : undefined });
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<string> {
  const categoriesRef = collection(db, 'categories');
  const docRef = await addDoc(categoriesRef, category);
  return docRef.id;
}
