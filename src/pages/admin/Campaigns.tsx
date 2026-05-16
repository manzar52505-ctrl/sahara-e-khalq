import { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { subscribeToCampaigns, addCampaign, updateCampaign, deleteCampaign } from '../../services/firebase';
import { Campaign, CampaignStatus } from '../../types';
import Modal from '../../components/ui/Modal';
import CampaignForm from '../../components/admin/CampaignForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | undefined>(undefined);
  const [deleteItem, setDeleteItem] = useState<Campaign | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCampaigns((data) => {
      setCampaigns(data as Campaign[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (data: any) => {
    console.log('Campaigns: handleSave called with data:', data);
    try {
      if (currentCampaign) {
        console.log('Campaigns: Updating existing campaign...', currentCampaign.id);
        await updateCampaign(currentCampaign.id, data);
        setToast({ message: 'Campaign updated successfully!', type: 'success' });
      } else {
        console.log('Campaigns: Adding new campaign...');
        await addCampaign(data);
        setToast({ message: 'Campaign added successfully!', type: 'success' });
      }
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Campaigns: handleSave caught error:', error);
      let errorMsg = 'Failed to save campaign.';
      try {
        const errorData = JSON.parse(error.message);
        errorMsg = `Error: ${errorData.error}`;
      } catch (e) {
        errorMsg = error.message || errorMsg;
      }
      setToast({ message: errorMsg, type: 'error' });
      throw error; // Rethrow to let the form know it failed
    }
  };

  const handleDelete = async () => {
    if (deleteItem) {
      try {
        if (deleteItem.imageUrl) {
          const { deleteImage } = await import('../../services/firebase');
          await deleteImage(deleteItem.imageUrl);
        }
        await deleteCampaign(deleteItem.id);
        setToast({ message: 'Campaign deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete campaign.', type: 'error' });
      } finally {
        setDeleteItem(null);
        setIsConfirmOpen(false);
      }
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.titleEn.toLowerCase().includes(search.toLowerCase()) || 
                         c.titleUr.includes(search);
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: CampaignStatus) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200 icon-CheckCircle',
      completed: 'bg-gray-100 text-gray-700 border-gray-200 icon-Clock',
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200 icon-AlertCircle'
    }[status];

    const Icon = {
      active: CheckCircle,
      completed: Clock,
      upcoming: AlertCircle
    }[status];

    return (
      <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 w-fit ${styles}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Manage Campaigns" />
        
        <main className="p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="flex-1 w-full max-w-2xl flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-accent outline-none shadow-sm transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-14 pr-8 py-4 rounded-2xl bg-white border border-gray-200 focus:border-accent outline-none shadow-sm transition-all appearance-none cursor-pointer font-bold text-gray-600"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentCampaign(undefined);
                setIsFormOpen(true);
              }}
              className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 flex items-center gap-2 transition-all hover:-translate-y-1"
            >
              <Plus className="w-6 h-6" />
              Add Campaign
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <span className="font-bold text-gray-400 uppercase tracking-widest text-sm">Loading Campaigns...</span>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Campaign Info</th>
                      <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Target / Collected</th>
                      <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCampaigns.map((camp) => {
                      const progress = Math.min((camp.collectedAmount / camp.targetAmount) * 100, 100);
                      return (
                        <tr key={camp.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-6">
                              <img src={camp.imageUrl || null} alt={camp.titleEn} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-primary text-lg line-clamp-1">{camp.titleEn}</span>
                                <span className="font-urdu text-accent line-clamp-1">{camp.titleUr}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {getStatusBadge(camp.status)}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-2 w-48">
                              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                <span>{progress.toFixed(0)}%</span>
                                <span>PKR {camp.targetAmount.toLocaleString()}</span>
                              </div>
                              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${progress >= 100 ? 'bg-green-500' : 'bg-accent'}`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-primary">PKR {camp.collectedAmount.toLocaleString()} collected</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => {
                                  setCurrentCampaign(camp);
                                  setIsFormOpen(true);
                                }}
                                className="p-3 bg-gray-50 text-gray-400 hover:bg-accent hover:text-white rounded-xl transition-all"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => {
                                  setDeleteItem(camp);
                                  setIsConfirmOpen(true);
                                }}
                                className="p-3 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredCampaigns.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                    <Search className="w-8 h-8" />
                  </div>
                  <p className="text-gray-400 font-medium">No campaigns match your criteria.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={currentCampaign ? 'Edit Campaign' : 'Add New Campaign'}
      >
        <CampaignForm 
          campaign={currentCampaign} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Campaign?"
        message="Are you sure you want to delete this campaign? This action cannot be undone."
      />

      <Toast 
        message={toast?.message || null} 
        type={toast?.type || 'success'} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
}
