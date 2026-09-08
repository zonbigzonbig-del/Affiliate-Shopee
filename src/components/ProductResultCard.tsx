import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Star,
  Tag,
  Truck,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  Sparkles,
  Percent,
  TrendingUp,
  Store,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ShopeeProduct, Voucher, AffiliateSettings } from '../types';
import { calculateSavings, formatVND } from '../utils/shopeeParser';
import { QRCodeModal } from './QRCodeModal';

interface ProductResultCardProps {
  product: ShopeeProduct;
  settings: AffiliateSettings;
  onLinkClick: (product: ShopeeProduct, finalPrice: number, commission: number) => void;
}

export const ProductResultCard: React.FC<ProductResultCardProps> = ({
  product,
  settings,
  onLinkClick,
}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>(product.vouchers);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showCommissionDetail, setShowCommissionDetail] = useState(false);

  // Toggle voucher application
  const toggleVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, applied: !v.applied } : v))
    );
  };

  const { discountAmount, freeshipAmount, finalPrice, appliedVouchers, totalSaved, percentageSaved } =
    calculateSavings(product.salePrice, vouchers);

  // Owner estimated commission calculation
  const estimatedCommission = Math.round(finalPrice * (product.commissionRate / 100));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(product.affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBuyNow = () => {
    // Trigger festive celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EE4D2D', '#FF7A00', '#FFB800', '#10B981'],
      });
    } catch {
      // ignore
    }

    onLinkClick(product, finalPrice, estimatedCommission);
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-lg shadow-gray-200/40 overflow-hidden transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-orange-500 via-[#EE4D2D] to-red-500 text-white px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-semibold gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
          <span>Đã tìm thấy {vouchers.length} mã giảm giá Shopee có thể áp dụng cho sản phẩm này!</span>
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] backdrop-blur-xs">
          <span>Tiết kiệm đến {percentageSaved}%</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Product Visuals & Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 aspect-square group shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Shop Badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.shopType === 'Mall' ? (
                  <span className="px-2.5 py-1 rounded-md bg-[#EE4D2D] text-white text-xs font-extrabold shadow-md tracking-wider">
                    SHOPEE MALL
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white text-xs font-bold shadow-md">
                    {product.shopType}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium">
                  {product.category}
                </span>
              </div>

              {/* Discount Ribbon */}
              <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" />
                <span>Giảm {Math.round(((product.originalPrice - finalPrice) / product.originalPrice) * 100)}%</span>
              </div>
            </div>

            {/* Product Meta */}
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                <Store className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-gray-700">{product.shopName}</span>
                <span>•</span>
                <span>ID: {product.itemId}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                {product.title}
              </h2>

              <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span>•</span>
                <span>{product.reviewCount.toLocaleString('vi-VN')} đánh giá</span>
                <span>•</span>
                <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Đã bán {product.soldCount.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Owner Affiliate Badge Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-500">
                      Hoa hồng ước tính cho bạn (Chủ Web)
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#EE4D2D]">
                      +{formatVND(estimatedCommission)}
                      <span className="text-xs font-normal text-gray-600 ml-1.5">
                        ({product.commissionRate}% {product.category})
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCommissionDetail(!showCommissionDetail)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                  title="Xem chi tiết cách nhận hoa hồng"
                >
                  {showCommissionDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showCommissionDetail && (
                <div className="mt-2.5 pt-2.5 border-t border-orange-200 text-xs text-gray-600 space-y-1">
                  <p>
                    ✓ <strong>Affiliate ID:</strong> <code className="text-orange-950 font-bold bg-white px-1 py-0.5 rounded border">{settings.affiliateId}</code>
                  </p>
                  <p>
                    ✓ <strong>Cơ chế:</strong> Khi khách bấm nút mua hoặc quét QR, cookie tiếp thị Shopee được lưu <strong>7 ngày</strong>. Bất kể khách mua sản phẩm này hay các món khác trên Shopee, bạn đều nhận hoa hồng!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Vouchers */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Dynamic Price Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-red-50/50 border border-orange-200/80 shadow-xs">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Bảng Tính Giá Sau Khi Áp Mã
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#EE4D2D] tracking-tight">
                    {formatVND(finalPrice)}
                  </span>
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-extrabold">
                    Tiết kiệm {formatVND(totalSaved)}
                  </span>
                </div>

                {/* Savings Breakdown */}
                <div className="mt-3 pt-3 border-t border-orange-200/70 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white/80 p-2 rounded-lg border border-orange-100">
                    <span className="text-gray-500 block text-[11px]">Giá niêm yết:</span>
                    <strong className="text-gray-800">{formatVND(product.salePrice)}</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-orange-100">
                    <span className="text-gray-500 block text-[11px]">Voucher giảm:</span>
                    <strong className="text-[#EE4D2D]">-{formatVND(discountAmount)}</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-orange-100 col-span-2 sm:col-span-1">
                    <span className="text-gray-500 block text-[11px]">Hỗ trợ Freeship:</span>
                    <strong className="text-emerald-700">-{formatVND(freeshipAmount)}</strong>
                  </div>
                </div>
              </div>

              {/* Vouchers Checklist Header */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#EE4D2D]" />
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    Các Mã Giảm Giá Đang Khả Dụng ({vouchers.length})
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  Tick chọn để thử phối hợp mã
                </span>
              </div>

              {/* Voucher Cards list */}
              <div className="mt-3 space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {vouchers.map((voucher) => {
                  const isEligible = product.salePrice >= voucher.minOrder;
                  return (
                    <div
                      key={voucher.id}
                      className={`relative flex items-center justify-between p-3 rounded-xl border transition-all ${
                        voucher.applied
                          ? 'bg-orange-50/40 border-[#EE4D2D]/60 shadow-xs'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      } ${!isEligible ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Checkbox toggle */}
                        <button
                          type="button"
                          onClick={() => isEligible && toggleVoucher(voucher.id)}
                          disabled={!isEligible}
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            voucher.applied
                              ? 'bg-[#EE4D2D] text-white'
                              : 'border-2 border-gray-300 bg-white hover:border-[#EE4D2D]'
                          }`}
                        >
                          {voucher.applied && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-[#EE4D2D]/10 text-[#EE4D2D] border border-orange-200">
                              {voucher.badge}
                            </span>
                            <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                              {voucher.code}
                            </span>
                            <span className="text-[11px] text-gray-500">HSD: {voucher.expDate}</span>
                          </div>

                          <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                            {voucher.title}
                          </p>
                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            {voucher.description}
                          </p>
                        </div>
                      </div>

                      {/* Copy Code button */}
                      <button
                        type="button"
                        onClick={() => handleCopyCode(voucher.code)}
                        className="ml-2 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-medium flex items-center gap-1 shrink-0 transition-all active:scale-95 cursor-pointer"
                        title="Sao chép mã giảm giá này"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">
                          {copiedCode === voucher.code ? 'Đã chép' : 'Chép mã'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
              {/* BIG PRIMARY CTA: BUY NOW (Triggers affiliate tracking) */}
              <button
                id="buy-now-shopee-cta"
                type="button"
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#EE4D2D] hover:from-[#E64A19] hover:to-[#D43F1F] text-white text-base sm:text-lg font-extrabold shadow-lg shadow-orange-500/30 transition-all active:scale-98 cursor-pointer group"
              >
                <span>MUA NGAY TRÊN SHOPEE (ĐÃ ÁP MÃ & GIẢM GIÁ)</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              {/* Secondary Helper Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Mobile QR Code */}
                <button
                  id="open-qr-modal-btn"
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all active:scale-95 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-orange-600" />
                  <span>Quét QR Trên Điện Thoại</span>
                </button>

                {/* Mobile App DeepLink */}
                <a
                  href={product.deepLink}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all active:scale-95 text-center"
                >
                  <Layers className="w-4 h-4 text-orange-600" />
                  <span>Mở Trực Tiếp App Shopee</span>
                </a>

                {/* Copy Affiliate Link */}
                <button
                  id="copy-affiliate-link-btn"
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all active:scale-95 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span>{copiedLink ? 'Đã Chép Link!' : 'Sao Chép Link Affiliate'}</span>
                </button>
              </div>

              {/* 3 Step Guidance Card for Customer */}
              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-1 border border-gray-200/70">
                <span className="font-bold text-gray-900 block">💡 3 bước nhận giảm giá tối đa:</span>
                <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                  <li>Bấm nút <strong>"MUA NGAY TRÊN SHOPEE"</strong> ở trên hoặc quét QR điện thoại.</li>
                  <li>Lưu các mã voucher giảm giá (Shopee Video/Live & Freeship) vào tài khoản.</li>
                  <li>Tiến hành thanh toán để tận hưởng mức giá rẻ nhất!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        affiliateUrl={product.affiliateUrl}
        productTitle={product.title}
      />
    </div>
  );
};
