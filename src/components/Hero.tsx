import { motion } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  lang: Language;
}

export default function Hero({ lang }: HeroProps) {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80" 
          className="w-full h-full object-cover" 
          alt="Sahara-e-Khalq Mission" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/60 to-primary-dark/90"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent mb-8 backdrop-blur-sm"
        >
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold uppercase tracking-widest">
            {lang === 'en' ? 'A Support for Humanity' : 'انسانیت کا سہارا'}
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-5xl md:text-8xl text-white mb-6 leading-[1.1] tracking-tight"
        >
          {lang === 'en' ? (
            <>Where Small Efforts Create <span className="text-accent italic">Big Change</span></>
          ) : (
            <span className="font-urdu leading-snug">ایک چھوٹی سی کوشش، بہت سے چہروں پر مسکراہٹ</span>
          )}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-2xl text-ivory/80 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
        >
          {lang === 'en' ? 
            'Sahara-e-Khalq is on a mission to help orphans, families, and vulnerable people live with comfort, dignity, and care in Rawalpindi & Islamabad.' : 
            'سہارا خلق کا مشن راولپنڈی اور اسلام آباد میں یتیموں، خاندانوں اور کمزور لوگوں کو آرام، عزت اور دیکھ بھال فراہم کرنا ہے۔'
          }
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <a 
            href="#donate" 
            className="group bg-accent text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-accent-dark transition-all shadow-2xl shadow-accent/30 flex items-center gap-2"
          >
            {lang === 'en' ? 'Support Now' : 'تعاون کریں'}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#programs" 
            className="text-white border-b-2 border-white/30 hover:border-accent text-xl font-medium py-2 transition-all"
          >
            {lang === 'en' ? 'Our Impact' : 'ہمارے اثرات'}
          </a>
        </motion.div>
      </div>

      {/* Decorative scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/40"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-ivory/40 to-transparent"></div>
      </motion.div>
    </section>
  );
}
