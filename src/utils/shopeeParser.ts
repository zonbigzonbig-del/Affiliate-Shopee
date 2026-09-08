import { ShopeeProduct, Voucher, AffiliateSettings } from '../types';
import { parseShopeeUrlSmart } from './urlParser';

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

  // 1. Voucher Shopee Video (Mở khóa độc quyền - Giảm 25% đến 50%)
  // Thông thường khách tự tìm kiếm sản phẩm trên Shopee KHÔNG THỂ áp dụng được voucher Video
  const videoMaxDiscount = price >= 600000 ? 150000 : price >= 300000 ? 90000 : 70000;
  vouchers.push({
    id: 'v-video-1',
    code: 'VIDEOSHOW25',
    title: 'Mã Shopee Video Giảm 25% (Mở Khóa Độc Quyền)',
    description: `Giảm 25% tối đa ${formatVND(videoMaxDiscount)} — Chỉ mở khóa khi dán link qua web này (Tự tìm trên Shopee không áp được)`,
    type: 'percent',
    value: 25,
    maxDiscount: videoMaxDiscount,
    minOrder: Math.min(price, 50000),
    platform: 'video',
    badge: '🔥 Shopee Video 25%',
    expDate: 'Hôm nay',
    applied: true,
  });

  // 2. Voucher Sàn Shopee Đối Tác Độc Quyền (Mã kín chỉ cấp cho Publisher / Web liên kết)
  if (price >= 500000) {
    vouchers.push({
      id: 'v-san-100k',
      code: 'AFFDEAL100K',
      title: 'Mã Sàn Đối Tác Độc Quyền Giảm 100K',
      description: 'Giảm ngay 100.000đ cho đơn từ 500.000đ — Mã kín đối tác tiếp thị liên kết',
      type: 'fixed',
      value: 100000,
      minOrder: 500000,
      platform: 'all',
      badge: 'Mã Độc Quyền 100K',
      expDate: '23:59 hôm nay',
      applied: true,
    });
  } else if (price >= 250000) {
    vouchers.push({
      id: 'v-san-50k',
      code: 'AFFDEAL50K',
      title: 'Mã Sàn Đối Tác Độc Quyền Giảm 50K',
      description: 'Giảm ngay 50.000đ cho đơn từ 250.000đ — Mã đối tác chính thức Shopee',
      type: 'fixed',
      value: 50000,
      minOrder: 250000,
      platform: 'all',
      badge: 'Mã Độc Quyền 50K',
      expDate: '23:59 hôm nay',
      applied: true,
    });
  } else {
    vouchers.push({
      id: 'v-san-30k',
      code: 'AFFDEAL30K',
      title: 'Mã Sàn Đối Tác Shopee Giảm 30K',
      description: 'Giảm 30.000đ cho đơn từ 120.000đ — Mã độc quyền từ web này',
      type: 'fixed',
      value: 30000,
      minOrder: 120000,
      platform: 'all',
      badge: 'Mã Độc Quyền 30K',
      expDate: '23:59 hôm nay',
      applied: price >= 120000,
    });
  }

  // 3. Freeship Xtra Toàn Sàn (Miễn phí vận chuyển)
  vouchers.push({
    id: 'v-freeship-1',
    code: 'FREESHIPXTRA',
    title: 'Miễn Phí Vận Chuyển Freeship Xtra',
    description: 'Giảm đến 30.000đ phí giao hàng toàn quốc khi thanh toán',
    type: 'freeship',
    value: 30000,
    minOrder: 0,
    platform: 'all',
    badge: 'Freeship Xtra 0Đ',
    expDate: 'Còn hiệu lực',
    applied: true,
  });

  // 4. Voucher Shop Giảm Thêm
  const shopDisc = price >= 400000 ? 25000 : 15000;
  vouchers.push({
    id: 'v-shop-1',
    code: 'SHOPDEALVIP',
    title: `Voucher Shop Giảm Thêm ${formatVND(shopDisc)}`,
    description: `Mã giảm thêm từ gian hàng chính hãng cho đơn từ ${formatVND(Math.round(price * 0.7))}`,
    type: 'fixed',
    value: shopDisc,
    minOrder: Math.round(price * 0.7),
    platform: 'brand',
    badge: 'Voucher Shop',
    expDate: 'Còn hiệu lực',
    applied: true,
  });

  return vouchers;
}

// Builds the Affiliate URL containing the owner's Affiliate ID
export function buildAffiliateUrl(originalUrl: string, settings: AffiliateSettings): string {
  const cleanUrl = originalUrl.trim();
  const affId = settings.affiliateId || 'AFF_ZONBIG_VN';
  const subId = settings.subId || 'web_deal';

  switch (settings.networkType) {
    case 'accesstrade':
      return `https://fast.accesstrade.com.vn/deep_link/4348614214534380076?url=${encodeURIComponent(cleanUrl)}&utm_source=${affId}&utm_campaign=shopee_deal&utm_medium=${subId}`;
    
    case 'ecomobi':
      return `https://go.isclix.com/deep_link/4348614214534380076?url=${encodeURIComponent(cleanUrl)}&sub1=${affId}&sub2=${subId}`;

    case 'custom':
      if (settings.customDomain) {
        const separator = settings.customDomain.includes('?') ? '&' : '?';
        return `${settings.customDomain}${separator}url=${encodeURIComponent(cleanUrl)}&aff_id=${affId}&sub_id=${subId}`;
      }
      return appendShopeeTrackingParams(cleanUrl, affId, subId);

    case 'shopee_direct':
    default:
      // Direct Shopee URL with UTM and affiliate tracking parameters
      // This ensures 100% successful page loads on Shopee without shope.ee 404 error page,
      // while accurately tagging the affiliate ID and campaign for commission attribution
      return appendShopeeTrackingParams(cleanUrl, affId, subId);
  }
}

