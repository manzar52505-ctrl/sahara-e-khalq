import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Campaign as CampaignType } from '../../types';
import { ArrowLeft, Sparkles, MapPin, Search } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lang] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CampaignType));
      setCampaigns(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredCampaigns = campaigns.filter(c => 
    c.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.titleUr.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-ivory">
      <SEO 
        title="Active Campaigns | Sahara-e-Khalq Foundation"
        description="Explore our active social welfare missions. Join us in making an impact through healthcare, education, and humanitarian aid."
      />
      <Navbar lang={lang} onToggleLang={() => {}} />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-4 hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary">
                Our active <span className="text-accent italic">Missions</span>
              </h1>
            </div>

            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 shadow-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-[500px] bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col group h-full hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={c.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt={c.titleEn} 
                    />
                    <div className="absolute top-6 left-6 bg-accent/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                      {c.status}
                    </div>
                  </div>
                  
                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-accent uppercase tracking-widest">
                      <MapPin className="w-3 h-3" />
                      {c.location}
                    </div>
                    
                    <h3 className="text-2xl font-serif font-bold text-primary mb-4 line-clamp-2 leading-tight">
                      {c.titleEn}
                    </h3>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                      {c.descriptionEn}
                    </p>

                    <div className="mt-auto space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span>Progress</span>
                          <span className="text-accent">{Math.round((c.collectedAmount / c.targetAmount) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min((c.collectedAmount / c.targetAmount) * 100, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-accent rounded-full"
                          />
                        </div>
                        <div className="text-xs font-bold text-primary">
                          PKR {c.collectedAmount.toLocaleString()} <span className="text-gray-400 font-normal">of</span> PKR {c.targetAmount.toLocaleString()}
                        </div>
                      </div>

                      <Link 
                        to={`/campaigns/${c.id}`}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:shadow-xl hover:shadow-accent/30 transition-all text-center block"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredCampaigns.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Sparkles className="w-12 h-12 text-accent/20 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-primary">No campaigns found</h3>
                  <p className="text-gray-400">Try adjusting your search terms</p>
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
