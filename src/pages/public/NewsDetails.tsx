import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { NewsPost } from '../../types';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Link2, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function NewsDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as NewsPost);
        }
      } catch (error) {
        console.error("Error fetching news post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-serif font-bold text-primary mb-4">Post Not Found</h2>
      <Link to="/news" className="text-accent font-bold uppercase tracking-widest text-sm hover:underline">
        Back to News
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar lang={lang} onToggleLang={() => {}} />

      <main className="pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-6">
          <Link to="/news" className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-accent text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                {post.category}
              </span>
              <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  5 min read
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary leading-tight mb-8">
              {post.titleEn}
            </h1>

            <div className="flex items-center gap-4 mb-12 border-y border-gray-100 py-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-black">
                SK
              </div>
              <div>
                <div className="text-sm font-bold text-primary">Sahara-e-Khalq Admin</div>
                <div className="text-xs text-gray-400">Editor & Contributor</div>
              </div>
            </div>
          </header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[3rem] overflow-hidden shadow-2xl mb-12"
          >
            <img 
              src={post.imageUrl} 
              alt={post.titleEn}
              className="w-full object-cover"
            />
          </motion.div>

          <div className="prose prose-lg prose-slate max-w-none mb-16">
            <div className="text-xl text-primary/80 leading-relaxed whitespace-pre-line first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-accent first-letter:float-left first-letter:mr-3 first-letter:mt-2">
              {post.descriptionEn}
            </div>
          </div>

          <div className="pt-12 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share this story:</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-dark hover:text-white transition-all">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-dark hover:text-white transition-all">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-dark hover:text-white transition-all">
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Link to="/news" className="group inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-sm border border-gray-100 hover:border-accent transition-all text-xs font-bold uppercase tracking-widest text-primary">
                Explore More Stories
                <Share2 className="w-4 h-4 text-accent transition-transform group-hover:rotate-12" />
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
