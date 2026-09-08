import React from 'react';
import { Flame, ArrowRight, Tag, Star, Percent } from 'lucide-react';
import { SAMPLE_PRODUCTS, formatVND } from '../utils/shopeeParser';
import { ShopeeProduct } from '../types';

interface TrendingDealsProps {
  onSelectProduct: (url: string) => void;
}

export const TrendingDeals: React.FC<TrendingDealsProps> = ({ onSelectProduct }) => {
  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-red-500 text-red-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Sản Phẩm Hot Đang Có Voucher Giảm Sâu Hôm Nay
            </h2>
            <p className="text-xs text-gray-500">
              Bấm vào để xem mã giảm giá đã áp dụng & nhận link mua tiết kiệm
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_PRODUCTS.map((prod, idx) => {
          const original = prod.originalPrice || 300000;
          const sale = prod.salePrice || 200000;
          const discPct = Math.round(((original - sale) / original) * 100);
          const sampleUrl = `https://shopee.vn/product/sample-${idx}/${idx + 1000}`;

          return (
            <div
              key={idx}
              onClick={() => onSelectProduct(sampleUrl)}
              className="bg-white rounded-2xl border border-gray-200/80 p-3.5 hover:border-[#EE4D2D]/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-gray-100 mb-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#EE4D2D] text-white text-[11px] font-bold shadow-xs">
                    {prod.shopType}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-extrabold shadow-xs flex items-center gap-0.5">
                    <Percent className="w-3 h-3" />
                    -{discPct}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                  <span>{prod.shopName}</span>
                  <span>•</span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{prod.rating}</span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#EE4D2D] transition-colors">
                  {prod.title}
                </h3>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 line-through block">
                    {formatVND(original)}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-[#EE4D2D]">
                    {formatVND(sale)}
                  </span>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-bold text-[#EE4D2D] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Xem mã</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
