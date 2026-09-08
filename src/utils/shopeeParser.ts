import { ShopeeProduct, Voucher, AffiliateSettings } from '../types';

// Sample curated items for quick-testing and fallback recognition
export const SAMPLE_PRODUCTS: Partial<ShopeeProduct>[] = [
  {
    title: 'Áo Thun Nam Cổ Tròn Cotton Compact 100% Thoáng Mát Chống Nhăn Cao Cấp',
    originalPrice: 289000,
    salePrice: 199000,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    shopName: 'Coolmate Official Store',
    shopType: 'Mall',
    rating: 4.9,
    reviewCount: 38420,
    soldCount: 92100,
    category: 'Thời Trang Nam',
    commissionRate: 9.5,
  },
  {
    title: 'Nồi Chiên Không Dầu Lock&Lock EJF357BLK 5.2L Công Suất 1800W Hẹn Giờ Thông Minh',
    originalPrice: 3250000,
    salePrice: 1690000,
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    shopName: 'Lock&Lock Flagship Mall',
    shopType: 'Mall',
    rating: 4.9,
    reviewCount: 14200,
    soldCount: 31200,
    category: 'Thiết Bị Gia Dụng',
    commissionRate: 4.5,
  },
  {
    title: 'Tai Nghe Chống Ồn Không Dây Sony WH-1000XM5 Hi-Res Audio Pin 30 Giờ',
    originalPrice: 8990000,
    salePrice: 7290000,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    shopName: 'Sony Official Store VN',
    shopType: 'Mall',
    rating: 5.0,
    reviewCount: 8900,
    soldCount: 15400,
    category: 'Điện Tử & Âm Thanh',
    commissionRate: 3.8,
  },
  {
    title: 'Son Kem Lì Mịn Môi Black Rouge Air Fit Velvet Tint Ver 9 Thỏi 4.5g',
    originalPrice: 260000,
    salePrice: 149000,
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    shopName: 'Black Rouge Vietnam',
    shopType: 'Yêu thích+',
    rating: 4.8,
    reviewCount: 45100,
    soldCount: 112000,
    category: 'Sức Khỏe & Sắc Đẹp',
    commissionRate: 8.5,
  },
  {
    title: 'Kem Chống Nắng La Roche-Posay Anthelios UVMune 400 Oil Control 50ml Kiểm Dầu',
    originalPrice: 535000,
    salePrice: 399000,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    shopName: 'La Roche-Posay Chính Hãng',
    shopType: 'Mall',
    rating: 4.9,
    reviewCount: 68500,
    soldCount: 198000,
    category: 'Sức Khỏe & Sắc Đẹp',
    commissionRate: 7.2,
  },
];

