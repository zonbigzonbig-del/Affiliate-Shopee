import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, ExternalLink, Copy, Check } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  affiliateUrl: string;
  productTitle: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  affiliateUrl,
  productTitle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && affiliateUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        affiliateUrl,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#111827',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR Code', error);
        }
      );
    }
  }, [isOpen, affiliateUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#EE4D2D] flex items-center justify-center mx-auto mb-3">
            <Smartphone className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            Quét Mã Mua Trên App Shopee
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            Mở Camera điện thoại hoặc tính năng Quét mã trên App Shopee để mở ngay sản phẩm kèm ưu đãi & nhận hoa hồng
          </p>

          {/* QR Canvas Container */}
          <div className="mt-4 p-3 bg-white border border-gray-200 rounded-xl inline-block shadow-xs">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          <p className="text-xs font-semibold text-gray-700 line-clamp-1 mt-2 px-4">
            {productTitle}
          </p>

          {/* Action Links */}
          <div className="mt-5 space-y-2">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Đã chép link Affiliate!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-500" />
                  <span>Sao Chép Link Affiliate Này</span>
                </>
              )}
            </button>

            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EE4D2D] hover:bg-[#D43F1F] text-xs font-bold text-white transition-colors"
            >
              <span>Mở Trực Tiếp Trên Trình Duyệt</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
