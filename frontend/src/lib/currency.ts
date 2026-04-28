import crypto from 'crypto';

// ============================================
// 币种换算常量
// 来源：forex 页面 1 USD = 7.24 CNY, 1 USD = 2100 MMK
// ============================================

/** CNY/MMK: 1 元 = 100 分/pyas (minor units) */
export const MINOR_FACTOR = 100;

/** USDT: 1 USDT = 1,000,000 micro units */
export const USDT_MICRO_FACTOR = 1_000_000;

/** 汇率: 1 CNY ≈ 0.14 USDT */
export const FX_USDT_PER_CNY = 0.14;

/** 汇率: 1 CNY ≈ 290 MMK (2100/7.24 ≈ 290) */
export const FX_MMK_PER_CNY = 290;

/** 预计算整数换算倍率: CNY fen → USDT micro (0.14 × 100 × 100 = 1400) */
const USDT_MULTIPLIER = 1400;

// ============================================
// 换算函数
// ============================================

/**
 * 将人民币元转为 minor 单位（分）
 * 1 CNY = 100 fen
 */
export function toCnyMinor(yuan: number): number {
  return Math.floor(yuan * MINOR_FACTOR);
}

/**
 * 计算购物车商品总价的 CNY minor 值
 */
export function itemsTotalCnyMinor(
  items: { price: number; quantity: number }[]
): number {
  const totalYuan = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  return toCnyMinor(totalYuan);
}

/**
 * 将 CNY minor 金额换算为目标币种的支付金额
 * - CNY: 不变
 * - MMK: minor units (pyas)，Math.ceil
 * - USDT: micro units，Math.ceil
 */
export function convertToPayAmount(
  cnyMinor: number,
  targetCurrency: string
): number {
  switch (targetCurrency.toUpperCase()) {
    case 'CNY':
      return cnyMinor; // 已是 minor
    case 'MMK':
      return Math.ceil(cnyMinor * FX_MMK_PER_CNY);
    case 'USDT':
      return Math.ceil(cnyMinor * USDT_MULTIPLIER);
    default:
      throw new Error(`Unsupported currency: ${targetCurrency}`);
  }
}

/**
 * 获取汇率字符串快照（用于存入 fx_rate_snapshot）
 */
export function getFxRateSnapshot(targetCurrency: string): string {
  switch (targetCurrency.toUpperCase()) {
    case 'CNY':
      return '1:1';
    case 'MMK':
      return `mmk_per_cny=${FX_MMK_PER_CNY}`;
    case 'USDT':
      return `usdt_per_cny=${FX_USDT_PER_CNY}`;
    default:
      return 'unknown';
  }
}

/**
 * 格式化支付金额显示
 */
export function formatPayAmount(
  minorOrMicro: number,
  currency: string
): string {
  switch (currency.toUpperCase()) {
    case 'CNY':
      return `¥${(minorOrMicro / MINOR_FACTOR).toFixed(2)}`;
    case 'MMK':
      return `K${(minorOrMicro / MINOR_FACTOR).toFixed(0)}`;
    case 'USDT':
      return `$${(minorOrMicro / USDT_MICRO_FACTOR).toFixed(2)}`;
    default:
      return `${minorOrMicro}`;
  }
}

/**
 * 获取币种符号
 */
export function getCurrencySymbol(currency: string): string {
  switch (currency.toUpperCase()) {
    case 'CNY':
      return '¥';
    case 'MMK':
      return 'K';
    case 'USDT':
      return '$';
    default:
      return '';
  }
}

/**
 * 对 items 数组计算 SHA256 hash（用于报价防篡改）
 */
export function hashItems(
  items: { productId: string; quantity: number; price: number }[]
): string {
  // 标准化排序确保相同内容产生相同 hash
  const normalized = items
    .map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
    .sort((a, b) => a.productId.localeCompare(b.productId));
  const json = JSON.stringify(normalized);
  return crypto.createHash('sha256').update(json).digest('hex');
}
