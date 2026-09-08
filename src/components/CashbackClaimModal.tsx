import React, { useState } from 'react';
import { X, CheckCircle2, Wallet, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { CashbackClaim, ShopeeProduct } from '../types';
import { formatVND } from '../utils/shopeeParser';

interface CashbackClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ShopeeProduct;
  onClaimSubmitted?: (claim: CashbackClaim) => void;
}

export const CashbackClaimModal: React.FC<CashbackClaimModalProps> = ({
  isOpen,
  onClose,
  product,
  onClaimSubmitted,
}) => {
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'bank'>('momo');
  const [momoPhone, setMomoPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const cashbackVND = product.cashbackAmount || 25000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    const contact =
      paymentMethod === 'momo'
        ? `MoMo: ${momoPhone}`
        : `Ngân hàng: ${bankName} - STK: ${bankAccount} (${accountName})`;

    const newClaim: CashbackClaim = {
      id: `claim-${Date.now()}`,
      orderId: orderId.trim(),
      productTitle: product.title,
      cashbackAmount: cashbackVND,
      customerContact: contact,
      status: 'pending',
      createdAt: Date.now(),
    };

    // Save to localStorage
    try {
      const existingStr = localStorage.getItem('shopee_cashback_claims') || '[]';
      const claims: CashbackClaim[] = JSON.parse(existingStr);
      claims.unshift(newClaim);
      localStorage.setItem('shopee_cashback_claims', JSON.stringify(claims));
    } catch {
      // ignore
    }

    if (onClaimSubmitted) {
      onClaimSubmitted(newClaim);
    }

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Đăng Ký Nhận Hoàn Tiền Mặt</h3>
              <p className="text-[11px] text-emerald-100">Quyền lợi độc quyền khi mua qua trang web này</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Đã Ghi Nhận Yêu Cầu Hoàn Tiền!</h4>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Số tiền <strong className="text-emerald-600 font-bold">{formatVND(cashbackVND)}</strong> sẽ được chuyển trực tiếp về tài khoản của bạn ngay sau khi Shopee xác nhận đơn hàng giao thành công!
              </p>
              <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 text-left border border-gray-200">
                <div><strong>Mã đơn hàng:</strong> {orderId}</div>
                <div><strong>Tài khoản nhận:</strong> {paymentMethod === 'momo' ? momoPhone : `${bankAccount} (${bankName})`}</div>
                <div><strong>Trạng thái:</strong> <span className="text-amber-600 font-bold">Chờ đối soát Shopee</span></div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product & Cashback summary */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block text-[11px]">Số tiền bạn được hoàn:</span>
                  <strong className="text-emerald-700 text-base font-black">{formatVND(cashbackVND)}</strong>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                    Tiền mặt 100%
                  </span>
                </div>
              </div>

              {/* Order ID Input */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  1. Nhập Mã Đơn Hàng Shopee của bạn:
                </label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Vd: 240908ABC123XYZ"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono font-bold text-gray-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
                <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-gray-400 shrink-0" />
                  Sau khi đặt hàng trên Shopee, vào mục "Đơn Mua" ➔ Copy Mã Đơn Hàng dán vào đây.
                </p>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  2. Chọn hình thức nhận tiền hoàn:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'momo'
                        ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-200'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>Ví MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'bank'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Tài Khoản Ngân Hàng</span>
                  </button>
                </div>
              </div>

              {/* Payment Details */}
              {paymentMethod === 'momo' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Số điện thoại đăng ký MoMo:
                  </label>
                  <input
                    type="tel"
                    required
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    placeholder="0987654321"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-hidden focus:border-pink-500"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                      Tên Ngân Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="MB Bank, Vietcombank, Techcombank..."
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                        Số Tài Khoản:
                      </label>
                      <input
                        type="text"
                        required
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="0123456789"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                        Chủ Tài Khoản:
                      </label>
                      <input
                        type="text"
                        required
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="NGUYEN VAN A"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Xác Nhận & Gửi Yêu Cầu Hoàn Tiền</span>
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                  Cam kết uy tín • Tiền hoàn được đối soát và trả tự động
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
