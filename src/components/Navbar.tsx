import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, Heart } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
}

export default function Navbar({ lang, onToggleLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', en: 'Home', ur: 'ہوم' },
    { id: 'about', en: 'About', ur: 'ہمارے بارے میں' },
    { id: 'programs', en: 'Programs', ur: 'پروگرامز' },
    { id: 'gallery', en: 'Gallery', ur: 'گیلری' },
    { id: 'news', en: 'News', ur: 'خبریں' },
    { id: 'contact', en: 'Contact', ur: 'رابطہ' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-primary/95 backdrop-blur-md shadow-2xl' : 'py-5 bg-primary'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
            <Heart className="text-white w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif font-bold text-xl md:text-2xl text-accent">Sahara-e-Khalq</span>
            <span className="font-urdu text-sm md:text-base text-ivory/80 text-right">سہارا خلق</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-ivory/90 hover:text-accent font-medium transition-colors relative group text-sm uppercase tracking-widest"
            >
              {lang === 'en' ? item.en : item.ur}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          
          <div className="flex items-center gap-4 ml-4">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all text-sm font-bold"
            >
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'اردو' : 'English'}
            </button>
            <a
              href="#donate"
              className="bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {lang === 'en' ? 'Donate Now' : 'عطیہ کریں'}
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-accent p-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-primary-dark z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                 <Heart className="text-accent w-8 h-8 fill-current" />
                 <span className="font-serif font-bold text-xl text-accent">Sahara-e-Khalq</span>
              </div>
              <button className="text-accent p-2" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-ivory text-3xl font-serif hover:text-accent transition-colors"
                >
                  {lang === 'en' ? item.en : item.ur}
                </a>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-ivory/10 space-y-4">
              <button
                onClick={() => { onToggleLang(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-accent/30 text-accent font-bold"
              >
                <Globe className="w-5 h-5" />
                {lang === 'en' ? 'اردو زبان منتخب کریں' : 'Switch to English'}
              </button>
              <a
                href="#donate"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full bg-accent text-center py-4 rounded-xl text-white font-bold text-xl shadow-xl shadow-accent/20"
              >
                {lang === 'en' ? 'Donate Now' : 'عطیہ کریں'}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
