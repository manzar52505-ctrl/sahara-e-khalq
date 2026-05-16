import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { 
  Users, 
  Utensils, 
  GraduationCap, 
  Cross, 
  HeartHandshake, 
  HandHeart,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { subscribeToStats, updateStats } from '../../services/firebase';
import { motion } from 'motion/react';
import Toast from '../../components/ui/Toast';

export default function Settings() {
  const [stats, setStats] = useState({
    familiesHelped: 12400,
    mealsServed: 85000,
    studentsSupported: 3200,
    medicalCases: 940,
    totalVolunteers: 320,
    totalDonations: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStats((data: any) => {
      if (data) {
        setStats(prev => ({ ...prev, ...data }));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStats(stats);
      setToast({ message: 'Global stats updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update stats.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const statFields = [
    { id: 'familiesHelped', label: 'Families Helped', icon: Users, color: 'bg-blue-500' },
    { id: 'mealsServed', label: 'Meals Served', icon: Utensils, color: 'bg-orange-500' },
    { id: 'studentsSupported', label: 'Students Supported', icon: GraduationCap, color: 'bg-emerald-500' },
    { id: 'medicalCases', label: 'Medical Cases', icon: Cross, color: 'bg-red-500' },
    { id: 'totalVolunteers', label: 'Total Volunteers', icon: HeartHandshake, color: 'bg-purple-500' },
    { id: 'totalDonations', label: 'Total Donations (PKR)', icon: HandHeart, color: 'bg-accent' },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="System Settings" />
        
        <main className="p-10 max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-2">Global Impact Metrics</h2>
            <p className="text-gray-500">Update these metrics to reflect the real-time impact on the home page.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <span className="font-bold text-gray-400 uppercase tracking-widest text-sm">Loading Stats...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {statFields.map((field) => (
                  <div key={field.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 group hover:border-accent/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${field.color} rounded-xl flex items-center justify-center text-white`}>
                        <field.icon className="w-5 h-5" />
                      </div>
                      <label className="font-bold text-gray-700">{field.label}</label>
                    </div>
                    <input
                      type="number"
                      value={(stats as any)[field.id]}
                      onChange={(e) => setStats({ ...stats, [field.id]: Number(e.target.value) })}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-accent focus:bg-white outline-none transition-all font-bold text-primary text-lg"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto bg-accent hover:bg-accent-dark text-white px-12 py-5 rounded-2xl font-bold shadow-xl shadow-accent/20 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {saving ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-16 bg-blue-50 border border-blue-100 p-8 rounded-[2.5rem] flex gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">Automated Synchronization</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                Changes made here are instantly synchronized with the live website. Your donors will see the updated impact statistics immediately without needing a page refresh.
              </p>
            </div>
          </div>
        </main>
      </div>

      <Toast 
        message={toast?.message || null} 
        type={toast?.type || 'success'} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
}
