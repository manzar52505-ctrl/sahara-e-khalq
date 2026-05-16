import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { NewsPost, NewsCategory } from '../../types';
import { ArrowLeft, Calendar, Tag, ChevronRight, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const categories: (NewsCategory | 'All')[] = ['All', 'Campaign', 'Event', 'Health', 'Education'];

export default function NewsPage() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<(NewsCategory | 'All')>('All');
  const [lang] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    let q = query(
      collection(db, 'news'), 
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsPost));
      setNews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredNews = activeCategory === 'All' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar lang={lang} onToggleLang={() => {}} />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <Link to="/" className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-6 hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6">
              Latest <span className="text-accent italic">Stories</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Stay updated with our latest activities, impact stories, and upcoming events in the community.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all border ${
                  activeCategory === cat 
                    ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-64 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-10">
              {filteredNews.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className="grid md:grid-cols-12 gap-0 overflow-hidden">
                    <div className="md:col-span-5 relative overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 min-h-[300px]" 
                        alt={post.titleEn} 
                      />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-7 p-10 md:p-14 flex flex-col justify-center">
                      <div className="flex items-center gap-6 mb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          5 min read
                        </div>
                      </div>
                      
                      <h3 className="text-3xl font-serif font-bold text-primary mb-6 group-hover:text-accent transition-colors leading-tight">
                        {post.titleEn}
                      </h3>
                      
                      <p className="text-gray-500 text-lg leading-relaxed mb-10 line-clamp-2">
                        {post.descriptionEn}
                      </p>

                      <Link 
                        to={`/news/${post.id}`}
                        className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs hover:gap-5 transition-all w-fit group/link"
                      >
                        Read Full Story
                        <ChevronRight className="w-4 h-4 text-accent transition-transform group-link-hover:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredNews.length === 0 && (
                <div className="py-20 text-center">
                  <Tag className="w-12 h-12 text-accent/20 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-primary">No news found</h3>
                  <p className="text-gray-400">There are no stories in this category yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