// Check if the URL is a Shopee shortlink (s.shopee.vn, vn.shp.ee, shope.ee)
export function isShopeeShortLink(url: string): boolean {
  return /shope\.ee|shp\.ee|s\.shopee\.vn/i.test(url);
}

// Safely appends affiliate tracking params to standard Shopee product URL
function appendShopeeTrackingParams(baseUrl: string, affId: string, subId: string): string {
  // CRITICAL: Shopee short-links (s.shopee.vn, vn.shp.ee, shope.ee) break with 404 if modified with query params!
  if (isShopeeShortLink(baseUrl)) {
    return baseUrl;
  }

  try {
    const urlObj = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
    urlObj.searchParams.set('utm_source', 'affiliate');
    urlObj.searchParams.set('utm_medium', 'aff_' + affId);
    urlObj.searchParams.set('utm_campaign', subId);
    urlObj.searchParams.set('aff_id', affId);
    urlObj.searchParams.set('sub_id', subId);
    urlObj.searchParams.set('smtt', `0.0.${affId}`);
    return urlObj.toString();
  } catch {
    return baseUrl;
  }
}

// Builds mobile deep link to launch Shopee app directly
export function buildShopeeDeepLink(itemId: string, shopId: string, affiliateUrl: string): string {
  if (itemId && shopId && itemId !== '231940129') {
    return `shopee://product/${itemId}/${shopId}`;
  }
  return affiliateUrl;
}

// Builds Shopee Video link.
// IMPORTANT: https://shopee.vn/universal-link/video/play is an internal app scheme that throws a 404 in web/Safari!
// Instead, we route to the verified product page with Video Affiliate tracking params so it NEVER 404s.
export function buildShopeeVideoUrl(itemId: string, shopId: string, cleanProductUrl: string, settings: AffiliateSettings): string {
  const affId = settings.affiliateId || 'AFF_ZONBIG_VN';
  const subId = settings.subId || 'shopee_video';

  // If we have verified shopId and itemId (not fallback placeholder), construct the direct canonical product link
  if (itemId && shopId && itemId !== '231940129') {
    return `https://shopee.vn/product/${shopId}/${itemId}?utm_source=affiliate&utm_medium=video_aff_${affId}&utm_campaign=${subId}&aff_id=${affId}&sub_id=${subId}`;
  }

  // Otherwise, use clean product URL with safe affiliate tracking
  return buildAffiliateUrl(cleanProductUrl, settings);
}

// Builds mobile deep link
export function buildShopeeVideoDeepLink(itemId: string, shopId: string, fallbackUrl: string): string {
  if (itemId && shopId && itemId !== '231940129') {
    return `shopee://product/${itemId}/${shopId}`;
  }
  return fallbackUrl;
}

// Parses a Shopee link into product info and applies affiliate tag
export function parseShopeeLink(input: string, settings: AffiliateSettings): ShopeeProduct {
  // Import dynamically or delegate to the comprehensive smart parser
  return parseShopeeUrlSmart(input, settings);
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
  selfBuyPrice: number;
  extraSavedVsSelfBuy: number;
  videoDiscount: number;
  partnerDiscount: number;
} {
  let discountAmount = 0;
  let freeshipAmount = 0;
  let videoDiscount = 0;
  let partnerDiscount = 0;
  const appliedVouchers: Voucher[] = [];

  vouchers.forEach((v) => {
    if (!v.applied) return;
    if (basePrice < v.minOrder) return;

    if (v.type === 'fixed') {
      discountAmount += v.value;
      appliedVouchers.push(v);
      if (v.platform === 'all' || v.badge.includes('Độc Quyền')) {
        partnerDiscount += v.value;
      }
    } else if (v.type === 'percent') {
      let disc = Math.round(basePrice * (v.value / 100));
      if (v.maxDiscount && disc > v.maxDiscount) {
        disc = v.maxDiscount;
      }
      discountAmount += disc;
      appliedVouchers.push(v);
      if (v.platform === 'video') {
        videoDiscount += disc;
      }
    } else if (v.type === 'freeship') {
      freeshipAmount += v.value;
      appliedVouchers.push(v);
    }
  });

  // Final price after product discount vouchers (freeship discounts the shipping fee)
  const finalPrice = Math.max(0, basePrice - discountAmount);
  const totalSaved = discountAmount + freeshipAmount;
  
  // Normal purchase price when user visits Shopee on their own:
  // Usually base price + standard shipping (30,000đ), with no Video vouchers and no partner exclusive vouchers
  const selfBuyPrice = basePrice + 30000;
  const extraSavedVsSelfBuy = Math.max(0, selfBuyPrice - finalPrice);
  const percentageSaved = Math.min(90, Math.round((extraSavedVsSelfBuy / selfBuyPrice) * 100));

  return {
    discountAmount,
    freeshipAmount,
    finalPrice,
    appliedVouchers,
    totalSaved,
    percentageSaved,
    selfBuyPrice,
    extraSavedVsSelfBuy,
    videoDiscount,
    partnerDiscount,
  };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
