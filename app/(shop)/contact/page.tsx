import { Mail, Phone, MapPin } from 'lucide-react';
export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div className="wrap py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="h-section mt-3">We denken graag met je mee</h1>
          <p className="mt-4 max-w-md text-fg-muted">
            Vragen over een product, advies over de juiste coating, of hulp bij je bestelling?
            Stuur ons een bericht — we reageren snel.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3"><Mail size={18} className="text-accent" /> {/* {{EMAIL}} */}info@vamipro.nl</li>
            <li className="flex items-center gap-3"><Phone size={18} className="text-accent" /> {/* {{TELEFOON}} */}________</li>
            <li className="flex items-center gap-3"><MapPin size={18} className="text-accent" /> {/* {{ADRES}} */}Kroonstraat 33, 4879 AV Etten-Leur, Nederland</li>
          </ul>
          <div className="mt-8 rounded border hairline bg-panel p-4 text-sm text-fg-muted">
            <p className="font-display text-fg">Vami Pro</p>
            <p>KVK {/* {{KVK}} */}86797840 · BTW {/* {{BTW_NL}} */}________</p>
          </div>
        </div>
        <form className="card space-y-3 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="field" placeholder="Naam" />
            <input className="field" placeholder="E-mail" type="email" />
          </div>
          <input className="field" placeholder="Onderwerp" />
          <textarea className="field min-h-[140px]" placeholder="Je bericht" />
          <button type="button" className="btn btn-primary w-full justify-center">Verstuur bericht</button>
          <p className="text-center text-xs text-fg-faint">We reageren doorgaans binnen één werkdag.</p>
        </form>
      </div>
    </div>
  );
}
