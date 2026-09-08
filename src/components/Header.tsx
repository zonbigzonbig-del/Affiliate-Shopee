import React from 'react';
import { ShoppingBag, Settings, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';
import { AffiliateSettings } from '../types';

interface HeaderProps {
  settings: AffiliateSettings;
  onOpenSettings: () => void;
  conversionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  conversionCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EE4D2D] to-[#FF6B4A] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900">
                Shopee<span className="text-[#EE4D2D]">Deal</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-[#EE4D2D] border border-orange-200">
                <Sparkles className="w-3 h-3" /> Áp Mã & Affiliate
              </span>
            </div>
            <p className="text-[11px] text-gray-500 hidden sm:block">
              Tự động săn voucher tốt nhất & gắn link Affiliate nhận hoa hồng
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Affiliate Active Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ID: <strong className="font-semibold text-emerald-950">{settings.affiliateId}</strong></span>
          </div>

          {/* Stats Badge */}
          {conversionCount > 0 && (
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
              <span>{conversionCount} link đã tạo</span>
            </div>
          )}

          {/* Owner Affiliate Settings Button */}
          <button
            id="owner-settings-btn"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-all shadow-xs active:scale-95"
            title="Cài đặt mã Affiliate của chủ web"
          >
            <Settings className="w-4 h-4 text-orange-400" />
            <span className="hidden xs:inline">Cài Đặt Affiliate</span>
            <span className="xs:hidden">Cài đặt</span>
          </button>
        </div>
      </div>
    </header>
  );
};
