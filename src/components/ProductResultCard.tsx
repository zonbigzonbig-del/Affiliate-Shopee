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
  Layers,
  ArrowUpRight,
  Video,
  PlayCircle,
  ShoppingBag,
  Info,
  Edit3,
  Check,
  X
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

  // Sync price if product changes
  useEffect(() => {
    setCurrentSalePrice(product.salePrice);
    setTempPriceInput(product.salePrice.toString());
    setVouchers(product.vouchers);
  }, [product]);

  // Toggle voucher application
  const toggleVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, applied: !v.applied } : v))
    );
  };

  const { discountAmount, freeshipAmount, finalPrice, appliedVouchers, totalSaved, percentageSaved } =
    calculateSavings(currentSalePrice, vouchers);

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
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#EE4D2D', '#FF7A00', '#FFB800', '#10B981'],
      });
    } catch {
      // ignore
    }
  };

  // 1. Buy via Shopee Video (Unlocks 20-50% discount automatically)
  const handleBuyViaVideo = () => {
    triggerConfetti();
    onLinkClick(product, finalPrice, estimatedCommission);

    // Auto copy the best video voucher code for ease of use
    const videoVoucher = vouchers.find((v) => v.platform === 'video');
    if (videoVoucher) {
      navigator.clipboard.writeText(videoVoucher.code);
    }

    // Open Video Link
    const targetUrl = product.videoUrl || product.affiliateUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    // Show step reminder modal
    setShowVideoGuideModal(true);
  };

  // 2. Buy via Regular Shopee Link
  const handleBuyRegular = () => {
    triggerConfetti();
    onLinkClick(product, finalPrice, estimatedCommission);
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-lg shadow-gray-200/40 overflow-hidden transition-all">
      {/* Top Banner Notice: Highlight Shopee Video Tagging */}
      <div className="bg-gradient-to-r from-orange-600 via-[#EE4D2D] to-red-600 text-white px-4 py-3 flex flex-wrap items-center justify-between text-xs font-semibold gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Video className="w-3.5 h-3.5 text-amber-300" />
          </span>
          <span>
            <strong>Đã gắn Tag Shopee Video:</strong> Sản phẩm được mở khóa mã giảm độc quyền <strong>25% - 50%</strong> & Freeship!
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowVideoGuideModal(true)}
          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-xs transition-colors cursor-pointer"
        >
          <Info className="w-3 h-3 text-amber-200" />
          <span>Xem cách áp mã</span>
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
                <span>Giảm {Math.round(((product.originalPrice - finalPrice) / product.originalPrice) * 100)}%</span>
              </div>

              {/* Shopee Video tag badge overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-gray-900/85 backdrop-blur-md rounded-xl p-2.5 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#EE4D2D] flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-amber-300">Đã Gắn Vào Giỏ Shopee Video</div>
                    <div className="text-[10px] text-gray-300">Nhận thêm mã giảm đến 70.000đ</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  Sẵn sàng
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
                    ✓ <strong>Cơ chế Video Affiliate:</strong> Khi khách bấm mở Shopee Video và đặt hàng, Shopee tự động tính đơn hàng cho kênh tiếp thị của bạn với mức hoa hồng cao nhất (8% - 15%). Cookie duy trì 7 ngày.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Vouchers */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Dynamic Price Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-red-50/60 border border-orange-200/90 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  <span>BẢNG TÍNH GIÁ KHI MUA QUA SHOPEE VIDEO</span>
                  <span className="text-[11px] text-[#EE4D2D] font-bold lowercase">
                    (rẻ hơn mua tìm kiếm thường)
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#EE4D2D] tracking-tight">
                    {formatVND(finalPrice)}
                  </span>
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-extrabold">
                    Tiết kiệm {formatVND(totalSaved)}
                  </span>
                </div>

                {/* Savings Breakdown */}
                <div className="mt-3 pt-3 border-t border-orange-200/70 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {/* Listed Price with quick edit */}
                  <div className="bg-white/90 p-2 rounded-lg border border-orange-100 relative group">
                    <div className="flex items-center justify-between text-gray-500 text-[11px] mb-0.5">
                      <span>Giá niêm yết:</span>
                      {!isEditingPrice && (
                        <button
                          type="button"
                          onClick={() => setIsEditingPrice(true)}
                          className="text-[#EE4D2D] hover:underline flex items-center gap-0.5 font-medium"
                          title="Sửa giá nếu Shopee hiển thị giá khác"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Sửa</span>
                        </button>
                      )}
                    </div>
                    {isEditingPrice ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="text"
                          value={tempPriceInput}
                          onChange={(e) => setTempPriceInput(e.target.value)}
                          className="w-full px-1.5 py-0.5 text-xs font-bold border border-[#EE4D2D] rounded focus:outline-hidden"
                          placeholder="vd: 339000"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleSavePrice}
                          className="p-1 bg-[#EE4D2D] text-white rounded hover:bg-[#D43F1F]"
                          title="Lưu giá"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <strong className="text-gray-900 block text-xs">{formatVND(currentSalePrice)}</strong>
                    )}
                  </div>

                  <div className="bg-white/90 p-2 rounded-lg border border-orange-100">
                    <span className="text-gray-500 block text-[11px]">Voucher Shopee Video:</span>
                    <strong className="text-[#EE4D2D]">-{formatVND(discountAmount)}</strong>
                  </div>
                  <div className="bg-white/90 p-2 rounded-lg border border-orange-100 col-span-2 sm:col-span-1">
                    <span className="text-gray-500 block text-[11px]">Hỗ trợ Freeship:</span>
                    <strong className="text-emerald-700">-{formatVND(freeshipAmount)}</strong>
                  </div>
                </div>
              </div>

              {/* Vouchers Checklist Header */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#EE4D2D]" />
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    Mã Giảm Giá Sẽ Được Kích Hoạt ({vouchers.length})
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  Tick chọn để tính thử mức giá
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
                            ? 'bg-orange-50/70 border-[#EE4D2D] shadow-xs'
                            : 'bg-orange-50/30 border-[#EE4D2D]/60'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      } ${!isEligible ? 'opacity-60' : ''}`}
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
                              {isVideo ? '🔥 Shopee Video' : voucher.badge}
                            </span>
                            <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
                              {voucher.code}
                            </span>
                            <span className="text-[10px] text-gray-500">HSD: {voucher.expDate}</span>
                          </div>

                          <p className="text-xs font-bold text-gray-800 line-clamp-1">
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

            {/* Main Action Section: SHOPEE VIDEO VALUE PROPOSITION */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
              {/* PRIMARY SUPER BUTTON: OPEN VIA SHOPEE VIDEO */}
              <button
                id="buy-now-shopee-video-cta"
                type="button"
                onClick={handleBuyViaVideo}
                className="w-full flex flex-col items-center justify-center py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-600 via-[#EE4D2D] to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/35 transition-all active:scale-98 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-base sm:text-lg font-black tracking-wide">
                  <PlayCircle className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>MUA QUA SHOPEE VIDEO ĐỂ ĐƯỢC GIẢM 25% - 50%</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <span className="text-[11px] sm:text-xs text-orange-100 font-medium mt-0.5">
                  👉 Mở video ➔ Chạm vào <strong>Giỏ Hàng Màu Vàng</strong> góc trái ➔ Áp mã giảm thành công!
                </span>
              </button>

              {/* Secondary Actions Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Mobile QR Code */}
                <button
                  id="open-qr-modal-btn"
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all active:scale-95 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-orange-600" />
                  <span>Quét QR Trên Điện Thoại</span>
                </button>

                {/* Regular Link Fallback */}
                <button
                  id="buy-regular-link-btn"
                  type="button"
                  onClick={handleBuyRegular}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all active:scale-95 cursor-pointer"
                  title="Mua qua link Shopee thông thường nếu không muốn mở video"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                  <span>Mua Qua Link Thường</span>
                </button>

                {/* Copy Link */}
                <button
                  id="copy-affiliate-link-btn"
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all active:scale-95 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span>{copiedLink ? 'Đã Chép Link!' : 'Sao Chép Link Video'}</span>
                </button>
              </div>

              {/* 3 Step Visual Guidance Card: Tại sao cần mua qua Video? */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-950">
                <div className="flex items-center justify-between font-bold mb-1.5">
                  <span className="flex items-center gap-1.5 text-amber-900">
                    <ShoppingBag className="w-4 h-4 text-[#EE4D2D]" />
                    <span>Cách mua qua Shopee Video để chắc chắn được giảm giá:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowVideoGuideModal(true)}
                    className="text-[#EE4D2D] hover:underline font-bold text-[11px]"
                  >
                    Xem chi tiết »
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-[11px] text-gray-700">
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                    <strong className="text-orange-600 block">Bước 1:</strong>
                    Bấm nút cam <strong>"MUA QUA SHOPEE VIDEO"</strong> ở trên.
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                    <strong className="text-orange-600 block">Bước 2:</strong>
                    Nhìn <strong>góc dưới bên trái</strong> màn hình Video, bấm vào icon <strong>Giỏ Hàng Màu Vàng</strong>.
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                    <strong className="text-orange-600 block">Bước 3:</strong>
                    Bấm chọn mua món hàng ➔ Mã Video 25% - 50% sẽ <strong>tự động áp vào đơn</strong>!
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
            <div className="p-4 bg-gradient-to-r from-orange-600 to-[#EE4D2D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">Hướng Dẫn Mua Qua Shopee Video</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoGuideModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm text-gray-700">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Vì sao phải mua qua Shopee Video?</strong><br />
                Shopee chỉ cho phép áp mã giảm <strong>20% - 50% (lên đến 70.000đ - 100.000đ)</strong> cho các sản phẩm được đặt hàng thông qua video. Khi bạn dán link vào web này, hệ thống đã gắn sản phẩm vào video giúp bạn!
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Bấm nút "Mở Qua Shopee Video"</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Trang web sẽ tự động mở ứng dụng Shopee tới video có gắn sản phẩm này.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Chạm vào Icon Giỏ Hàng Màu Vàng (Góc dưới trái)</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Ở góc dưới cùng bên trái màn hình video sẽ có biểu tượng chiếc giỏ hàng màu vàng cam chứa đúng sản phẩm của bạn.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Chọn phân loại & Mua ngay</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Tại màn hình thanh toán, mã Shopee Video giảm sâu sẽ tự động tick áp dụng, giúp bạn tiết kiệm tối đa số tiền!</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowVideoGuideModal(false);
                  handleBuyViaVideo();
                }}
                className="w-full py-3 rounded-xl bg-[#EE4D2D] hover:bg-[#D43F1F] text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Đã Hiểu — Mở Shopee Video Mua Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
