import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LinkSearchBox } from './components/LinkSearchBox';
import { ProductResultCard } from './components/ProductResultCard';
import { TrendingDeals } from './components/TrendingDeals';
import { HowItWorks } from './components/HowItWorks';
import { OwnerAffiliateModal } from './components/OwnerAffiliateModal';
import { AffiliateSettings, ShopeeProduct, ConvertedHistoryItem } from './types';
import { parseShopeeLink } from './utils/shopeeParser';

const DEFAULT_SETTINGS: AffiliateSettings = {
  affiliateId: 'AFF_ZONBIG_VN',
  subId: 'web_video_deal',
  networkType: 'shopee_direct',
  customDomain: '',
  shopeeVideoCreatorId: 'AFF_ZONBIG_CREATOR',
  autoApplyBestVoucher: true,
  enableVideoTagging: true,
};

export default function App() {
  const [settings, setSettings] = useState<AffiliateSettings>(() => {
    try {
      const saved = localStorage.getItem('shopee_aff_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [history, setHistory] = useState<ConvertedHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopee_aff_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [currentProduct, setCurrentProduct] = useState<ShopeeProduct | null>(() => {
    // Initial demo product so user sees the fully working UI immediately
    return parseShopeeLink(
      'https://shopee.vn/Ao-Thun-Nam-Polo-Cotton-Compact-Coolmate-i.12345678.987654321',
      DEFAULT_SETTINGS
    );
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  // Save settings when changed
  const handleSaveSettings = (newSettings: AffiliateSettings) => {
    setSettings(newSettings);
    localStorage.setItem('shopee_aff_settings', JSON.stringify(newSettings));

    // Update current product's affiliate url
    if (currentProduct) {
      setCurrentProduct(parseShopeeLink(currentProduct.originalUrl, newSettings));
    }
  };

  // Analyze new link pasted
  const handleAnalyze = (url: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const product = parseShopeeLink(url, settings);
      setCurrentProduct(product);
      setIsLoading(false);

      // Smooth scroll to result
      const resultElement = document.getElementById('product-result-section');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 450);
  };

  // Track conversion when customer clicks buy or copies link
  const handleLinkClick = (
    product: ShopeeProduct,
    finalPrice: number,
    commission: number
  ) => {
    const newItem: ConvertedHistoryItem = {
      id: `conv-${Date.now()}`,
      timestamp: Date.now(),
      title: product.title,
      imageUrl: product.imageUrl,
      originalPrice: product.originalPrice,
      discountedPrice: finalPrice,
      estimatedCommission: commission,
      affiliateUrl: product.affiliateUrl,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, 49)];
      localStorage.setItem('shopee_aff_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('shopee_aff_history');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col selection:bg-orange-200 selection:text-orange-950">
      {/* Top Navigation */}
      <Header
        settings={settings}
        onOpenSettings={() => setIsOwnerModalOpen(true)}
        conversionCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Link Search Box */}
        <LinkSearchBox onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Product Result Section */}
        {currentProduct && (
          <div id="product-result-section" className="mt-8">
            <ProductResultCard
              product={currentProduct}
              settings={settings}
              onLinkClick={handleLinkClick}
            />
          </div>
        )}

        {/* Trending Deals Section */}
        <TrendingDeals onSelectProduct={handleAnalyze} />

        {/* How It Works & Affiliate Mechanism FAQ */}
        <HowItWorks />
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200 py-8 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-medium text-gray-700">
            Hệ thống hỗ trợ áp mã giảm giá Shopee & Tối ưu hóa Affiliate Marketing
          </p>
          <p>
            Mã định danh Affiliate đang hoạt động: <strong className="text-gray-900 font-mono">{settings.affiliateId}</strong> ({settings.networkType})
          </p>
          <p className="text-[11px] text-gray-400">
            Website hoạt động theo chương trình Shopee Affiliate Partner Program. Tất cả thương hiệu, logo Shopee thuộc quyền sở hữu của Shopee Pte. Ltd.
          </p>
        </div>
      </footer>

      {/* Owner Affiliate Settings Modal */}
      <OwnerAffiliateModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        history={history}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
