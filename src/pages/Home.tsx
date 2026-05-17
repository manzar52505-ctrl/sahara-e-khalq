import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ImpactBar from '../components/ImpactBar';
import About from '../components/About';
import Campaign from '../components/Campaign';
import Programs from '../components/Programs';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Donate from '../components/Donate';
import News from '../components/News';
import Volunteer from '../components/Volunteer';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Language } from '../types';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [scrolled, setScrolled] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ur' : 'en';
    setLang(newLang);
    document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr';
    showToast(newLang === 'ur' ? "اردو زبان منتخب کی گئی" : "English Language Selected");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(lang === 'en' ? "Copied to clipboard!" : "کلپ بورڈ پر کاپی ہو گیا!");
    });
  };

  return (
    <div className={`min-h-screen bg-ivory text-primary selection:bg-accent selection:text-white ${lang === 'ur' ? 'lang-urdu font-urdu' : 'font-sans'}`}>
      <SEO 
        title="Home | Sahara-e-Khalq Foundation"
        description="Serving humanity with compassion. Sahara-e-Khalq Foundation works for education, food security, and healthcare for the underprivileged."
      />
      <Navbar lang={lang} onToggleLang={toggleLanguage} />
      
      <main>
        <Hero lang={lang} />
        <ImpactBar lang={lang} />
        <About lang={lang} />
        <Campaign lang={lang} onCopy={copyToClipboard} />
        <Programs lang={lang} />
        <Gallery lang={lang} onOpen={setLightbox} />
        <Testimonials lang={lang} />
        <Donate lang={lang} onCopy={copyToClipboard} />
        <News lang={lang} />
        <Volunteer lang={lang} onToast={showToast} />
        <Contact lang={lang} onToast={showToast} />
      </main>

      <Footer lang={lang} />

      {/* Scroll to Top */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-8 w-14 h-14 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl z-40 transition-transform hover:-translate-y-2 hover:bg-accent"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/923360013523" 
        target="_blank" 
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25d366] text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl z-40 transition-transform hover:-translate-y-2 hover:scale-110 active:scale-95"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.832 11.832 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 50, opacity: 0, x: '-50%' }}
            className="fixed bottom-10 left-1/2 p-1 bg-primary text-white rounded-2xl shadow-2xl z-[100] border border-white/10"
          >
            <div className="bg-primary px-8 py-3 rounded-xl flex items-center gap-4">
              <span className="font-bold">{toast}</span>
              <button 
                onClick={() => setToast(null)}
                className="hover:bg-white/10 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-dark/95 backdrop-blur-md z-[200] flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh]">
              <motion.img 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={lightbox || undefined} 
                className="w-full h-full object-contain rounded-3xl shadow-2xl border-4 border-white/10" 
                alt="Lightbox Fullsize" 
              />
              <button className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold tracking-widest uppercase text-xs">
                Close <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
