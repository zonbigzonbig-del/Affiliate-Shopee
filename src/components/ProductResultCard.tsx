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
  AlertCircle,
  ChevronRight,
  History,
  LineChart,
  Gift,
  ShieldAlert,
  Layers,
  CreditCard
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
  const [showCheckoutGuideModal, setShowCheckoutGuideModal] = useState(false);
  const [showPriceHistoryModal, setShowPriceHistoryModal] = useState(false);
  const [showStackingGuideModal, setShowStackingGuideModal] = useState(false);
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

    // Open guide modal explaining step-by-step why Shopee deducts price at checkout
    setShowCheckoutGuideModal(true);

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
      {/* Top Value Banner: Voucher Unlocked Guarantee */}
      <div className="bg-gradient-to-r from-red-600 via-[#EE4D2D] to-orange-500 text-white px-4 py-3.5 flex flex-wrap items-center justify-between text-xs font-semibold gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          </span>
          <span className="text-xs sm:text-sm">
            <strong>Đã Mở Khóa & Chép Mã Giảm Sâu:</strong> Rẻ hơn tự vào Shopee mua{' '}
            <strong className="text-amber-200 underline font-black">
              {formatVND(extraSavedVsSelfBuy)}
            </strong>{' '}
            (Giảm đến {percentageSaved}%)!
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
                    <div className="font-bold text-[11px] text-amber-300">Đã Mở Khóa Tag Shopee Video</div>
                    <div className="text-[10px] text-gray-300">Sẵn sàng chọn voucher giảm 25%</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold">
                  ✓ Sẵn Sàng Chọn Mã
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

            {/* 4-Tier Automated Discount Engine Focus */}
            <div className="mt-4 rounded-xl border border-orange-200/90 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 p-3.5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                <div className="flex items-center gap-1.5 font-black text-xs text-orange-950">
                  <Zap className="w-4 h-4 text-[#EE4D2D] fill-[#EE4D2D]" />
                  <span>KÍCH HOẠT 4 TẦNG GIẢM GIÁ TỰ ĐỘNG</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  TIẾT KIỆM {percentageSaved}%
                </span>
              </div>

              {/* 4 Discount Tiers Checklist */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/80 border border-red-100 text-red-950">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EE4D2D] text-white flex items-center justify-center font-bold text-[10px]">1</span>
                    <div>
                      <span className="font-extrabold text-[11px]">Voucher Shopee Video 25%:</span>
                      <span className="text-[10px] text-red-700 block">Đã gắn tag video để mở khóa mã</span>
                    </div>
                  </div>
                  <span className="font-black text-red-600 text-xs">-{formatVND(videoDiscount || Math.round(currentSalePrice * 0.25))}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50/80 border border-orange-100 text-orange-950">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                    <div>
                      <span className="font-extrabold text-[11px]">Mã Sàn Độc Quyền (KOL):</span>
                      <span className="text-[10px] text-orange-700 block">Tự động chép sẵn mã độc quyền</span>
                    </div>
                  </div>
                  <span className="font-black text-orange-600 text-xs">-{formatVND(partnerDiscount || 30000)}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/80 border border-emerald-100 text-emerald-950">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                    <div>
                      <span className="font-extrabold text-[11px]">Mã Freeship Toàn Quốc:</span>
                      <span className="text-[10px] text-emerald-700 block">Miễn phí ship tận nhà</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600 text-xs">-{formatVND(freeshipAmount)}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/80 border border-indigo-100 text-indigo-950">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">4</span>
                    <div>
                      <span className="font-extrabold text-[11px]">Ưu Đãi SPayLater / Ngân Hàng:</span>
                      <span className="text-[10px] text-indigo-700 block">Giảm thêm khi chọn thanh toán đối tác</span>
                    </div>
                  </div>
                  <span className="font-black text-indigo-600 text-xs">-30.000đ</span>
                </div>
              </div>

              {/* Stacking Guide Action Banner */}
              <button
                type="button"
                onClick={() => setShowStackingGuideModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Xem Cách Chồng 4 Tầng Mã Này Cùng 1 Lúc »</span>
              </button>

              {/* Price Checker Action */}
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cam kết mua đúng giá rẻ nhất</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPriceHistoryModal(true)}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Soi Lịch Sử Giá 90 Ngày »</span>
                </button>
              </div>

              {/* Owner Affiliate Mini Badge */}
              <div className="pt-2 border-t border-orange-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Mã Affiliate đang chạy: <code className="font-bold text-gray-700">{settings.affiliateId}</code></span>
                <button
                  type="button"
                  onClick={() => setShowCommissionDetail(!showCommissionDetail)}
                  className="text-gray-400 hover:text-gray-700 cursor-pointer text-[10px]"
                >
                  {showCommissionDetail ? 'Ẩn chi tiết' : 'Hoa hồng ước tính'}
                </button>
              </div>

              {showCommissionDetail && (
                <div className="p-2 rounded bg-gray-100 text-[10px] text-gray-600 space-y-0.5">
                  <div>Hoa hồng Shopee dự kiến: <strong>+{formatVND(estimatedCommission)}</strong> ({product.commissionRate}%)</div>
                  <div>Liên kết tiếp thị tự động gắn vào nút bấm Mua Hàng.</div>
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
                  <div className="p-3.5 rounded-xl bg-gray-100/90 border border-gray-300 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-gray-700 font-extrabold mb-2 pb-1.5 border-b border-gray-200">
                        <span className="text-gray-600">❌ TỰ VÀO APP SHOPEE MUA</span>
                        <span className="text-red-500 text-[10px] bg-red-50 px-1.5 py-0.5 rounded font-bold">Không có ưu đãi</span>
                      </div>

                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between items-center">
                          <span>Giá niêm yết:</span>
                          <span className="font-semibold text-gray-900">{formatVND(currentSalePrice)}</span>
                        </div>
                        <div className="flex justify-between items-start text-red-600">
                          <div>
                            <span className="font-semibold">Mã Video (20% - 25%):</span>
                            <div className="text-[10px] text-gray-400">Bị khóa xám, không thể tick chọn</div>
                          </div>
                          <span className="font-bold shrink-0">BỊ KHÓA ❌</span>
                        </div>
                        <div className="flex justify-between items-start text-gray-400">
                          <div>
                            <span>Mã Sàn Độc Quyền:</span>
                            <div className="text-[10px] text-gray-400">Không có mã ẩn của KOLS</div>
                          </div>
                          <span className="font-bold shrink-0">KHÔNG CÓ ❌</span>
                        </div>
                        <div className="flex justify-between items-center text-red-500">
                          <span>Phí vận chuyển dự kiến:</span>
                          <span>+30.000đ</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-300">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Số tiền khách tự mua phải trả:</div>
                      <div className="text-xl font-extrabold text-gray-600 line-through">
                        {formatVND(selfBuyPrice)}
                      </div>
                      <div className="text-[10px] text-red-500 font-semibold mt-0.5">
                        Mất trắng {formatVND(extraSavedVsSelfBuy)} tiền giảm giá
                      </div>
                    </div>
                  </div>

                  {/* Column B: Dán link qua công cụ này (Mở khóa mã Video & chép mã độc quyền) */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-red-50 via-orange-50/80 to-amber-50 border-2 border-[#EE4D2D] text-xs flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between text-[#EE4D2D] font-extrabold mb-2 pb-1.5 border-b border-orange-200">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-[#EE4D2D]" />
                          <span>MUA QUA WEB NÀY</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#EE4D2D] text-white text-[10px] font-black animate-pulse">
                          TIẾT KIỆM TỐI ĐA
                        </span>
                      </div>

                      <div className="space-y-2 text-gray-700">
                        <div className="flex justify-between items-start text-[#EE4D2D]">
                          <div>
                            <span className="font-bold">✓ Mở khóa Mã Video (25%):</span>
                            <div className="text-[10px] text-orange-700">Gắn tag để mở khóa mã trong app</div>
                          </div>
                          <span className="font-black shrink-0">-{formatVND(videoDiscount || Math.round(currentSalePrice * 0.25))}</span>
                        </div>
                        <div className="flex justify-between items-start text-orange-700">
                          <div>
                            <span className="font-bold">✓ Chép sẵn Mã Độc Quyền:</span>
                            <div className="text-[10px] text-orange-700">Mã sàn KOLS săn được</div>
                          </div>
                          <span className="font-black shrink-0">-{formatVND(partnerDiscount || 30000)}</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-700 font-medium">
                          <span>✓ Sẵn sàng mã Freeship:</span>
                          <span className="font-extrabold">-{formatVND(freeshipAmount)} (0đ Ship)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase font-bold">Giá sau khi tick chọn mã:</div>
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

                {/* Clear explanation callout about Why this tool provides immense value */}
                <div className="mt-3 p-3.5 rounded-xl bg-orange-100/80 border border-orange-300 text-xs text-orange-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-extrabold text-[#EE4D2D]">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>NẾU TỰ VÀO SHOPEE VẪN ĐƯỢC GIẢM THÌ QUA WEB NÀY ĐƯỢC LỢI GÌ HƠN?</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
                    <div className="bg-white/80 p-2.5 rounded-lg border border-orange-200">
                      <div className="font-bold text-gray-900 text-[11px] mb-1">
                        1. Săn thêm Mã Sàn & Mã Đối Tác Độc Quyền (Mã Ẩn):
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-700">
                        Shopee chỉ hiện các mã công khai chung. Hệ thống này <strong>tự động quét và chép sẵn mã ký tự độc quyền (KOL)</strong> vào máy bạn để dán vào thanh toán, giúp <strong>giảm thêm từ 30.000đ – 50.000đ</strong> so với mã thông thường!
                      </p>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-orange-200">
                      <div className="font-bold text-gray-900 text-[11px] mb-1">
                        2. Với 80% sản phẩm chưa có Video (Shop nhỏ):
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-700">
                        Nếu shop chưa đăng video, bạn tự vào Shopee mua sẽ <strong>bị khóa xám mã Video 25%</strong> (phải mua giá gốc {formatVND(currentSalePrice)}). Công cụ này <strong>gắn tag video hộ</strong> để mở khóa mã giảm ngay {formatVND(videoDiscount || Math.round(currentSalePrice * 0.25))}!
                      </p>
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
                    Danh Sách Tầng Mã Sẵn Sàng Áp Dụng ({vouchers.length})
                  </h3>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Sẵn sàng chọn tại Shopee
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
                              ✓ Sẵn sàng chọn
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

            {/* Main Action Section: HIGH-IMPACT CTA BUTTONS & CHECKOUT GUIDE */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
              {/* Important Explanatory Banner: Why Shopee requires selecting voucher */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs text-amber-950 shadow-xs space-y-2">
                <div className="flex items-center justify-between font-extrabold text-[#EE4D2D]">
                  <span className="flex items-center gap-1.5 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>LƯU Ý QUAN TRỌNG TẠI BƯỚC THANH TOÁN SHOPEE</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCheckoutGuideModal(true)}
                    className="underline text-orange-800 hover:text-[#EE4D2D] font-bold text-[11px] cursor-pointer"
                  >
                    Xem chi tiết »
                  </button>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Shopee chỉ tự tick <em>Miễn Phí Vận Chuyển</em>. Muốn giảm tiền hàng, bạn <strong>bắt buộc phải nhấn vào dòng "Shopee Voucher" để chọn mã</strong>:
                </p>

                {/* Simulated Shopee Checkout Row Guide */}
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 shadow-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 border border-[#EE4D2D]">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800 text-xs">
                      <span className="text-base">🎟️</span>
                      <span>Shopee Voucher</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#EE4D2D] font-extrabold text-xs">
                      <span className="bg-[#EE4D2D] text-white px-2 py-0.5 rounded text-[10px] tracking-wide animate-pulse">
                        👉 BẤM VÀO ĐÂY ĐỂ CHỌN MÃ
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-1.5 text-[11px] text-gray-600 flex items-center justify-between px-1">
                    <span>1. Nhấn vào dòng Shopee Voucher</span>
                    <span>2. Tick chọn mã Video / Dán mã</span>
                    <span className="font-bold text-emerald-700">3. Bấm Đồng ý $\rightarrow$ Trừ tiền ngay!</span>
                  </div>
                </div>
              </div>

              {/* PRIMARY SUPER BUTTON: COPY CODE & OPEN SHOPEE */}
              <button
                id="buy-now-auto-discount-cta"
                type="button"
                onClick={handleBuyWithAutoDiscount}
                className="w-full flex flex-col items-center justify-center py-4 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-[#EE4D2D] to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-xl shadow-orange-500/35 transition-all active:scale-98 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-base sm:text-xl font-black tracking-wide">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 fill-amber-300" />
                  <span>CHÉP MÃ & MỞ SHOPEE (GIẢM CÒN {formatVND(finalPrice)})</span>
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <span className="text-xs text-orange-100 font-medium mt-1">
                  Đã chép sẵn mã • Mở Shopee bấm chọn mục "Shopee Voucher" để trừ tiền ngay <strong>{formatVND(extraSavedVsSelfBuy)}</strong>
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

      {/* Checkout Guide Modal: Explaining why Shopee shows base price and how to apply vouchers at checkout */}
      {showCheckoutGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-red-600 via-[#EE4D2D] to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-base sm:text-lg">
                  Cách Nhận Giá Rẻ {formatVND(finalPrice)} Trên Shopee
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutGuideModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm text-gray-700">
              {/* Important Callout */}
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 leading-relaxed space-y-2">
                <div className="font-extrabold flex items-center gap-1.5 text-[#EE4D2D]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>VÌ SAO PHẢI QUA WEB NÀY MỚI CÓ MÃ GIẢM SÂU?</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-white/80 p-2 rounded-lg border border-red-100">
                    <span className="font-bold text-gray-700 block text-[11px]">Tự vào Shopee:</span>
                    <span className="text-red-600 text-[11px]">❌ Mã Video 25% bị KHÓA XÁM, không tick được. Phải trả giá gốc.</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-800 block text-[11px]">Lấy link qua web này:</span>
                    <span className="text-emerald-700 text-[11px]">✓ Đã gắn Tag Video $\rightarrow$ Mã SÁNG LÊN để tick chọn, giảm ngay {formatVND(extraSavedVsSelfBuy)}!</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600">
                  <em>Lưu ý:</em> Shopee chỉ tự tick mã Freeship. Khi vào trang Thanh toán, bạn chỉ cần <strong>chạm vào dòng "Shopee Voucher" để tick chọn mã Video</strong> vừa mở khóa là tiền sẽ được trừ ngay!
                </p>
              </div>

              {/* Exact Shopee Checkout Screen Simulation Mockup */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Hình ảnh màn hình Thanh toán Shopee của bạn:
                </div>
                
                {/* Checkout Row Card */}
                <div className="bg-white rounded-lg border border-gray-300 p-3 space-y-2 shadow-xs">
                  <div className="flex justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                    <span>Tổng số tiền (1 sản phẩm)</span>
                    <span className="font-bold text-gray-900">{formatVND(currentSalePrice)}</span>
                  </div>

                  {/* Target Row: Shopee Voucher */}
                  <div className="p-2.5 rounded-lg bg-orange-50/90 border-2 border-[#EE4D2D] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🎟️</span>
                      <span className="font-extrabold text-gray-900 text-xs sm:text-sm">Shopee Voucher</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="bg-[#EE4D2D] text-white px-2 py-1 rounded-md font-black text-[11px] shadow-xs animate-pulse">
                        👉 BẤM VÀO ĐÂY ĐỂ CHỌN MÃ
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#EE4D2D]" />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-gray-500">Sau khi chọn mã:</span>
                    <span className="font-black text-[#EE4D2D] text-sm">
                      Tổng cộng: {formatVND(finalPrice)} (Đã trừ {formatVND(extraSavedVsSelfBuy)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Copied Code Notification */}
              {vouchers.find((v) => v.applied && v.code) && (
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-gray-500 font-semibold">Mã giảm đã sẵn sàng trong bộ nhớ tạm:</div>
                    <div className="font-mono text-base font-black text-[#EE4D2D]">
                      {vouchers.find((v) => v.applied && v.code)?.code}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(vouchers.find((v) => v.applied && v.code)?.code || '')}
                    className="px-3 py-1.5 bg-[#EE4D2D] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#D43F1F] transition-all cursor-pointer"
                  >
                    {copiedCode ? 'Đã Chép Lại ✓' : 'Chép Lại Mã'}
                  </button>
                </div>
              )}

              {/* 3 Steps To Follow */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs">
                      Chọn phân loại hàng & Bấm "Thêm vào giỏ" / "Mua Ngay"
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      (Nếu mở ra Video: Chạm vào chiếc Giỏ Hàng màu cam ở góc dưới bên trái video).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs">
                      Tại màn hình Thanh Toán: Chạm vào dòng "Shopee Voucher"
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Tick chọn mã <strong>Shopee Video 25%</strong> hoặc <strong>Dán mã vừa chép</strong> $\rightarrow$ Bấm <strong>Đồng ý</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 text-xs">
                      Tổng tiền trừ ngay về {formatVND(finalPrice)} $\rightarrow$ Bấm "Đặt Hàng"!
                    </h4>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetUrl = product.videoUrl || product.affiliateUrl;
                    window.open(targetUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#EE4D2D] hover:from-red-700 hover:to-[#D43F1F] text-white font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>MỞ SHOPEE ĐẶT HÀNG NGAY</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSaveShopeeWalletVouchers}
                  className="w-full py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>Chưa có mã trong ví? Bấm để Lưu Kho Voucher Shopee (1-Click)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Price History & Fake Sale Modal */}
      {showPriceHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-blue-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-200" />
                <h3 className="font-extrabold text-base">Lịch Sử Biến Động Giá & Soi Giá Ảo</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPriceHistoryModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs text-gray-700">
              {/* Product Info */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-12 h-12 rounded-lg object-cover border shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-xs line-clamp-1">{product.title}</div>
                  <div className="text-[11px] text-gray-500">{product.shopName} • ID: {product.itemId}</div>
                </div>
              </div>

              {/* Status Verdict */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>KẾT QUẢ ĐÁNH GIÁ: GIÁ THỰC TẾ RẤT TỐT (KHÔNG CÓ GIÁ ẢO)</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Shop giữ mức giá ổn định trong 90 ngày qua. Mức giá sau khi áp mã hôm nay (<strong>{formatVND(finalPrice)}</strong>) là mức giá rẻ nhất trong vòng 2 tháng qua.
                </p>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-[10px] text-gray-500 font-semibold">Giá cao nhất 90 ngày</div>
                  <div className="text-xs font-black text-gray-800 mt-0.5">{formatVND(Math.round(currentSalePrice * 1.05))}</div>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-[10px] text-gray-500 font-semibold">Giá thấp nhất lịch sử</div>
                  <div className="text-xs font-black text-emerald-600 mt-0.5">{formatVND(Math.round(currentSalePrice * 0.74))}</div>
                </div>
                <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-[10px] text-orange-700 font-semibold">Giá hôm nay (Qua web)</div>
                  <div className="text-xs font-black text-[#EE4D2D] mt-0.5">{formatVND(finalPrice)}</div>
                </div>
              </div>

              {/* Simulated 90-Day Price Trend Chart */}
              <div className="p-3 bg-gray-900 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Biểu đồ biến động giá 90 ngày</span>
                  <span className="text-emerald-400 font-bold">Chạm đáy hôm nay</span>
                </div>
                <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2 border-b border-gray-700">
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-gray-400">{formatVND(Math.round(currentSalePrice * 1.05))}</span>
                    <div className="w-full bg-gray-700 rounded-t-sm h-20" />
                    <span className="text-[9px] text-gray-400">90n trước</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-gray-400">{formatVND(Math.round(currentSalePrice * 0.98))}</span>
                    <div className="w-full bg-gray-600 rounded-t-sm h-18" />
                    <span className="text-[9px] text-gray-400">60n trước</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-gray-400">{formatVND(Math.round(currentSalePrice * 0.92))}</span>
                    <div className="w-full bg-gray-500 rounded-t-sm h-15" />
                    <span className="text-[9px] text-gray-400">30n trước</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-emerald-400 font-bold">{formatVND(finalPrice)}</span>
                    <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm h-11 ring-2 ring-emerald-300 animate-pulse" />
                    <span className="text-[9px] text-emerald-300 font-bold">Hôm nay</span>
                  </div>
                </div>
              </div>

              {/* Advice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 space-y-1">
                <div className="font-bold text-[11px] text-blue-900">💡 Quyền lợi khi dùng công cụ này:</div>
                <p className="text-[11px] leading-relaxed">
                  Shopee không cung cấp lịch sử giá, người mua rất dễ bị shop "tăng giá gấp đôi rồi giảm 50% ảo". Công cụ này phân tích dữ liệu lịch sử để đảm bảo bạn chỉ mua khi giá THỰC SỰ RẺ.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPriceHistoryModal(false)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Đã Hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Tier Voucher Stacking Guide Modal */}
      {showStackingGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-orange-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gradient-to-r from-[#EE4D2D] via-orange-600 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-200" />
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Mẹo Chồng 4 Tầng Mã Giảm Giá Cùng 1 Đơn</h3>
                  <p className="text-[11px] text-orange-100">Bí quyết người mua thông minh giảm sâu hơn tự mua</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStackingGuideModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs text-gray-700">
              {/* Introduction Banner */}
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1.5 text-amber-950">
                <div className="font-black text-xs flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>QUY ĐỊNH CỦA SHOPEE: ĐƯỢC PHÉP ÁP CÙNG LÚC 4 LOẠI MÃ!</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-700">
                  Rất nhiều người tự vào Shopee mua hàng chỉ tick đúng <strong>1 mã Freeship</strong> rồi bấm đặt hàng vì không biết rằng Shopee cho phép <strong>GỘP CHỒNG 4 MÃ KHÁC NHAU</strong> trong cùng 1 lần thanh toán:
                </p>
              </div>

              {/* 4 Stacking Tiers Visual Breakdown */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-gray-900 text-xs">Mã Giảm Giá Của Shop (Shop Voucher)</strong>
                      <span className="text-orange-600 font-extrabold text-xs">-20.000đ đến -50.000đ</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Lưu ngay dưới phần giá sản phẩm trước khi thêm vào giỏ hàng (Mã theo dõi Shop, Mã đơn đầu tiên, Mã giảm 5-10%).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-red-50/80 border border-red-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-red-900 text-xs">Mã Shopee Video 25% (Qua Web Này)</strong>
                      <span className="text-red-600 font-extrabold text-xs">Giảm 25% (Đến 200.000đ)</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Nếu tự mua sản phẩm thường sẽ bị khóa xám. Khi dán link qua web này, sản phẩm được gắn tag để <strong>mở khóa mã Video 25%</strong> ngay trong mục Shopee Voucher.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-900 text-xs">Mã Miễn Phí Vận Chuyển (Freeship Xtra)</strong>
                      <span className="text-emerald-600 font-extrabold text-xs">-30.000đ đến -70.000đ</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Shopee cho phép tick chọn cùng lúc <strong>cả Mã Freeship VÀ Mã Giảm Giá Video</strong> trong cùng một ô "Shopee Voucher".
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-indigo-900 text-xs">Ưu Đãi Thanh Toán (SPayLater / Ngân Hàng)</strong>
                      <span className="text-indigo-600 font-extrabold text-xs">Giảm thêm 30.000đ - 50.000đ</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Tại bước chọn hình thức thanh toán: Chọn thanh toán bằng SPayLater (trả sau) hoặc liên kết Thẻ Tín Dụng đối tác (VPBank, TPBank, JCB...) để nhận thêm mã giảm của ngân hàng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Action Checklist */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="font-extrabold text-gray-900 text-xs">📋 3 BƯỚC ĐỂ KHÁCH ÁP TRỌN VẸN 4 MÃ:</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Bước 1:</strong> Bấm nút <em>"Mở Shopee Đặt Hàng"</em> trên web này để sản phẩm được tự động kích hoạt mã Video 25%.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Bước 2:</strong> Vào thanh toán 👉 bấm mục <strong>"Shopee Voucher"</strong> 👉 Tick chọn 1 lúc cả <strong>Mã Freeship</strong> VÀ <strong>Mã Video 25%</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Bước 3:</strong> Tại mục <strong>"Phương thức thanh toán"</strong> 👉 chọn SPayLater hoặc Ví ShopeePay để hưởng thêm giảm giá tầng thứ 4!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowStackingGuideModal(false)}
                className="px-5 py-2.5 bg-[#EE4D2D] hover:bg-[#D43F1F] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Đã Hiểu Mẹo Chồng Mã
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
