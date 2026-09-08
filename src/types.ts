export type ShopType = 'Mall' | 'Yêu thích' | 'Yêu thích+' | 'Shop Uy Tín';

export type VoucherType = 'percent' | 'fixed' | 'freeship' | 'cashback';

export type VoucherPlatform = 'all' | 'live' | 'video' | 'shopeepay' | 'brand';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  type: VoucherType;
  value: number; // percentage (e.g., 20 for 20%) or fixed amount in VND (e.g., 50000)
  maxDiscount?: number; // max discount in VND if percent
  minOrder: number; // minimum order in VND
  platform: VoucherPlatform;
  badge: string;
  expDate: string;
  applied?: boolean;
}

export interface ShopeeProduct {
  id: string;
  itemId: string;
  shopId: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  imageUrl: string;
  shopName: string;
  shopType: ShopType;
  rating: number;
  reviewCount: number;
  soldCount: number;
  category: string;
  commissionRate: number; // in percent, e.g., 8%
  originalUrl: string;
  affiliateUrl: string;
  deepLink: string;
  videoUrl: string; // Direct link opening Shopee Video with attached product
  videoDeepLink: string; // App scheme link to open Shopee Video cart
  videoVoucherDiscount: number; // Max discount saved by Shopee Video voucher
  vouchers: Voucher[];
}

export interface AffiliateSettings {
  affiliateId: string; // e.g., "AFF_ZONBIG_VN" or numeric ID
  subId: string; // tracking sub-id e.g. "web_deal"
  networkType: 'shopee_direct' | 'accesstrade' | 'ecomobi' | 'custom' | 'universal_tag';
  customDomain: string; // e.g. s.shopee.vn or custom redirect
  shopeeVideoCreatorId?: string; // e.g., Creator ID / Shopee Video user
  autoApplyBestVoucher: boolean;
  enableVideoTagging: boolean; // Auto-attach product to Shopee Video to unlock 20-50% off
}

export interface ConvertedHistoryItem {
  id: string;
  timestamp: number;
  title: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  estimatedCommission: number;
  affiliateUrl: string;
}
