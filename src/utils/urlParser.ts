import { ShopeeProduct, Voucher, AffiliateSettings } from '../types';
import {
  generateVouchersForProduct,
  buildAffiliateUrl,
  buildShopeeDeepLink,
  buildShopeeVideoUrl,
  buildShopeeVideoDeepLink
} from './shopeeParser';

// Curated image mappings based on category keywords
const CATEGORY_IMAGE_MAP: { keywords: string[]; image: string; category: string; defaultPrice: number; commissionRate: number }[] = [
  {
    keywords: ['loa', 'speaker', 'bluetooth', 'm503', 'soundbar', 'bass', 'jbl', 'marshall', 'harman'],
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=700&auto=format&fit=crop&q=80',
    category: 'Âm Thanh & Loa Bluetooth',
    defaultPrice: 389000,
    commissionRate: 5.5,
  },
  {
    keywords: ['tai nghe', 'earphone', 'headphone', 'airpods', 'tws', 'in-ear'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
    category: 'Tai Nghe & Âm Thanh',
    defaultPrice: 450000,
    commissionRate: 5.0,
  },
  {
    keywords: ['noi chien', 'noi com', 'bep', 'chao', 'may xay', 'am sieu toc', 'gia dung', 'lock'],
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=700&auto=format&fit=crop&q=80',
    category: 'Thiết Bị Gia Dụng',
    defaultPrice: 1690000,
    commissionRate: 4.5,
  },
  {
    keywords: ['ao', 'quan', 'polo', 'thun', 'so mi', 'vay', 'dam', 'hoodie', 'khoac', 'jean'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
    category: 'Thời Trang & Quần Áo',
    defaultPrice: 249000,
    commissionRate: 9.5,
  },
  {
    keywords: ['giay', 'dep', 'sneaker', 'sandal', 'boots', 'cao got'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80',
    category: 'Giày Dép & Phụ Kiện',
    defaultPrice: 380000,
    commissionRate: 9.0,
  },
  {
    keywords: ['son', 'kem', 'chong nang', 'duong da', 'serum', 'toner', 'nuoc hoa', 'phan', 'my pham'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&auto=format&fit=crop&q=80',
    category: 'Sức Khỏe & Sắc Đẹp',
    defaultPrice: 299000,
    commissionRate: 8.5,
  },
  {
    keywords: ['dien thoai', 'iphone', 'samsung', 'xiaomi', 'ipad', 'laptop', 'ban phim', 'chuot'],
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80',
    category: 'Điện Thoại & Phụ Kiện Công Nghệ',
    defaultPrice: 890000,
    commissionRate: 3.5,
  },
  {
    keywords: ['tui', 'balo', 'vi', 'cap', 'vali'],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&auto=format&fit=crop&q=80',
    category: 'Túi Ví & Balo',
    defaultPrice: 199000,
    commissionRate: 9.0,
  },
  {
    keywords: ['den', 'ban', 'ghe', 'guong', 'nem', 'goi', 'trang tri', 'decor'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=700&auto=format&fit=crop&q=80',
    category: 'Nhà Cửa & Đời Sống',
    defaultPrice: 185000,
    commissionRate: 6.5,
  },
  {
    keywords: ['bim', 'sua', 'ta', 'do choi', 'xe day', 'binh sua'],
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=700&auto=format&fit=crop&q=80',
    category: 'Mẹ & Bé',
    defaultPrice: 320000,
    commissionRate: 6.0,
  }
];

// Clean slug into natural Vietnamese title with capitalization
function formatTitleFromSlug(slug: string): string {
  // Decode URI components
  let text = decodeURIComponent(slug);

  // Remove common Shopee technical suffixes like -i.1234.5678 or ?sp_atk=...
  text = text.replace(/-i\.\d+\.\d+.*$/i, '');
  text = text.replace(/\?.*$/i, '');

  // Split by hyphens, underscores, or spaces
  const words = text
    .split(/[-_+]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0 && !w.startsWith('sp_') && !w.startsWith('utm_'));

  if (words.length === 0) {
    return 'Sản Phẩm Shopee Chính Hãng Cao Cấp';
  }

  // Capitalize properly
  const capitalized = words
    .map((word) => {
      // Keep acronyms like M503, JBL, SONY, TWS, USB, LED as uppercase
      if (/^[a-zA-Z0-9]{1,5}$/.test(word) && /[0-9]/.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  return capitalized;
}

// Extract slug and query params from Shopee URL
export function extractShopeeSlugInfo(rawUrl: string): {
  slugText: string;
  itemId: string;
  shopId: string;
} {
  const trimmed = rawUrl.trim();

  let itemId = '231940129';
  let shopId = '894721';
  let slugText = '';

  // Extract IDs
  const m1 = trimmed.match(/-i\.(\d+)\.(\d+)/);
  if (m1) {
    shopId = m1[1];
    itemId = m1[2];
  } else {
    const m2 = trimmed.match(/\/product\/(\d+)\/(\d+)/);
    if (m2) {
      shopId = m2[1];
      itemId = m2[2];
    } else {
      const m3 = trimmed.match(/item_id=(\d+).*?shop_id=(\d+)/);
      if (m3) {
        itemId = m3[1];
        shopId = m3[2];
      }
    }
  }

  // Extract slug from path
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const pathname = parsed.pathname; // e.g. /Loa-Bluetooth-M503-C...-i.123.456
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      // The product slug is usually the first segment or the one before -i.
      const candidate = segments.find((s) => s.includes('-') || s.length > 3) || segments[0];
      slugText = candidate;
    }
  } catch {
    // If not a valid URL, treat the input as text or part of URL
    slugText = trimmed;
  }

  return { slugText, itemId, shopId };
}

// Normalize Vietnamese characters without accents for fuzzy matching
function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function parseShopeeUrlSmart(
  input: string,
  settings: AffiliateSettings
): ShopeeProduct {
  const trimmed = input.trim();
  const { slugText, itemId, shopId } = extractShopeeSlugInfo(trimmed);

  const cleanTitle = slugText ? formatTitleFromSlug(slugText) : 'Sản Phẩm Shopee Chính Hãng';
  const normalizedSlug = removeVietnameseTones(cleanTitle + ' ' + trimmed);

  // Find best matching category by keywords
  let matchedCategory = CATEGORY_IMAGE_MAP.find((cat) =>
    cat.keywords.some((kw) => normalizedSlug.includes(removeVietnameseTones(kw)))
  );

  // If still no category match, default to General/Lifestyle
  if (!matchedCategory) {
    matchedCategory = {
      keywords: [],
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&auto=format&fit=crop&q=80',
      category: 'Đời Sống & Tiêu Dùng',
      defaultPrice: 350000,
      commissionRate: 6.5,
    };
  }

  // Generate realistic shop name and prices tailored to the product
  let shopName = 'Shopee Mall Official';
  let shopType: 'Mall' | 'Yêu thích' | 'Yêu thích+' = 'Mall';

  if (normalizedSlug.includes('coolmate')) {
    shopName = 'Coolmate Official Store';
  } else if (normalizedSlug.includes('sony')) {
    shopName = 'Sony Official Store VN';
  } else if (normalizedSlug.includes('lock')) {
    shopName = 'Lock&Lock Flagship Mall';
  } else if (normalizedSlug.includes('black rouge')) {
    shopName = 'Black Rouge Vietnam';
    shopType = 'Yêu thích+';
  } else if (normalizedSlug.includes('la roche')) {
    shopName = 'La Roche-Posay Chính Hãng';
  } else if (normalizedSlug.includes('loa') || normalizedSlug.includes('audio')) {
    shopName = 'Audio Pro Vietnam Official';
    shopType = 'Yêu thích+';
  } else {
    shopName = `${cleanTitle.split(' ').slice(0, 3).join(' ')} Flagship`;
  }

  // Estimate realistic price based on product category and item id hash
  const hash = (itemId || '12345').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const priceVariation = (hash % 15) * 10000;
  const originalPrice = matchedCategory.defaultPrice + priceVariation;
  const salePrice = Math.round(originalPrice * 0.72 / 1000) * 1000;

  const vouchers = generateVouchersForProduct(salePrice);

  const cleanUrl = trimmed.startsWith('http')
    ? trimmed
    : `https://shopee.vn/product/${shopId}/${itemId}`;

  const affiliateUrl = buildAffiliateUrl(cleanUrl, settings);
  const deepLink = buildShopeeDeepLink(itemId, shopId, affiliateUrl);
  const videoUrl = buildShopeeVideoUrl(itemId, shopId, cleanUrl, settings);
  const videoDeepLink = buildShopeeVideoDeepLink(itemId, shopId, videoUrl);

  // Shopee Video vouchers typically give 20% - 25% discount, capped at 70,000 VND
  const videoVoucherDiscount = Math.min(Math.round(salePrice * 0.25), 70000);

  return {
    id: `prod-${Date.now()}`,
    itemId,
    shopId,
    title: cleanTitle,
    originalPrice,
    salePrice,
    imageUrl: matchedCategory.image,
    shopName,
    shopType,
    rating: 4.8 + ((hash % 3) / 10),
    reviewCount: 2400 + (hash * 37),
    soldCount: 8900 + (hash * 93),
    category: matchedCategory.category,
    commissionRate: matchedCategory.commissionRate,
    originalUrl: cleanUrl,
    affiliateUrl,
    deepLink,
    videoUrl,
    videoDeepLink,
    videoVoucherDiscount,
    vouchers,
  };
}
