import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { GalleryItem } from '../../types';
import { ArrowLeft, Maximize2, X, Download, Share2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [lang] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
              Moments of <span className="text-accent italic">Impact</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Through the lens: A collection of our field work, community interactions, and successful missions.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="aspect-square bg-gray-100 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group break-inside-avoid rounded-3xl overflow-hidden cursor-zoom-in"
                  onClick={() => setSelectedImage(item)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.caption}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                    <div className="flex items-center justify-between gap-4 translate-y-4 group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-xs font-bold leading-relaxed line-clamp-2">
                        {item.caption}
                      </p>
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="py-20 text-center">
              <h3 className="text-xl font-serif font-bold text-primary">Gallery is empty</h3>
              <p className="text-gray-400">Check back later for new photos.</p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center p-6 md:p-12 mb-[-1px]"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-10 h-10" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl w-full flex flex-col md:flex-row gap-12 items-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-1 rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                  src={selectedImage.imageUrl} 
                  className="w-full h-auto max-h-[80vh] object-contain"
                  alt={selectedImage.caption} 
                />
              </div>
              
              <div className="w-full md:w-80 flex flex-col gap-8 text-white">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent block mb-4">Photo Caption</span>
                  <p className="text-lg font-serif italic text-white/80 leading-relaxed">
                    "{selectedImage.caption}"
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button className="flex items-center justify-center gap-3 bg-white text-primary py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all">
                    <Download className="w-4 h-4" />
                    Download HD
                  </button>
                  <button className="flex items-center justify-center gap-3 bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
                    <Share2 className="w-4 h-4" />
                    Share Photo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer lang={lang} />
    </div>
  );
}
