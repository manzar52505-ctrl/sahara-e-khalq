import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { Language, NewsPost } from '../types';
import { subscribeToNews } from '../services/firebase';

interface NewsProps {
  lang: Language;
}

export default function News({ lang }: NewsProps) {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToNews((data: NewsPost[]) => {
      // Only show published posts on main page
      setPosts(data.filter(p => p.status === 'published'));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
          <a 
            href="/news"
            className="flex items-center gap-2 text-primary font-bold group"
          >
            <span>{lang === 'en' ? 'View All Updates' : 'تمام اپڈیٹس دیکھیں'}</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((n, i) => (
              <motion.a 
                href={`/news/${n.id}`}
                key={n.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-8 shadow-xl">
                  <img 
                    src={n.imageUrl || null} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={n.titleEn} 
                  />
                  <div className="absolute top-6 left-6 bg-accent text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                    {n.category}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-primary/40 text-xs font-bold uppercase tracking-widest mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>{n.date}</span>
                </div>
                
                <h4 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                  {lang === 'en' ? n.titleEn : n.titleUr}
                </h4>
                
                <div className="w-10 h-1.5 bg-accent/20 group-hover:w-24 group-hover:bg-accent transition-all duration-500"></div>
              </motion.a>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400 italic">
                No updates posted yet.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
