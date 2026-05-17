import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import SEO from '../../components/SEO';
import { 
  Megaphone, 
  Users, 
  HandHeart, 
  Calendar,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { subscribeToCampaigns, subscribeToStats, auth, checkFirestoreConnection, checkStorageConnection } from '../../services/firebase';
import { Activity, ShieldCheck, ShieldAlert, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Campaign } from '../../types';

console.log('TRACE: Dashboard.tsx module evaluation. Link type:', typeof Link);

function ConnectionTester() {
  const [dbStatus, setDbStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');
  const [storageStatus, setStorageStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');
  const [message, setMessage] = useState('');

  const runTest = async () => {
    setDbStatus('checking');
    setStorageStatus('checking');
    setMessage('Probing network hooks...');
    
    const dbResult = await checkFirestoreConnection();
    setDbStatus(dbResult.ok ? 'online' : 'offline');
    
    const storageResult = await checkStorageConnection();
    setStorageStatus(storageResult.ok ? 'online' : 'offline');

    if (dbResult.ok && storageResult.ok) {
      setMessage('System Ready');
    } else {
      setMessage('Network Degraded');
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white/40" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">System Health</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className={`text-xs font-medium flex items-center gap-2 ${dbStatus === 'online' ? 'text-emerald-400' : dbStatus === 'offline' ? 'text-red-400' : 'text-white/40'}`}>
            {dbStatus === 'checking' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
            Database
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : dbStatus === 'offline' ? 'bg-red-400' : 'bg-gray-600'}`} />
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-xs font-medium flex items-center gap-2 ${storageStatus === 'online' ? 'text-emerald-400' : storageStatus === 'offline' ? 'text-red-400' : 'text-white/40'}`}>
            {storageStatus === 'checking' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
            File Storage
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${storageStatus === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : storageStatus === 'offline' ? 'bg-red-400' : 'bg-gray-600'}`} />
        </div>
        
        {auth.currentUser && (
          <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400/70" />
              <span className="text-[10px] text-emerald-400/70 font-mono truncate">{auth.currentUser.email}</span>
            </div>
            <span className="text-[9px] text-white/20 truncate font-mono ml-4">{auth.currentUser.uid}</span>
          </div>
        )}
      </div>

      <button 
        onClick={runTest}
        disabled={dbStatus === 'checking' || storageStatus === 'checking'}
        className="w-full text-[10px] bg-white/5 hover:bg-white/10 py-2 rounded-lg uppercase font-bold tracking-widest transition-colors border border-white/5 disabled:opacity-50"
      >
        Run Diagnostics
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<any>({ totalDonations: 0, totalVolunteers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubCampaigns = subscribeToCampaigns((camps) => {
      setCampaigns(camps as Campaign[]);
      setLoading(false);
    });

    const unsubStats = subscribeToStats((st) => {
      if (st) setStats(st);
    });

    return () => {
      unsubCampaigns();
      unsubStats();
    };
  }, []);

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  
  const statsCards = [
    { 
      label: 'Total Campaigns', 
      value: campaigns.length, 
      icon: Megaphone, 
      color: 'bg-blue-500',
      trend: `${campaigns.length} total projects`,
      subLabel: 'Across all categories'
    },
    { 
      label: 'Active Now', 
      value: activeCampaigns.length, 
      icon: Calendar, 
      color: 'bg-emerald-500',
      trend: 'Live updates',
      subLabel: 'Actively accepting support'
    },
    { 
      label: 'Total Impact', 
      value: `PKR ${stats.totalDonations?.toLocaleString()}`, 
      icon: HandHeart, 
      color: 'bg-accent',
      trend: 'Donations received',
      subLabel: 'Total collected funds'
    },
    { 
      label: 'Our Workforce', 
      value: stats.totalVolunteers, 
      icon: Users, 
      color: 'bg-purple-500',
      trend: 'Community members',
      subLabel: 'Volunteers joined'
    },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <SEO title="Admin Dashboard" noIndex={true} />
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Mission Control" />
        
        <main className="p-10 space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group hover:border-accent/30 transition-all cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/5 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 font-medium text-xs mb-1">{stat.label}</span>
                  <span className="text-2xl font-bold text-primary truncate" title={stat.value.toString()}>{stat.value}</span>
                  <span className="text-[10px] text-gray-500 mt-2 font-medium">{stat.subLabel}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Campaigns with Progress Bars */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-primary">Live Campaigns</h3>
                    <p className="text-sm text-gray-500">Track donation progress in real-time</p>
                  </div>
                  <Link to="/admin/campaigns" className="text-accent hover:text-accent-dark font-bold text-sm flex items-center gap-2 group bg-accent/5 px-4 py-2 rounded-full transition-all">
                    Management <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {campaigns.slice(0, 4).map((camp) => {
                    const progress = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100)) || 0;
                    return (
                      <div key={camp.id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-lg transition-all group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img src={camp.imageUrl} alt={camp.titleEn} className="w-12 h-12 rounded-xl object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all" />
                              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${camp.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            </div>
                            <div>
                              <h4 className="font-bold text-primary text-sm line-clamp-1">{camp.titleEn}</h4>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{camp.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-primary">PKR {camp.collectedAmount.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400 block font-bold">Goal: {camp.targetAmount.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <span>Progress</span>
                            <span className="text-accent">{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-accent'}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {campaigns.length === 0 && !loading && (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                      <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-medium italic">Your journey hasn't started yet. Create your first campaign!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Panel: Quick Actions & Status */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-primary-dark rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-accent rounded-full"></div>
                  System Status
                </h3>
                <div className="space-y-4">
                  <ConnectionTester />
                  <div className="h-px bg-white/10 my-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 ml-1">Creation Tools</h4>
                  {[
                    { to: '/admin/campaigns', label: 'New Campaign', icon: Megaphone },
                    { to: '/admin/news', label: 'Post News Update', icon: Calendar },
                    { to: '/admin/gallery', label: 'Upload to Gallery', icon: Users },
                  ].map((action, i) => (
                    <Link 
                      key={i}
                      to={action.to} 
                      className="flex items-center justify-between w-full bg-white/10 hover:bg-accent px-5 py-4 rounded-2xl transition-all border border-white/5 group"
                    >
                      <div className="flex items-center gap-3">
                        <action.icon className="w-5 h-5 text-accent group-hover:text-white" />
                        <span className="font-bold text-sm tracking-tight">{action.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tips Section */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-accent rounded-[2.5rem] p-8 text-primary shadow-lg border border-accent/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-accent">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-[0.2em]">Pro Tip</span>
                </div>
                <p className="text-sm font-bold leading-relaxed mb-4">
                  Campaigns with recent "News Updates" see 3x more engagement from donors.
                </p>
                <Link to="/admin/news" className="text-primary/60 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  Update Now <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
