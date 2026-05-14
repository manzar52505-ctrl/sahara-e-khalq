import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { Language } from '../types';

interface TestimonialsProps {
  lang: Language;
}

export default function Testimonials({ lang }: TestimonialsProps) {
  const stories = [
    { 
      name: 'Ayesha Bibi', 
      locEn: 'Food Relief, Pindi', 
      locUr: 'راولپنڈی',
      contentEn: 'Sahara-e-Khalq helped us when we lost everything. Their food and shelter support was a lifeline for my children.',
      contentUr: 'سہارا خلق نے اس وقت ہماری مدد کی جب ہم سب کچھ کھو چکے تھے۔ ان کا راشن میرے بچوں کے لیے زندگی کی مانند تھا۔'
    },
    { 
      name: 'Mohammad Raza', 
      locEn: 'Education Program', 
      locUr: 'تعلیمی وظیفہ',
      contentEn: 'Thanks to their scholarship, I am the first in my family to attend college. They truly care about our future.',
      contentUr: 'ان کے وظیفے کی بدولت، میں اپنے خاندان میں کالج جانے والا پہلا شخص ہوں۔ وہ ہمارے مستقبل کی فکر کرتے ہیں۔'
    },
    { 
      name: 'Zainab Noor', 
      locEn: 'Medical Camp', 
      locUr: 'طبی امداد',
      contentEn: 'The medical assistance for my surgery was something I could never afford. May Allah reward them for their kindness.',
      contentUr: 'میری سرجری کے لیے طبی امداد ایسی تھی جس کی میں استطاعت نہیں رکھتی تھی۔ اللہ ان کو جزا دے۔'
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">
            {lang === 'en' ? 'Transformed Lives' : 'انسانی کہانیاں'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {lang === 'en' ? "Stories of Hope and Gratitude" : "جن زندگیوں کو ہم نے سنوارا"}
          </h2>
          <p className="text-primary/60 font-urdu text-2xl">تاثرات</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-ivory p-10 rounded-[2.5rem] relative group border border-transparent hover:border-accent/20 transition-all duration-500 shadow-xl shadow-primary/5"
            >
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white shadow-xl shadow-accent/20 rotate-12 group-hover:rotate-0 transition-transform">
                <Quote className="w-8 h-8 fill-current" />
              </div>
              
              <p className="italic text-primary/80 mb-10 relative z-10 leading-relaxed text-lg pt-4 min-h-[120px]">
                 "{lang === 'en' ? s.contentEn : s.contentUr}"
              </p>
              
              <div className="flex items-center gap-5 pt-8 border-t border-primary/5">
                <div className="w-14 h-14 bg-primary text-accent rounded-2xl flex items-center justify-center text-2xl font-serif font-bold shadow-lg">
                  {s.name[0]}
                </div>
                <div>
                  <h5 className="font-bold text-primary text-xl leading-tight">{s.name}</h5>
                  <p className="text-sm text-accent font-bold uppercase tracking-widest mt-1 opacity-70">
                    {lang === 'en' ? s.locEn : s.locUr}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
