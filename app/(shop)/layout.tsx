import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import PromoBar from '@/components/shop/PromoBar';
import ChatbotWidget from '@/components/shop/ChatbotWidget';
import ScrollToTop from '@/components/shop/ScrollToTop';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      {/* Actiebalk + header blijven samen bovenin plakken bij het scrollen. */}
      <div className="sticky top-0 z-50">
        <PromoBar />
        <Header />
      </div>
      <main className="min-h-screen pt-2 md:pt-3">
        {children}
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
