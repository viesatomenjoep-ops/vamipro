import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import PromoPopup from '@/components/shop/PromoPopup';
import ChatbotWidget from '@/components/shop/ChatbotWidget';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PromoPopup />
      <Header />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
