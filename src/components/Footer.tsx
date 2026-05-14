import { Heart, Instagram, Facebook, Smartphone } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const quickLinks = [
    { href: '#home', en: 'Home', ur: 'ہوم' },
    { href: '#about', en: 'About Foundation', ur: 'ہمارے بارے میں' },
    { href: '#programs', en: 'Our Programs', ur: 'پروگرامز' },
    { href: '#gallery', en: 'Photo Gallery', ur: 'گیلری' },
  ];

  const involvement = [
    { href: '#donate', en: 'Donate Now', ur: 'عطیہ کریں' },
    { href: '#volunteer', en: 'Join as Volunteer', ur: 'رضاکار بنیں' },
    { href: '#contact', en: 'Contact Support', ur: 'رابطہ کریں' },
    { href: '#news', en: 'Latest Updates', ur: 'خبریں' },
  ];

  return (
    <footer className="bg-primary-dark text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative text background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-black text-white/5 whitespace-nowrap pointer-events-none select-none">
        SAHARA-E-KHALQ
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                <Heart className="text-white w-6 h-6 fill-current" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-bold text-2xl text-accent">Sahara-e-Khalq</span>
                <span className="font-urdu text-base text-ivory/80 text-right">سہارا خلق</span>
              </div>
            </a>
            <p className="text-ivory/60 leading-relaxed mb-8 text-lg italic">
              {lang === 'en' ? 
                'A small effort can bring big ease to many lives. Every heartbeat counts toward our mission.' : 
                'ایک چھوٹی سی کوشش بہت سی زندگیوں میں بڑی آسانی لا سکتی ہے۔ ہر دھڑکتا دل ہمارے مشن کے لیے اہم ہے۔'
              }
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-accent transition-all hover:-translate-y-1 border border-white/10"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-accent transition-all hover:-translate-y-1 border border-white/10"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#25d366] transition-all hover:-translate-y-1 border border-white/10">
                 <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.832 11.832 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-accent font-bold text-lg mb-10 tracking-widest uppercase">Quick Links</h5>
            <ul className="space-y-4">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-ivory/60 hover:text-white transition-colors text-lg flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-accent/30 rounded-full group-hover:bg-accent transition-colors"></span>
                    {lang === 'en' ? link.en : link.ur}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-accent font-bold text-lg mb-10 tracking-widest uppercase">Get Involved</h5>
            <ul className="space-y-4">
              {involvement.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-ivory/60 hover:text-white transition-colors text-lg flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-accent/30 rounded-full group-hover:bg-accent transition-colors"></span>
                    {lang === 'en' ? link.en : link.ur}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-accent font-bold text-lg mb-10 tracking-widest uppercase">Support Line</h5>
            <div className="bg-white/5 p-10 rounded-[2rem] border border-white/5 relative group hover:bg-white/10 transition-colors">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Smartphone className="w-6 h-6" />
              </div>
              <p className="text-sm mb-4 text-ivory/40 font-bold uppercase tracking-widest">EasyPaisa Hub</p>
              <p className="text-2xl font-bold text-white mb-2 font-mono">0301-0076298</p>
              <p className="text-xs text-accent font-bold uppercase tracking-widest">Adeel Ahmed Farooqi</p>
              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] text-ivory/30 uppercase tracking-widest">Location: Rawalpindi / Islamabad</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-ivory/30 text-sm font-medium">© 2025 Sahara-e-Khalq Foundation. {lang === 'en' ? 'Serving with Integrity.' : 'خلوص سے آباد۔'}</p>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-white/20">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
