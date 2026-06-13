import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import PromoPopup from '@/components/shop/PromoPopup';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PromoPopup />
    </div>
  );
}
