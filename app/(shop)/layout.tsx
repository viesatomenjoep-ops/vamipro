import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import PromoPopup from '@/components/shop/PromoPopup';
import ChatbotWidget from '@/components/shop/ChatbotWidget';
import ScrollToTop from '@/components/shop/ScrollToTop';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <PromoPopup />
      <Header />
      <main className="min-h-screen pt-8 md:pt-10">
        {children}
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
