import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Campaign as CampaignType } from '../../types';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Share2, Copy, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lang] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'campaigns', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() } as CampaignType);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-serif font-bold text-primary mb-4">Campaign Not Found</h2>
      <Link to="/campaigns" className="text-accent font-bold uppercase tracking-widest text-sm hover:underline">
        Back to Campaigns
      </Link>
    </div>
  );

  const progress = Math.min((campaign.collectedAmount / campaign.targetAmount) * 100, 100);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar lang={lang} onToggleLang={() => {}} />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/campaigns" className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to All Campaigns
          </Link>

          <div className="grid lg:grid-cols-12 gap-16">
            {/* Left Column: Content */}
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[3rem] overflow-hidden shadow-2xl mb-12"
              >
                <img 
                  src={campaign.imageUrl} 
                  alt={campaign.titleEn}
                  className="w-full aspect-[16/9] object-cover"
                />
              </motion.div>

              <div className="space-y-8">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    {campaign.location}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-xs uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    Started: {new Date(campaign.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary leading-tight">
                  {campaign.titleEn}
                </h1>

                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-xl text-primary/80 leading-relaxed whitespace-pre-line">
                    {campaign.descriptionEn}
                  </p>
                </div>

                <div className="pt-8 border-t border-gray-100 flex items-center gap-6">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Share this cause</span>
                  <div className="flex gap-4">
                    <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:text-accent transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:text-accent transition-colors">
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Donation Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100">
                  <div className="mb-10">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="text-3xl font-serif font-bold text-primary">PKR {campaign.collectedAmount.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm ml-2">raised of PKR {campaign.targetAmount.toLocaleString()}</span>
                      </div>
                      <span className="text-accent font-black text-xl">{Math.round(progress)}%</span>
                    </div>
                    
                    <div className="w-full h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 mb-6">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-accent rounded-full"
                        style={{ boxShadow: '0 0 20px rgba(255, 126, 0, 0.3)' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Easypaisa_logo.png" alt="" className="h-12" />
                      </div>
                      
                      <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em] block mb-4">Direct Donation Account</span>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">EasyPaisa Number</span>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-mono font-bold tracking-tighter text-primary">{campaign.easypaisaNumber}</span>
                            <button 
                              onClick={() => handleCopy(campaign.easypaisaNumber)}
                              className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-accent shadow-sm border border-gray-100 hover:scale-110'}`}
                            >
                              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Account Name</span>
                          <span className="text-lg font-bold text-primary">{campaign.easypaisaName}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed px-4">
                      Your contribution goes directly towards <br /> <span className="text-accent font-black">"{campaign.titleEn}"</span>
                    </p>
                  </div>
                </div>

                <div className="bg-primary-dark rounded-[2.5rem] p-10 text-white text-center">
                  <h4 className="text-xl font-serif font-bold mb-4">Need Help?</h4>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    If you encounter any issues with the donation process, please contact our support team.
                  </p>
                  <a href="tel:03001234567" className="inline-flex items-center gap-3 font-bold text-accent hover:gap-4 transition-all">
                    Contact Us
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
