import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { Language } from '../types';

interface AboutProps {
  lang: Language;
}

export default function About({ lang }: AboutProps) {
  return (
    <section id="about" className="py-24 bg-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            
            <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80" 
                alt="About Sahara-e-Khalq" 
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl hidden md:block border border-accent/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white text-xl font-bold">10+</div>
                <div>
                  <h4 className="font-bold text-primary">Years of Service</h4>
                  <p className="text-xs text-primary/60">Across Pindi & Islamabad</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">
              {lang === 'en' ? 'Our Foundation' : 'ہمارا مشن'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-8 leading-tight">
              {lang === 'en' ? 'Built on Compassion, Driven by Purpose' : 'خلوص سے تعمیر، مقصد کے حصول تک'}
            </h2>
            
            <div className="space-y-6 text-lg text-primary/80 leading-relaxed mb-10">
              <p>
                <strong className="text-primary">Sahara-e-Khalq (سہارا خلق)</strong> — 
                {lang === 'en' ? 
                  ' meaning Support for Humanity — was founded with one belief: every person deserves dignity and basic necessities. We operate across underserved communities in Rawalpindi and Islamabad, delivering real, lasting change.' : 
                  ' جس کا مطلب ہے انسانیت کا سہارا - ایک پختہ یقین کے ساتھ قائم کیا گیا تھا: ہر انسان عزت اور بنیادی ضروریات کا حقدار ہے۔'
                }
              </p>
              <p>
                {lang === 'en' ? 
                  'A small effort can bring big ease to many lives. Our mission is to provide orphans, families, and vulnerable people with comfort, dignity, and care.' : 
                  'ایک چھوٹی سی کوشش بہت سی زندگیوں میں بڑی آسانی لا سکتی ہے۔ سہارا خلق کا مشن یتیموں، خاندانوں اور کمزور لوگوں کو آرام، عزت اور دیکھ بھال فراہم کرنا ہے۔'
                }
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-warm-bg border border-accent/20">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-accent/10 rotate-180" />
              <div className="relative z-10 italic text-xl text-primary font-serif">
                {lang === 'en' ? 
                  '"The best of people are those who are most beneficial to others." — Hadith' : 
                  '"بہترین انسان وہ ہے جو دوسروں کے لیے نفع بخش ہو۔" — حدیث'
                }
                <span className="block mt-4 not-italic font-urdu text-2xl text-accent">
                  بہترین انسان وہ ہے جو دوسروں کے لیے نفع بخش ہو۔
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