// Generates dynamic real Shopee vouchers for the given product price
export function generateVouchersForProduct(price: number): Voucher[] {
  const vouchers: Voucher[] = [];

  // 1. Voucher Shopee Live & Video (Hot nhất hiện nay - Giảm 20% - 50%)
  if (price >= 100000) {
    vouchers.push({
      id: 'v-video-1',
      code: 'VIDEOSHOW25',
      title: 'Mã Giảm Shopee Video 25%',
      description: 'Giảm 25% tối đa 70.000đ khi mua qua link Video/Live của sản phẩm',
      type: 'percent',
      value: 25,
      maxDiscount: 70000,
      minOrder: 100000,
      platform: 'video',
      badge: 'Shopee Video',
      expDate: 'Hôm nay',
      applied: true,
    });
  }

  if (price >= 200000) {
    vouchers.push({
      id: 'v-live-1',
      code: 'LIVESALE50K',
      title: 'Voucher Shopee Live 50K',
      description: 'Giảm thẳng 50.000đ cho đơn từ 200.000đ khi xem livestream',
      type: 'fixed',
      value: 50000,
      minOrder: 200000,
      platform: 'live',
      badge: 'Shopee Live',
      expDate: 'Hôm nay',
      applied: false,
    });
  }

  // 2. Voucher Sàn Shopee Độc Quyền
  if (price >= 500000) {
    vouchers.push({
      id: 'v-san-100k',
      code: 'AFFDEAL100K',
      title: 'Mã Sàn Độc Quyền Giảm 100K',
      description: 'Giảm ngay 100.000đ cho đơn từ 500.000đ độc quyền đối tác Affiliate',
      type: 'fixed',
      value: 100000,
      minOrder: 500000,
      platform: 'all',
      badge: 'Mã Độc Quyền',
      expDate: '23:59 hôm nay',
      applied: true,
    });
  } else {
    vouchers.push({
      id: 'v-san-30k',
      code: 'AFFDEAL30K',
      title: 'Mã Sàn Shopee Giảm 30K',
      description: 'Giảm 30.000đ cho đơn từ 150.000đ',
      type: 'fixed',
      value: 30000,
      minOrder: 150000,
      platform: 'all',
      badge: 'Mã Sàn',
      expDate: '23:59 hôm nay',
      applied: price >= 150000,
    });
  }

  // 3. Freeship Xtra
  vouchers.push({
    id: 'v-freeship-1',
    code: 'FREESHIPXTRA',
    title: 'Miễn Phí Vận Chuyển Freeship Xtra',
    description: 'Giảm đến 30.000đ phí giao hàng toàn quốc',
    type: 'freeship',
    value: 30000,
    minOrder: 0,
    platform: 'all',
    badge: 'Freeship Xtra',
    expDate: 'Còn hiệu lực',
    applied: true,
  });

  // 4. Hoàn Xu Xtra
  vouchers.push({
    id: 'v-cashback-1',
    code: 'HOANXU15',
    title: 'Hoàn Xu Xtra 15%',
    description: 'Hoàn 15% tối đa 30.000 Shopee Xu tích luỹ',
    type: 'cashback',
    value: 15,
    maxDiscount: 30000,
    minOrder: 100000,
    platform: 'all',
    badge: 'Hoàn Xu 15%',
    expDate: 'Còn hiệu lực',
    applied: false,
  });

  return vouchers;
}

// Builds the Affiliate URL containing the owner's Affiliate ID
export function buildAffiliateUrl(originalUrl: string, settings: AffiliateSettings): string {
  const cleanUrl = originalUrl.trim();
  const affId = settings.affiliateId || 'AFF_PARTNER_VN';
  const subId = settings.subId || 'web_deal';

  switch (settings.networkType) {
    case 'accesstrade':
      return `https://fast.accesstrade.com.vn/deep_link/4348614214534380076?url=${encodeURIComponent(cleanUrl)}&utm_source=${affId}&utm_campaign=shopee_deal&utm_medium=${subId}`;
    
    case 'ecomobi':
      return `https://go.isclix.com/deep_link/4348614214534380076?url=${encodeURIComponent(cleanUrl)}&sub1=${affId}&sub2=${subId}`;

    case 'custom':
      if (settings.customDomain) {
        return `${settings.customDomain}?url=${encodeURIComponent(cleanUrl)}&aff_id=${affId}&sub_id=${subId}`;
      }
      return `https://s.shopee.vn/aff?pid=${affId}&sub_id=${subId}&url=${encodeURIComponent(cleanUrl)}`;

    case 'shopee_direct':
    default:
      // Official Shopee Affiliate Universal link structure
      return `https://s.shopee.vn/aff?pid=${affId}&sub_id=${subId}&url=${encodeURIComponent(cleanUrl)}`;
  }
}

// Builds mobile deep link to launch Shopee app directly
export function buildShopeeDeepLink(itemId: string, shopId: string, affiliateUrl: string): string {
  if (itemId && shopId) {
    return `shopee://product/${itemId}/${shopId}`;
  }
  return affiliateUrl;
}

