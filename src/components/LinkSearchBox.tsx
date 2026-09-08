import React, { useState } from 'react';
import { Search, Clipboard, ArrowRight, X, Sparkles } from 'lucide-react';

interface LinkSearchBoxProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const QUICK_EXAMPLES = [
  {
    name: 'Loa Bluetooth M503',
    url: 'https://shopee.vn/Loa-Bluetooth-M503-Cong-Suat-Lon-Bass-Manh-i.291578254.189237461',
  },
  {
    name: 'Áo Polo Coolmate',
    url: 'https://shopee.vn/Ao-Thun-Nam-Polo-Cotton-Compact-Coolmate-i.12345678.987654321',
  },
  {
    name: 'Nồi Chiên Lock&Lock',
    url: 'https://shopee.vn/Noi-Chien-Khong-Dau-Lock-Lock-EJF357BLK-i.87654321.123456789',
  },
  {
    name: 'Tai Nghe Sony WH-1000XM5',
    url: 'https://shopee.vn/Tai-Nghe-Chong-On-Sony-WH-1000XM5-i.54321678.876543210',
  },
  {
    name: 'Son Black Rouge Ver 9',
    url: 'https://shopee.vn/Son-Kem-Li-Black-Rouge-Air-Fit-Velvet-i.23456789.765432109',
  },
  {
    name: 'Kem Chống Nắng La Roche-Posay',
    url: 'https://shopee.vn/Kem-Chong-Nang-La-Roche-Posay-Anthelios-i.34567890.654321098',
  },
];

export const LinkSearchBox: React.FC<LinkSearchBoxProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [url, setUrl] = useState('');
  const [pasteError, setPasteError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setPasteError('');
    onAnalyze(url.trim());
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setPasteError('');
          onAnalyze(text.trim());
        }
      } else {
        setPasteError('Vui lòng nhấn Ctrl+V (hoặc dán bằng tay) vào ô tìm kiếm.');
      }
    } catch {
      setPasteError('Trình duyệt chặn đọc clipboard. Vui lòng bấm giữ và Dán trực tiếp.');
    }
  };

  const handleSelectExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setPasteError('');
    onAnalyze(exampleUrl);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-md shadow-gray-200/50 p-4 sm:p-6 lg:p-7">
      <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-[#EE4D2D] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>⚡ Mở Khóa Voucher Shopee Video & Nhận Mã Giảm Sâu Độc Quyền</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Dán Link Shopee — Mở Khóa Voucher Video & Chép Mã Giảm Sâu
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1.5">
          Tự vào Shopee mua sẽ <span className="underline decoration-red-400 font-semibold">bị khóa không chọn được mã Video 20% - 50%</span>. Dán link vào đây để lấy link mở khóa giỏ hàng video và tự động chép mã sàn đối tác, <strong className="text-[#EE4D2D]">tiết kiệm thêm đến 70.000đ - 150.000đ</strong>!
        </p>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-gray-50 border-2 border-gray-200 focus-within:border-[#EE4D2D] focus-within:bg-white rounded-2xl transition-all shadow-inner">
          <div className="relative flex-1 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              id="shopee-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Dán link sản phẩm Shopee (vd: https://shopee.vn/... hoặc s.shopee.vn/...)"
              className="w-full pl-3 pr-8 py-3 bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-hidden"
              disabled={isLoading}
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors mr-1"
                title="Xóa link"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 px-1 pb-1 sm:p-0">
            {/* Quick Paste Button */}
            <button
              id="paste-clipboard-btn"
              type="button"
              onClick={handlePasteClipboard}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs sm:text-sm font-medium transition-all active:scale-95 whitespace-nowrap"
              title="Dán nhanh từ Clipboard"
            >
              <Clipboard className="w-4 h-4 text-gray-500" />
              <span>Dán nhanh</span>
            </button>

            {/* Analyze & Apply Vouchers CTA */}
            <button
              id="analyze-link-btn"
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#EE4D2D] hover:bg-[#D43F1F] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/25 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang dò 4 tầng mã...</span>
                </>
              ) : (
                <>
                  <span>Lấy Mã Giảm & Link Mua Rẻ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {pasteError && (
          <p className="text-xs text-amber-600 text-center mt-2 font-medium">
            {pasteError}
          </p>
        )}
      </form>

      {/* Quick Example Chips */}
      <div className="max-w-3xl mx-auto mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Thử nhanh link mẫu:</span>
        {QUICK_EXAMPLES.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => handleSelectExample(item.url)}
            className="text-xs px-2.5 py-1 rounded-full bg-orange-50 hover:bg-orange-100/80 text-[#EE4D2D] border border-orange-200/60 font-medium transition-colors cursor-pointer"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};
