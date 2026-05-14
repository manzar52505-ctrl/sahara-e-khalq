import { motion } from 'motion/react';
import { Copy, MapPin, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface CampaignProps {
  lang: Language;
  onCopy: (text: string) => void;
}

export default function Campaign({ lang, onCopy }: CampaignProps) {
  const accountNum = "0301-0076298";
  
  return (
    <section className="py-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6"
      >
        <div className="relative group overflow-hidden bg-accent rounded-[2.5rem] p-8 md:p-16 text-white text-center shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 border-[40px] border-white rounded-full"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 border-[40px] border-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-white fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {lang === 'en' ? 'Current Campaign' : 'موجودہ مہم'}
              </span>
            </div>
            
            <h3 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              {lang === 'en' ? 'Washing Machine for Orphanage' : 'یتیم خانے کے لیے واشنگ مشین'}
            </h3>
            
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              {lang === 'en' ? 
                'Small efforts bring big ease. We are raising funds to provide a washing machine to an orphanage home, helping children live with comfort and hygiene. Be a part of this goodness.' : 
                'ایک چھوٹی سی کوشش بڑی آسانی لا سکتی ہے۔ ہم یتیم خانے کو واشنگ مشین فراہم کرنے کے لیے عطیات جمع کر رہے ہیں۔ اس کارِ خیر کا حصہ بنیں۔'
              }
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto mb-10">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">
                  {lang === 'en' ? 'Send via EasyPaisa' : 'ایزی پیسہ کے ذریعے بھیجیں'}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <span className="text-3xl md:text-4xl font-mono font-bold tracking-tighter">{accountNum}</span>
                  <button 
                    onClick={() => onCopy(accountNum)}
                    className="p-3 bg-white text-accent rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg"
                  >
                    <Copy className="w-6 h-6" />
                  </button>
                </div>
                <div className="mt-4 text-sm font-bold opacity-80 uppercase tracking-widest">
                  {lang === 'en' ? 'Name: Adeel Ahmed Farooqi' : 'نام: عدیل احمد فاروقی'}
                </div>
              </div>
              
              <div className="bg-primary-dark/30 backdrop-blur-md rounded-3xl p-8 border border-white/20 flex flex-col items-center justify-center">
                <MapPin className="w-8 h-8 text-white mb-4" />
                <h4 className="text-xl font-bold mb-2">
                  {lang === 'en' ? 'Location Coverage' : 'علاقائی کوریج'}
                </h4>
                <p className="text-white/80">
                  Rawalpindi & Islamabad, Pakistan
                </p>
              </div>
            </div>
            
            <div className="text-ivory/60 text-sm font-bold uppercase tracking-[0.3em]">
              {lang === 'en' ? 'Together We Can Make a Difference' : 'مل کر ہم تبدیلی لا سکتے ہیں'}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
