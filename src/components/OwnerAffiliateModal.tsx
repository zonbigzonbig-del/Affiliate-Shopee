import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Percent,
  CheckCircle2,
  DollarSign,
  Info,
  Clock,
  ExternalLink,
  History,
  Trash2,
  Sparkles
} from 'lucide-react';
import { AffiliateSettings, ConvertedHistoryItem } from '../types';
import { formatVND } from '../utils/shopeeParser';

interface OwnerAffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AffiliateSettings;
  onSaveSettings: (newSettings: AffiliateSettings) => void;
  history: ConvertedHistoryItem[];
  onClearHistory: () => void;
}

export const OwnerAffiliateModal: React.FC<OwnerAffiliateModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  history,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'commission' | 'history'>('config');
  const [form, setForm] = useState<AffiliateSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const totalEstimatedCommission = history.reduce((sum, h) => sum + h.estimatedCommission, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Cài Đặt Affiliate & Nhận Hoa Hồng Shopee
              </h2>
              <p className="text-xs text-gray-300">
                Gắn mã tiếp thị liên kết cá nhân để nhận hoa hồng khi khách mua hàng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`py-2.5 px-3 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-[#EE4D2D] text-[#EE4D2D] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cấu Hình Affiliate ID</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('commission')}
            className={`py-2.5 px-3 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'commission'
                ? 'border-[#EE4D2D] text-[#EE4D2D] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Biểu Phí Hoa Hồng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-[#EE4D2D] text-[#EE4D2D] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch Sử Chuyển Đổi ({history.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'config' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Cách hoạt động nhận hoa hồng:</strong> Khi khách dán link sản phẩm Shopee vào web, hệ thống tự động chèn <strong>Affiliate ID</strong> của bạn vào đường link mua hàng. Khi khách bấm mua (qua web hoặc mở App Shopee), Shopee sẽ ghi nhận hoa hồng trực tiếp vào tài khoản tiếp thị của bạn!
                </div>
              </div>

              {/* Affiliate ID Field */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Mã Affiliate ID / Partner ID của bạn:
                </label>
                <input
                  type="text"
                  value={form.affiliateId}
                  onChange={(e) => setForm({ ...form, affiliateId: e.target.value })}
                  placeholder="Vd: AFF_ZONBIG_VN hoặc 17928341"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#EE4D2D] focus:ring-2 focus:ring-orange-200"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Đây là mã định danh đối tác trong chương trình Shopee Tiếp Thị Liên Kết (Affiliate).
                </p>
              </div>

              {/* Sub-ID tracking */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Mã phụ theo dõi (Sub-ID / Campaign):
                </label>
                <input
                  type="text"
                  value={form.subId}
                  onChange={(e) => setForm({ ...form, subId: e.target.value })}
                  placeholder="web_shopee_deal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#EE4D2D] focus:ring-2 focus:ring-orange-200"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Dùng để phân loại nguồn đơn hàng trên bảng điều khiển Shopee Affiliate.
                </p>
              </div>

              {/* Network Platform */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Mạng Lưới Tiếp Thị (Affiliate Network):
                </label>
                <select
                  value={form.networkType}
                  onChange={(e) =>
                    setForm({ ...form, networkType: e.target.value as AffiliateSettings['networkType'] })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#EE4D2D]"
                >
                  <option value="shopee_direct">Shopee Affiliate Trực Tiếp (Tự động gắn Tag & UTM hoa hồng)</option>
                  <option value="accesstrade">AccessTrade Việt Nam (Chiến dịch Shopee CPS)</option>
                  <option value="ecomobi">Ecomobi / Passio Creator</option>
                  <option value="custom">Domain / Redirect Server Riêng (s.shopee.vn rút gọn)</option>
                </select>
              </div>

              {/* Custom redirect domain if selected */}
              {form.networkType === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Custom Redirect URL Prefix:
                  </label>
                  <input
                    type="url"
                    value={form.customDomain}
                    onChange={(e) => setForm({ ...form, customDomain: e.target.value })}
                    placeholder="https://myshop.com/r"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono text-gray-900"
                  />
                </div>
              )}

              {/* Save Button */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  {savedSuccess && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Đã lưu cấu hình thành công!
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#EE4D2D] hover:bg-[#D43F1F] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </form>
          )}

          {activeTab === 'commission' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <strong>Chính sách lưu cookie Shopee:</strong> Cookie được lưu <strong>7 ngày</strong>. Trong thời gian này, bất cứ khi nào khách hàng đặt đơn trên Shopee (kể cả sản phẩm khác không phải món họ vừa xem), bạn vẫn được hưởng hoa hồng đầy đủ!
              </div>

              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Bảng Tỷ Lệ Hoa Hồng Shopee Tham Khảo (2025 - 2026)
              </h4>

              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Ngành Hàng</th>
                      <th className="p-3 text-center">Khách Cũ</th>
                      <th className="p-3 text-center">Khách Mới</th>
                      <th className="p-3">Ước tính / đơn 500k</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-3 font-semibold text-gray-900">Thời Trang & Phụ Kiện</td>
                      <td className="p-3 text-center text-orange-600 font-bold">8.0% - 10.0%</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">12.0% - 14.0%</td>
                      <td className="p-3 font-bold text-gray-900">40.000đ - 60.000đ</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900">Sức Khỏe & Sắc Đẹp (Mỹ Phẩm)</td>
                      <td className="p-3 text-center text-orange-600 font-bold">7.0% - 8.5%</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">10.0% - 12.0%</td>
                      <td className="p-3 font-bold text-gray-900">35.000đ - 50.000đ</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900">Mẹ & Bé / Bách Hóa Tiêu Dùng</td>
                      <td className="p-3 text-center text-orange-600 font-bold">5.0% - 6.5%</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">8.0% - 9.0%</td>
                      <td className="p-3 font-bold text-gray-900">25.000đ - 40.000đ</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900">Nhà Cửa & Đời Sống</td>
                      <td className="p-3 text-center text-orange-600 font-bold">4.5% - 6.0%</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">7.0% - 8.5%</td>
                      <td className="p-3 font-bold text-gray-900">22.500đ - 35.000đ</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900">Thiết Bị Điện Tử & Công Nghệ</td>
                      <td className="p-3 text-center text-orange-600 font-bold">2.5% - 4.0%</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">4.5% - 6.0%</td>
                      <td className="p-3 font-bold text-gray-900">15.000đ - 25.000đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 flex items-center justify-between">
                <span>Tham gia đăng ký Shopee Affiliate chính thức:</span>
                <a
                  href="https://affiliate.shopee.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#EE4D2D] hover:underline"
                >
                  <span>affiliate.shopee.vn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-orange-50/70 p-3 rounded-xl border border-orange-200">
                <div>
                  <span className="text-xs text-gray-600 block">Tổng hoa hồng ước tính:</span>
                  <span className="text-lg font-black text-[#EE4D2D]">
                    {formatVND(totalEstimatedCommission)}
                  </span>
                </div>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa lịch sử</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Chưa có sản phẩm nào được khách chuyển đổi qua link. Khi khách dán link và bấm mua, lịch sử sẽ xuất hiện tại đây.
                </div>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between text-xs gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg shrink-0 border border-gray-200"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {item.title}
                          </p>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleTimeString('vi-VN')} -{' '}
                            {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block text-[11px] text-gray-500">
                          Giá bán: {formatVND(item.discountedPrice)}
                        </span>
                        <span className="font-bold text-[#EE4D2D]">
                          +{formatVND(item.estimatedCommission)} hoa hồng
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
