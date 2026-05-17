import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { NewsPost } from '../../types';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Link2, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

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
      <SEO title="Loading News..." />
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
      <SEO title="News Post Not Found" />
      <h2 className="text-3xl font-serif font-bold text-primary mb-4">Post Not Found</h2>
      <Link to="/news" className="text-accent font-bold uppercase tracking-widest text-sm hover:underline">
        Back to News
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <SEO 
        title={`${post.titleEn} | Sahara News`}
        description={post.descriptionEn.substring(0, 160)}
        image={post.imageUrl}
        type="article"
      />
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
                  <button 
                    onClick={() => {
                      const url = window.location.href;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const url = window.location.href;
                      const text = post.titleEn;
                      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-sky-500 hover:text-white transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const url = window.location.href;
                      const text = `Read this: ${post.titleEn}`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                    }}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-green-600 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-dark hover:text-white transition-all"
                  >
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
