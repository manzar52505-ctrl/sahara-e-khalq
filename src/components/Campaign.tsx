import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { Language, Campaign as CampaignType } from '../types';
import { subscribeToCampaigns } from '../services/firebase';

interface CampaignProps {
  lang: Language;
  onCopy: (text: string) => void;
}

export default function Campaign({ lang, onCopy }: CampaignProps) {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCampaigns((data: CampaignType[]) => {
      setCampaigns(data);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const upcomingCampaigns = campaigns.filter(c => c.status === 'upcoming');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');

  if (campaigns.length === 0) return null;

  const featured = activeCampaigns.find(c => c.isFeatured) || activeCampaigns[0] || upcomingCampaigns[0];

  return (
    <section id="campaigns" className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
            {lang === 'en' ? 'Our Missions' : 'ہمارے مشن'}
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
            {lang === 'en' ? 'Current Campaigns' : 'جاری مہمات'}
          </h2>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-1.5 bg-accent rounded-full"></div>
            <a 
              href="/campaigns"
              className="mt-4 inline-flex items-center gap-2 text-accent font-bold uppercase tracking-[0.2em] text-[10px] hover:gap-4 transition-all"
            >
              Explore All Missions
              <Sparkles className="w-3 h-3" />
            </a>
          </div>
        </div>

        {featured && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="relative group overflow-hidden bg-primary-dark rounded-[3rem] shadow-2xl">
              <div className="absolute inset-0 z-0">
                <img 
                  src={featured.imageUrl || null} 
                  alt="" 
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/60 to-transparent"></div>
              </div>
              
              <div className="relative z-10 p-8 md:p-20 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-white">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white mb-8 backdrop-blur-sm shadow-xl">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {lang === 'en' ? 'Featured Campaign' : 'نمایاں مہم'}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                    {lang === 'en' ? featured.titleEn : featured.titleUr}
                  </h3>
                  
                  <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl">
                    {lang === 'en' ? featured.descriptionEn : featured.descriptionUr}
                  </p>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-white/60 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="text-sm font-bold tracking-tight">{featured.location}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-[400px]">
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl text-primary">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">EasyPaisa Payment</span>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Easypaisa_logo.png" alt="EasyPaisa" className="h-6 opacity-30 grayscale" />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100 group/item">
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest block mb-2">Account Number</span>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-mono font-bold tracking-tighter">{featured.easypaisaNumber}</span>
                        <button 
                          onClick={() => onCopy(featured.easypaisaNumber)}
                          className="p-3 bg-white text-accent rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg border border-gray-100"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Account Holder</span>
                        <span className="text-sm font-bold text-primary">{featured.easypaisaName}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-bold text-gray-500">
                        <span>{Math.round((featured.collectedAmount / featured.targetAmount) * 100)}% Reached</span>
                        <span>PKR {featured.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min((featured.collectedAmount / featured.targetAmount) * 100, 100)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCampaigns.filter(c => c.id !== featured?.id).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col group h-full hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={c.imageUrl || null} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt={c.titleEn} 
                />
                <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Active
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h4 className="text-2xl font-serif font-bold text-primary mb-4 h-16 line-clamp-2">
                  {lang === 'en' ? c.titleEn : c.titleUr}
                </h4>
                
                <p className="text-sm text-gray-500 line-clamp-3 mb-8 flex-1">
                  {lang === 'en' ? c.descriptionEn : c.descriptionUr}
                </p>

                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl group/btn transition-colors hover:bg-accent/5">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">EasyPaisa</span>
                      <span className="font-mono font-bold text-primary">{c.easypaisaNumber}</span>
                    </div>
                    <button 
                      onClick={() => onCopy(c.easypaisaNumber)}
                      className="p-2.5 bg-white text-accent rounded-xl hover:scale-110 active:scale-95 transition-all shadow-sm border border-gray-100"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>Goal: PKR {c.targetAmount.toLocaleString()}</span>
                      <span className="text-accent">{Math.round((c.collectedAmount / c.targetAmount) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((c.collectedAmount / c.targetAmount) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {completedCampaigns.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col items-center">
             <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">Completed Missions</span>
             <div className="flex flex-wrap justify-center gap-4">
                {completedCampaigns.slice(0, 3).map(c => (
                  <div key={c.id} className="bg-white/50 px-6 py-3 rounded-2xl border border-gray-100 text-sm font-bold text-gray-400">
                    {lang === 'en' ? c.titleEn : c.titleUr}
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </section>
  );
}
