import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Campaign as CampaignType } from '../../types';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Share2, Copy, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

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
      <SEO title="Loading Campaign..." />
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
      <SEO title="Campaign Not Found" />
      <h2 className="text-3xl font-serif font-bold text-primary mb-4">Campaign Not Found</h2>
      <Link to="/campaigns" className="text-accent font-bold uppercase tracking-widest text-sm hover:underline">
        Back to Campaigns
      </Link>
    </div>
  );

  const progress = Math.min((campaign.collectedAmount / campaign.targetAmount) * 100, 100);

  return (
    <div className="min-h-screen bg-ivory">
      <SEO 
        title={`${campaign.titleEn} | Support this Campaign`}
        description={campaign.descriptionEn.substring(0, 160)}
        image={campaign.imageUrl}
        type="article"
      />
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
                    <button 
                      onClick={() => {
                        const url = window.location.href;
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                      }}
                      className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:text-blue-600 transition-colors"
                      title="Share on Facebook"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        const url = window.location.href;
                        const text = `Support this campaign: ${campaign.titleEn}`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                      }}
                      className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:text-green-600 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleCopy(window.location.href)}
                      className={`p-3 rounded-2xl shadow-sm border border-gray-100 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white hover:text-accent'}`}
                      title="Copy Link"
                    >
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