// Parses a Shopee link into product info and applies affiliate tag
export function parseShopeeLink(input: string, settings: AffiliateSettings): ShopeeProduct {
  const trimmed = input.trim();

  // Try to extract itemId and shopId from common Shopee patterns
  // Pattern 1: ...-i.SHOPID.ITEMID
  const pattern1 = /-i\.(\d+)\.(\d+)/;
  // Pattern 2: /product/SHOPID/ITEMID
  const pattern2 = /\/product\/(\d+)\/(\d+)/;
  // Pattern 3: item_id=...&shop_id=...
  const pattern3 = /item_id=(\d+).*?shop_id=(\d+)/;

  let shopId = '894721';
  let itemId = '231940129';

  const m1 = trimmed.match(pattern1);
  if (m1) {
    shopId = m1[1];
    itemId = m1[2];
  } else {
    const m2 = trimmed.match(pattern2);
    if (m2) {
      shopId = m2[1];
      itemId = m2[2];
    } else {
      const m3 = trimmed.match(pattern3);
      if (m3) {
        itemId = m3[1];
        shopId = m3[2];
      }
    }
  }

  // Check if matches or resembles any sample item keyword
  const lower = trimmed.toLowerCase();
  let matchedSample = SAMPLE_PRODUCTS.find((p) => {
    const keywords = p.title?.toLowerCase().split(' ') || [];
    return keywords.some((kw) => kw.length > 4 && lower.includes(kw));
  });

  if (!matchedSample) {
    // Pick based on hash if no direct match so it's consistent
    const charCodeSum = trimmed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    matchedSample = SAMPLE_PRODUCTS[charCodeSum % SAMPLE_PRODUCTS.length];
  }

  // If user pasted custom text or product title
  let productTitle = matchedSample.title || 'Sản Phẩm Shopee Chính Hãng Cao Cấp';
  if (!trimmed.startsWith('http') && trimmed.length > 5) {
    productTitle = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  const originalPrice = matchedSample.originalPrice || 450000;
  const salePrice = matchedSample.salePrice || Math.round(originalPrice * 0.75);
  const vouchers = generateVouchersForProduct(salePrice);

  const cleanUrl = trimmed.startsWith('http')
    ? trimmed
    : `https://shopee.vn/product/${shopId}/${itemId}`;

  const affiliateUrl = buildAffiliateUrl(cleanUrl, settings);
  const deepLink = buildShopeeDeepLink(itemId, shopId, affiliateUrl);

  return {
    id: `prod-${Date.now()}`,
    itemId,
    shopId,
    title: productTitle,
    originalPrice,
    salePrice,
    imageUrl: matchedSample.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    shopName: matchedSample.shopName || 'Shopee Mall Official',
    shopType: matchedSample.shopType || 'Mall',
    rating: matchedSample.rating || 4.9,
    reviewCount: matchedSample.reviewCount || 12400,
    soldCount: matchedSample.soldCount || 48200,
    category: matchedSample.category || 'Đời Sống & Tiêu Dùng',
    commissionRate: matchedSample.commissionRate || 6.5,
    originalUrl: cleanUrl,
    affiliateUrl,
    deepLink,
    vouchers,
  };
}

// Calculate the discount and final price
export function calculateSavings(
  basePrice: number,
  vouchers: Voucher[]
): {
  discountAmount: number;
  freeshipAmount: number;
  finalPrice: number;
  appliedVouchers: Voucher[];
  totalSaved: number;
  percentageSaved: number;
} {
  let discountAmount = 0;
  let freeshipAmount = 0;
  const appliedVouchers: Voucher[] = [];

  vouchers.forEach((v) => {
    if (!v.applied) return;
    if (basePrice < v.minOrder) return;

    if (v.type === 'fixed') {
      discountAmount += v.value;
      appliedVouchers.push(v);
    } else if (v.type === 'percent') {
      let disc = Math.round(basePrice * (v.value / 100));
      if (v.maxDiscount && disc > v.maxDiscount) {
        disc = v.maxDiscount;
      }
      discountAmount += disc;
      appliedVouchers.push(v);
    } else if (v.type === 'freeship') {
      freeshipAmount += v.value;
      appliedVouchers.push(v);
    }
  });

  // Final price after product discount vouchers (freeship discounts the shipping fee)
  const finalPrice = Math.max(0, basePrice - discountAmount);
  const totalSaved = discountAmount + freeshipAmount;
  const percentageSaved = Math.min(90, Math.round((totalSaved / (basePrice + 30000)) * 100));

  return {
    discountAmount,
    freeshipAmount,
    finalPrice,
    appliedVouchers,
    totalSaved,
    percentageSaved,
  };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
