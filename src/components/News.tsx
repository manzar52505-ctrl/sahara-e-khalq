import { motion } from 'motion/react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';

interface NewsProps {
  lang: Language;
}

export default function News({ lang }: NewsProps) {
  const news = [
    { 
      img: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800', 
      tag: 'Campaign', 
      date: 'May 2025', 
      title: 'Washing Machine Campaign Launched',
      titleUr: 'واشنگ مشین مہم کا آغاز'
    },
    { 
      img: 'https://images.unsplash.com/photo-1547826039-bfc35e0ea1e6?w=800', 
      tag: 'Impact', 
      date: 'March 2025', 
      title: 'Ramadan Food Drive Success stories',
      titleUr: 'رمضان فوڈ ڈرائیو کی کامیابیاں'
    },
    { 
      img: 'https://images.unsplash.com/photo-1576091160550-217359f4b143?w=800', 
      tag: 'Medical', 
      date: 'Feb 2025', 
      title: 'Free Medical Camp in Pindi Suburbs',
      titleUr: 'پنڈی مضافات میں فری میڈیکل کیمپ'
    },
  ];

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">
              {lang === 'en' ? 'Stay Updated' : 'تازہ ترین خبریں'}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary max-w-2xl leading-tight">
              {lang === 'en' ? 'News from the Ground' : 'جذبہ، خدمت اور تازہ ترین اپڈیٹس'}
            </h2>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold group">
            <span>{lang === 'en' ? 'View All Updates' : 'تمام اپڈیٹس دیکھیں'}</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((n, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-8 shadow-xl">
                <img 
                  src={n.img} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={n.title} 
                />
                <div className="absolute top-6 left-6 bg-accent text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  {n.tag}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-primary/40 text-xs font-bold uppercase tracking-widest mb-4">
                <Calendar className="w-3 h-3" />
                <span>{n.date}</span>
              </div>
              
              <h4 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                {lang === 'en' ? n.title : n.titleUr}
              </h4>
              
              <div className="w-10 h-1.5 bg-accent/20 group-hover:w-24 group-hover:bg-accent transition-all duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
