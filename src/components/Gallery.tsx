import { motion } from 'motion/react';
import { Maximize2, Camera } from 'lucide-react';
import { Language } from '../types';

interface GalleryProps {
  lang: Language;
  onOpen: (img: string) => void;
}

export default function Gallery({ lang, onOpen }: GalleryProps) {
  const images = [
    { src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200', titleEn: 'Distribution Day', titleUr: 'تقسیم کا دن' },
    { src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200', titleEn: 'School Program', titleUr: 'اسکول پروگرام' },
    { src: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200', titleEn: 'Community Help', titleUr: 'کمیونٹی کی مدد' },
    { src: 'https://images.unsplash.com/photo-1593113598332-cd2882ca8780?w=1200', titleEn: 'Relief Efforts', titleUr: 'ریلیف کے کام' },
    { src: 'https://images.unsplash.com/photo-1509059852496-f3822ae057bf?w=1200', titleEn: 'Hope for All', titleUr: 'سب کے لیے امید' },
    { src: 'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?w=1200', titleEn: 'Care in Action', titleUr: 'دیکھ بھال' }
  ];

  return (
    <section id="gallery" className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">
              {lang === 'en' ? 'Our Moments' : 'ہمارے لمحات'}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary max-w-2xl leading-tight">
              {lang === 'en' ? 'Capturing Hope and Resilience' : 'امید اور حوصلے کے خوبصورت لمحات'}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-accent font-bold group cursor-pointer border-b-2 border-accent/20 pb-2 hover:border-accent transition-all">
            <Camera className="w-5 h-5" />
            <span>{lang === 'en' ? 'Follow Instagram' : 'انسٹاگرام پر فالو کریں'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group aspect-[4/3] overflow-hidden rounded-[2rem] cursor-pointer shadow-lg"
              onClick={() => onOpen(img.src)}
            >
              <img 
                src={img.src} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={img.titleEn} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-white font-bold text-xl mb-1">{lang === 'en' ? img.titleEn : img.titleUr}</h4>
                    <p className="text-accent text-sm font-bold uppercase tracking-widest">Sahara-e-Khalq</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
