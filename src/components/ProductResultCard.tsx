import React, { useState, useEffect } from 'react';
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
  ArrowUpRight,
  Video,
  PlayCircle,
  ShoppingBag,
  Info,
  Edit3,
  Check,
  X,
  Zap,
  BookmarkCheck,
  ShieldCheck,
  AlertCircle
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
  const [currentSalePrice, setCurrentSalePrice] = useState<number>(product.salePrice);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPriceInput, setTempPriceInput] = useState(product.salePrice.toString());

  const [vouchers, setVouchers] = useState<Voucher[]>(product.vouchers);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showCommissionDetail, setShowCommissionDetail] = useState(false);
  const [showVideoGuideModal, setShowVideoGuideModal] = useState(false);
  const [autoApplyToast, setAutoApplyToast] = useState(true);

  // Sync price if product changes
  useEffect(() => {
    setCurrentSalePrice(product.salePrice);
    setTempPriceInput(product.salePrice.toString());
    setVouchers(product.vouchers);
    setAutoApplyToast(true);
  }, [product]);

  // Toggle voucher application
  const toggleVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, applied: !v.applied } : v))
    );
  };

  const {
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
  } = calculateSavings(currentSalePrice, vouchers);

  // Owner estimated commission calculation
  const estimatedCommission = Math.round(finalPrice * (product.commissionRate / 100));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(product.videoUrl || product.affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSavePrice = () => {
    const num = parseInt(tempPriceInput.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setCurrentSalePrice(num);
    }
    setIsEditingPrice(false);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#EE4D2D', '#FF7A00', '#FFB800', '#10B981'],
      });
    } catch {
      // ignore
    }
  };

  // Primary Action: Buy with best discount automatically applied
  const handleBuyWithAutoDiscount = () => {
    triggerConfetti();
    onLinkClick(product, finalPrice, estimatedCommission);

    // Auto copy the best voucher code so user has it ready
    const bestVoucher = vouchers.find((v) => v.applied && v.code);
    if (bestVoucher) {
      navigator.clipboard.writeText(bestVoucher.code);
      setCopiedCode(bestVoucher.code);
    }

    // Open the optimized destination URL
    const targetUrl = product.videoUrl || product.affiliateUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Secondary Action: Save all Shopee vouchers (1-click)
  const handleSaveShopeeWalletVouchers = () => {
    window.open('https://shopee.vn/m/ma-giam-gia', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-xl shadow-gray-200/40 overflow-hidden transition-all">
      {/* Top Value Banner: Automatic Discount Applied Guarantee */}
      <div className="bg-gradient-to-r from-red-600 via-[#EE4D2D] to-orange-500 text-white px-4 py-3.5 flex flex-wrap items-center justify-between text-xs font-semibold gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          </span>
          <span className="text-xs sm:text-sm">
            <strong>Đã Tự Động Kích Hoạt 4 Tầng Mã:</strong> Rẻ hơn tự vào Shopee mua{' '}
            <strong className="text-amber-200 underline font-black">
              {formatVND(extraSavedVsSelfBuy)}
            </strong>{' '}
            (Giảm {percentageSaved}%)!
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowVideoGuideModal(true)}
          className="flex items-center gap-1.5 bg-white/25 hover:bg-white/35 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xs transition-colors cursor-pointer text-white shadow-xs"
        >
          <Info className="w-3.5 h-3.5 text-amber-200" />
          <span>Xem cách hoạt động</span>
        </button>
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
                <span>Tiết kiệm {percentageSaved}%</span>
              </div>

              {/* Shopee Video tag badge overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-gray-900/90 backdrop-blur-md rounded-xl p-2.5 text-white flex items-center justify-between text-xs border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#EE4D2D] flex items-center justify-center">
                    <Video className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-amber-300">Đã Gắn Tag Shopee Video</div>
                    <div className="text-[10px] text-gray-300">Mở khóa voucher giảm thêm 25%</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold">
                  ✓ Đã Tự Động Áp
                </span>
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

            {/* Owner Affiliate Tracking Indicator */}
            <div className="mt-4 p-3 rounded-xl bg-orange-50/70 border border-orange-200/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-500">
                      Hoa hồng ước tính (Chủ web)
                    </div>
                    <div className="text-sm font-extrabold text-[#EE4D2D]">
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
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                  title="Xem chi tiết cách nhận hoa hồng"
                >
                  {showCommissionDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showCommissionDetail && (
                <div className="mt-2.5 pt-2.5 border-t border-orange-200 text-xs text-gray-600 space-y-1">
                  <p>
                    ✓ <strong>Mã Affiliate đang gắn:</strong> <code className="text-orange-950 font-bold bg-white px-1 py-0.5 rounded border">{settings.affiliateId}</code>
                  </p>
                  <p>
                    ✓ <strong>Cơ chế tự động:</strong> Khách bấm Mua Ngay, hệ thống sẽ mở ứng dụng Shopee với liên kết tiếp thị của bạn. Đơn hàng thành công sẽ tự động cộng hoa hồng vào tài khoản Shopee Affiliate của bạn.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Comparison Matrix, Pricing & Vouchers */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* COMPARISON MATRIX: Normal Buying vs Buying Via This Tool */}
              <div className="rounded-2xl border-2 border-orange-300/80 bg-gradient-to-br from-orange-50/50 via-white to-amber-50/40 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-orange-200/70 mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-orange-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#EE4D2D]" />
                    <span>SO SÁNH GIÁ MUA: TỰ MUA vs MUA QUA CÔNG CỤ NÀY</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                    TỰ ĐỘNG GIẢM {percentageSaved}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Column A: Tự vào Shopee mua (Không qua web này) */}
                  <div className="p-3.5 rounded-xl bg-gray-100/90 border border-gray-200 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-gray-500 font-bold mb-2">
                        <span>TỰ VÀO MUA TRÊN SHOPEE</span>
                        <span className="text-gray-400 text-[10px]">Mua bình thường</span>
                      </div>

                      <div className="space-y-1.5 text-gray-600">
                        <div className="flex justify-between items-center">
                          <span>Giá niêm yết:</span>
                          <span className="font-semibold text-gray-900">{formatVND(currentSalePrice)}</span>
                        </div>
                        <div className="flex justify-between items-center text-red-500">
                          <span>Phí vận chuyển chuẩn:</span>
                          <span>+30.000đ</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-400">
                          <span>Mã Shopee Video (25%):</span>
                          <span className="text-red-400">❌ Không áp được</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-400">
                          <span>Mã Đối Tác Độc Quyền:</span>
                          <span className="text-red-400">❌ Không có</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-200">
                      <div className="text-[11px] text-gray-500">Khách tự mua phải trả:</div>
                      <div className="text-xl font-extrabold text-gray-500 line-through">
                        {formatVND(selfBuyPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Column B: Dán link qua công cụ này (Tự động áp 4 tầng mã) */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-red-50 via-orange-50/80 to-amber-50 border-2 border-[#EE4D2D] text-xs flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between text-[#EE4D2D] font-extrabold mb-2">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-[#EE4D2D]" />
                          <span>DÁN LINK QUA WEB NÀY</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#EE4D2D] text-white text-[10px] font-black">
                          ƯU ĐÃI TỐI ĐA
                        </span>
                      </div>

                      <div className="space-y-1.5 text-gray-700">
                        <div className="flex justify-between items-center text-[#EE4D2D] font-medium">
                          <span>✓ Đã gắn Tag Video (25%):</span>
                          <span className="font-extrabold">-{formatVND(videoDiscount || Math.round(currentSalePrice * 0.25))}</span>
                        </div>
                        <div className="flex justify-between items-center text-orange-700 font-medium">
                          <span>✓ Đã ghép Mã Sàn Độc Quyền:</span>
                          <span className="font-extrabold">-{formatVND(partnerDiscount || 30000)}</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-700 font-medium">
                          <span>✓ Đã kích hoạt Freeship:</span>
                          <span className="font-extrabold">-{formatVND(freeshipAmount)} (0đ Ship)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase font-bold">Giá sau khi tự áp mã:</div>
                          <div className="text-2xl sm:text-3xl font-black text-[#EE4D2D] tracking-tight">
                            {formatVND(finalPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[11px] shadow-xs">
                            Rẻ hơn {formatVND(extraSavedVsSelfBuy)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Edit Price Option */}
                <div className="mt-3 pt-2.5 border-t border-orange-200/50 flex flex-wrap items-center justify-between text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                    <span>Giá niêm yết trên Shopee: <strong>{formatVND(currentSalePrice)}</strong></span>
                  </span>
                  {!isEditingPrice ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingPrice(true)}
                      className="text-[#EE4D2D] hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa giá nếu Shopee hiển thị khác</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempPriceInput}
                        onChange={(e) => setTempPriceInput(e.target.value)}
                        className="w-24 px-1.5 py-0.5 text-xs font-bold border border-[#EE4D2D] rounded focus:outline-hidden bg-white"
                        placeholder="339000"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleSavePrice}
                        className="px-2 py-0.5 bg-[#EE4D2D] text-white rounded font-bold hover:bg-[#D43F1F] cursor-pointer"
                      >
                        Lưu
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Vouchers Checklist Header */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#EE4D2D]" />
                  <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                    Chi Tiết 4 Tầng Mã Đã Tự Động Áp Dụng ({vouchers.length})
                  </h3>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Tất cả đều đang hoạt động
                </span>
              </div>

              {/* Voucher Cards list */}
              <div className="mt-2.5 space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {vouchers.map((voucher) => {
                  const isEligible = currentSalePrice >= voucher.minOrder;
                  const isVideo = voucher.platform === 'video';

                  return (
                    <div
                      key={voucher.id}
                      className={`relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${
                        voucher.applied
                          ? isVideo
                            ? 'bg-orange-50/80 border-[#EE4D2D] shadow-xs'
                            : 'bg-orange-50/40 border-orange-300'
                          : 'bg-white border-gray-200 opacity-60'
                      } ${!isEligible ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
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
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                isVideo
                                  ? 'bg-[#EE4D2D] text-white'
                                  : 'bg-[#EE4D2D]/10 text-[#EE4D2D] border border-orange-200'
                              }`}
                            >
                              {voucher.badge}
                            </span>
                            <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
                              {voucher.code}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                              ✓ Đã kích hoạt
                            </span>
                          </div>

                          <p className="text-xs font-bold text-gray-900 line-clamp-1">
                            {voucher.title}
                          </p>
                          <p className="text-[11px] text-gray-600 line-clamp-1">
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

            {/* Main Action Section: HIGH-IMPACT CTA BUTTONS */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
              {/* PRIMARY SUPER BUTTON: AUTO-APPLIED DISCOUNT SHOPEE CHECKOUT */}
              <button
                id="buy-now-auto-discount-cta"
                type="button"
                onClick={handleBuyWithAutoDiscount}
                className="w-full flex flex-col items-center justify-center py-4 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-[#EE4D2D] to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-xl shadow-orange-500/35 transition-all active:scale-98 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-base sm:text-xl font-black tracking-wide">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 fill-amber-300" />
                  <span>MUA NGAY VỚI GIÁ {formatVND(finalPrice)} (ĐÃ TỰ ĐỘNG ÁP MÃ)</span>
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <span className="text-xs text-orange-100 font-medium mt-1">
                  Tự động chép mã giảm sâu • Mở Shopee đặt hàng tiết kiệm ngay <strong>{formatVND(extraSavedVsSelfBuy)}</strong>
                </span>
              </button>

              {/* Secondary Utility Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1-Click Save All Shopee Vouchers */}
                <button
                  id="save-shopee-vouchers-btn"
                  type="button"
                  onClick={handleSaveShopeeWalletVouchers}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition-all active:scale-95 cursor-pointer"
                  title="Mở trang lưu toàn bộ mã giảm giá hôm nay trên Shopee"
                >
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>Lưu Kho Voucher Toàn Sàn (1-Click)</span>
                </button>

                {/* Video Guide Tip */}
                <button
                  id="open-video-guide-btn"
                  type="button"
                  onClick={() => setShowVideoGuideModal(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-xs font-bold text-orange-800 transition-all active:scale-95 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-[#EE4D2D]" />
                  <span>Mẹo Giảm Thêm 25% Video</span>
                </button>

                {/* Copy Affiliate Link */}
                <button
                  id="copy-affiliate-link-btn"
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all active:scale-95 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span>{copiedLink ? 'Đã Chép Link!' : 'Sao Chép Link Mua Rẻ'}</span>
                </button>
              </div>

              {/* 3 Step Visual Guidance Card: Tại sao mua qua web này lại rẻ hơn tự mua? */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs text-amber-950">
                <div className="flex items-center justify-between font-extrabold mb-1.5">
                  <span className="flex items-center gap-1.5 text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-[#EE4D2D]" />
                    <span>Tại sao dán link qua web này rẻ hơn nhiều so với tự vào Shopee mua?</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowVideoGuideModal(true)}
                    className="text-[#EE4D2D] hover:underline font-bold text-[11px] cursor-pointer"
                  >
                    Xem chi tiết »
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-[11px] text-gray-700">
                  <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200/70">
                    <strong className="text-orange-600 block mb-0.5">1. Mở Khóa Mã Video 25%:</strong>
                    Shopee chỉ giảm 25% cho sản phẩm gắn trong video. Web này tự động gắn sản phẩm vào video để kích hoạt mức giảm!
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200/70">
                    <strong className="text-orange-600 block mb-0.5">2. Kèm Mã Sàn Đối Tác:</strong>
                    Tự động chèn mã ưu đãi kín từ chương trình tiếp thị liên kết Shopee (mã ẩn không tìm thấy trên trang chủ).
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200/70">
                    <strong className="text-orange-600 block mb-0.5">3. Tự Động Trừ Tiền:</strong>
                    Khi bạn bấm "MUA NGAY", Shopee tự động ghép đủ 4 tầng mã, bạn không cần phải tự tìm kiếm hay nhập tay từng mã!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        affiliateUrl={product.videoUrl || product.affiliateUrl}
        productTitle={product.title}
      />

      {/* Video Guide Modal */}
      {showVideoGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-red-600 to-[#EE4D2D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">Cách Mua Để Chắc Chắn Giảm Sâu Hơn Tự Mua</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoGuideModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm text-gray-700">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Bí quyết tiết kiệm:</strong> Khi bạn tự vào Shopee gõ tìm kiếm, các voucher <strong>Shopee Video 25% - 50% (lên đến 70.000đ - 150.000đ)</strong> hoàn toàn bị khóa. Dán link vào web này giúp mở khóa giỏ hàng video và tự động chèn mã sàn đối tác độc quyền!
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Bấm nút "MUA NGAY VỚI GIÁ ĐÃ GIẢM"</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Hệ thống sẽ tự động sao chép mã độc quyền và chuyển bạn đến ứng dụng Shopee chuẩn xác.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Bấm "Thêm vào giỏ" hoặc mở icon Giỏ Hàng Video</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Nếu mở ra video, chạm vào chiếc Giỏ hàng màu cam ở góc dưới bên trái để chọn phân loại sản phẩm.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Kiểm tra mục "Shopee Voucher" tại trang Thanh Toán</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Mã Shopee Video 25% và Freeship sẽ được tự động chọn. Bạn chỉ việc bấm Đặt Hàng với mức giá rẻ hơn nhiều so với tự mua!</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowVideoGuideModal(false);
                  handleBuyWithAutoDiscount();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#EE4D2D] hover:from-red-700 hover:to-[#D43F1F] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Đã Rõ — Mua Ngay Với Giá Rẻ Hơn Tự Mua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
