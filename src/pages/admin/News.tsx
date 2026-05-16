import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { 
  Plus, 
  Trash2, 
  Loader2,
  Newspaper,
  Calendar,
  Search,
  Upload,
  X
} from 'lucide-react';
import { subscribeToNews, addNews, deleteNews, uploadImage } from '../../services/firebase';
import { NewsPost, NewsCategory, NewsStatus } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';

export default function News() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<NewsPost | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    titleEn: '',
    titleUr: '',
    category: 'Campaign' as NewsCategory,
    date: new Date().toISOString().split('T')[0],
    descriptionEn: '',
    descriptionUr: '',
    status: 'published' as NewsStatus,
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToNews((data) => {
      setPosts(data as NewsPost[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setToast({ message: 'Image size must be less than 10MB', type: 'error' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(0);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'news', (progress) => {
          setUploadProgress(Math.round(progress));
        });
      }
      await addNews({ ...formData, imageUrl });
      setToast({ message: 'News posted successfully!', type: 'success' });
      setIsFormOpen(false);
      resetForm();
      setUploadProgress(null);
    } catch (error: any) {
      console.error('Submit error:', error);
      let errorMsg = 'Failed to post news.';
      try {
        const errorData = JSON.parse(error.message);
        errorMsg = `Error: ${errorData.error}`;
      } catch (e) {
        errorMsg = error.message || errorMsg;
      }
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleUr: '',
      category: 'Campaign',
      date: new Date().toISOString().split('T')[0],
      descriptionEn: '',
      descriptionUr: '',
      status: 'published',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async () => {
    if (deleteItem) {
      try {
        if (deleteItem.imageUrl) {
          const { deleteImage } = await import('../../services/firebase');
          await deleteImage(deleteItem.imageUrl);
        }
        await deleteNews(deleteItem.id);
        setToast({ message: 'News deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete news.', type: 'error' });
      } finally {
        setDeleteItem(null);
        setIsConfirmOpen(false);
      }
    }
  };

  const filteredPosts = posts.filter(p => 
    p.titleEn.toLowerCase().includes(search.toLowerCase()) || 
    p.titleUr.includes(search)
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="News & Updates" />
        
        <main className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search updates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-accent outline-none shadow-sm transition-all"
              />
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 flex items-center gap-2 transition-all hover:-translate-y-1"
            >
              <Plus className="w-6 h-6" />
              Create Update
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <span className="font-bold text-gray-400 uppercase tracking-widest text-sm">Loading News...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex gap-6 hover:shadow-xl transition-all group">
                  <div className="w-48 h-48 flex-shrink-0 relative">
                    <img src={post.imageUrl || null} alt={post.titleEn} className="w-full h-full object-cover rounded-[1.8rem] shadow-sm" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-accent border border-white/20">
                      {post.category}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-primary line-clamp-1">{post.titleEn}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{post.descriptionEn}</p>
                      <h4 className="font-urdu text-accent text-right text-lg border-t pt-2 border-gray-50">{post.titleUr}</h4>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${post.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                        {post.status}
                      </span>
                      <button 
                        onClick={() => {
                          setDeleteItem(post);
                          setIsConfirmOpen(true);
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPosts.length === 0 && (
                <div className="col-span-full py-40 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                    <Newspaper className="w-10 h-10" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No news posts found.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create News Update">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image */}
          <div className="relative w-full h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group">
            {imagePreview ? (
              <>
                <img src={imagePreview || null} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImagePreview(null)} className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg shadow-lg"><X className="w-4 h-4" /></button>
              </>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 font-bold uppercase">Upload Image</span>
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Title (EN)</label>
              <input type="text" value={formData.titleEn} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-right">عنوان (اردو)</label>
              <input type="text" dir="rtl" value={formData.titleUr} onChange={(e) => setFormData({...formData, titleUr: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent outline-none font-urdu" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as NewsCategory})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent outline-none">
                <option value="Campaign">Campaign</option>
                <option value="Event">Event</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as NewsStatus})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent outline-none">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <textarea placeholder="English Description..." rows={3} value={formData.descriptionEn} onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent outline-none" />
            <textarea placeholder="اردو تفصیل..." dir="rtl" rows={3} value={formData.descriptionUr} onChange={(e) => setFormData({...formData, descriptionUr: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent outline-none font-urdu" />
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 px-8 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold uppercase text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-8 py-4 rounded-xl bg-accent text-white font-bold shadow-lg shadow-accent/20 uppercase text-sm flex items-center justify-center gap-2">
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploadProgress !== null && uploadProgress < 100 && (
                    <span>{uploadProgress}%</span>
                  )}
                  {uploadProgress === 100 && <span>Processing...</span>}
                  {!uploadProgress && <span>Publishing...</span>}
                </div>
              ) : 'Publish Update'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete news post?"
        message="This will permanently remove this update from the website."
      />

      <Toast 
        message={toast?.message || null} 
        type={toast?.type || 'success'} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
}
