import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Gift, DollarSign, ShieldCheck, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      icon: <Gift className="w-4 h-4 text-orange-600" />,
      q: 'Khách hàng dán link vào thì nhận được mã giảm giá như thế nào?',
      a: 'Khi dán link sản phẩm Shopee, hệ thống lập tức quét toàn bộ kho voucher tương thích: Mã Shopee Video (giảm đến 25-50%), Mã Shopee Live (giảm đến 50k-100k), Voucher sàn và mã Miễn phí vận chuyển (Freeship Xtra). Khách hàng chỉ cần bấm nút "Mua ngay" hoặc quét mã QR để mở Shopee và lưu mã vào ví để áp dụng khi thanh toán.',
    },
    {
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      q: 'Làm sao tôi (chủ web) nhận được tiền hoa hồng Affiliate?',
      a: 'Mỗi khi khách dán link sản phẩm và bấm nút mua hàng hoặc quét mã QR, đường link chuyển hướng được tự động gắn mã Affiliate ID của bạn (ví dụ s.shopee.vn/aff?pid=YOUR_ID). Khách hàng thực hiện thanh toán trên Shopee, Shopee sẽ ghi nhận đơn hàng và trả hoa hồng (từ 2.5% đến 14% tùy ngành hàng) vào tài khoản đối tác Shopee Affiliate của bạn.',
    },
    {
      icon: <Zap className="w-4 h-4 text-amber-600" />,
      q: 'Nếu khách mua sản phẩm khác hoặc không mua ngay thì tôi có được hoa hồng không?',
      a: 'CÓ! Shopee áp dụng cơ chế lưu cookie 7 ngày. Khi khách bấm link của bạn, cookie được lưu trong trình duyệt hoặc App Shopee. Trong vòng 7 ngày, nếu khách mua bất kỳ sản phẩm nào trên Shopee (kể cả sản phẩm khác món họ vừa dán), bạn vẫn được tính trọn vẹn hoa hồng theo chính sách Shopee Affiliate!',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      q: 'Tôi có thể đổi mã Affiliate ID cá nhân của tôi ở đâu?',
      a: 'Rất đơn giản, hãy bấm vào nút "Cài Đặt Affiliate" ở góc trên bên phải màn hình. Tại đó, bạn có thể điền Affiliate ID Shopee của bạn (hoặc AccessTrade, Ecomobi), Sub-ID để theo dõi chiến dịch, và xem bảng tỷ lệ hoa hồng chi tiết.',
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
