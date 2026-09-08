import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Gift, DollarSign, ShieldCheck, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      icon: <Gift className="w-4 h-4 text-orange-600" />,
      q: 'Tại sao khách hàng PHẢI dán link qua web này thay vì mua trực tiếp trên Shopee?',
      a: 'Shopee có các voucher độc quyền: Shopee Video giảm 20% - 50% (lên đến 70.000đ - 100.000đ). Tuy nhiên nếu khách tự tìm kiếm sản phẩm trên Shopee thì KHÔNG THỂ áp dụng được các mã này. Khi dán link vào web, hệ thống sẽ tự động gắn sản phẩm vào Giỏ hàng Shopee Video của bạn, giúp khách hàng mở khóa mức giảm sâu chưa từng có!',
    },
    {
      icon: <Zap className="w-4 h-4 text-amber-600" />,
      q: 'Thao tác áp mã Shopee Video gồm những bước nào để chắc chắn được giảm giá?',
      a: 'Rất đơn giản: 1. Bấm nút "MUA QUA SHOPEE VIDEO". 2. Khi Shopee mở ra màn hình video, nhìn góc dưới cùng bên trái sẽ có biểu tượng GIỎ HÀNG MÀU VÀNG. 3. Bấm vào giỏ hàng đó, chọn món hàng và thanh toán. Mã Shopee Video sẽ tự động được chọn và trừ tiền ngay lập tức!',
    },
    {
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      q: 'Làm sao tôi (chủ web) nhận được tiền hoa hồng Affiliate?',
      a: 'Mỗi khi khách bấm mua qua Shopee Video hoặc quét mã QR, đường link chuyển hướng được tự động gắn mã Affiliate ID của bạn. Đơn hàng phát sinh từ Shopee Video được Shopee ưu tiên trả mức hoa hồng Creator cực cao (từ 8% đến 15%), cao hơn gấp 2-3 lần so với link thường!',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      q: 'Nếu khách mua sản phẩm khác hoặc đổi ý thì tôi có nhận được hoa hồng không?',
      a: 'CÓ! Shopee áp dụng cơ chế lưu cookie 7 ngày. Khi khách bấm link qua web của bạn, cookie tiếp thị được lưu lại. Trong vòng 7 ngày tới, nếu khách mua bất kỳ sản phẩm nào trên Shopee, bạn vẫn được tính trọn vẹn hoa hồng theo chính sách Shopee Affiliate!',
    },
  ];

  return (
    <div className="w-full mt-12 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#EE4D2D] flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Giải Đáp Thắc Mắc & Cơ Chế Hoạt Động
          </h2>
          <p className="text-xs text-gray-500">
            Hiểu rõ quy trình áp mã giảm giá cho khách & nhận tiền hoa hồng cho bạn
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 bg-gray-50/50 hover:bg-gray-100/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {faq.icon}
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    {faq.q}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
