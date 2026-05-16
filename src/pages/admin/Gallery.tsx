import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { subscribeToGallery, addGalleryItem, deleteGalleryItem, uploadImage } from '../../services/firebase';
import { GalleryItem } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<GalleryItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToGallery((data) => {
      setItems(data as GalleryItem[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit since we resize
        setToast({ message: 'Image size must be less than 10MB', type: 'error' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadProgress(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;
    
    setUploadLoading(true);
    setUploadProgress(0);
    try {
      const imageUrl = await uploadImage(imageFile, 'gallery', (progress) => {
        setUploadProgress(Math.round(progress));
      });
      await addGalleryItem({ imageUrl, caption });
      setToast({ message: 'Photo uploaded successfully!', type: 'success' });
      setIsFormOpen(false);
      setCaption('');
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      let errorMsg = 'Failed to upload photo.';
      try {
        const errorData = JSON.parse(error.message);
        errorMsg = `Error: ${errorData.error}`;
      } catch (e) {
        errorMsg = error.message || errorMsg;
      }
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteItem) {
      try {
        if (deleteItem.imageUrl) {
          const { deleteImage } = await import('../../services/firebase');
          await deleteImage(deleteItem.imageUrl);
        }
        await deleteGalleryItem(deleteItem.id);
        setToast({ message: 'Photo deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete photo.', type: 'error' });
      } finally {
        setDeleteItem(null);
        setIsConfirmOpen(false);
      }
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Gallery Management" />
        
        <main className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-primary">Foundation Photos</h2>
              <p className="text-gray-500 text-sm">Manage images displayed in the public gallery.</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 flex items-center gap-2 transition-all hover:-translate-y-1"
            >
              <Plus className="w-6 h-6" />
              Upload Photos
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <span className="font-bold text-gray-400 uppercase tracking-widest text-sm">Loading Photos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item) => (
                <div key={item.id} className="group bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all cursor-pointer relative">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={item.imageUrl || null} 
                      alt={item.caption} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 font-medium line-clamp-1 italic">"{item.caption || 'No caption'}"</p>
                  </div>
                  <button 
                    onClick={() => {
                      setDeleteItem(item);
                      setIsConfirmOpen(true);
                    }}
                    className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-full py-40 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">The gallery is empty.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Upload New Photo">
        <form onSubmit={handleUpload} className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden group">
              {imagePreview ? (
                <>
                  <img src={imagePreview || null} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Select Image</span>
                  <p className="text-xs text-gray-400 mt-1">Recommended: 16:9 Aspect Ratio (Max 2MB)</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 whitespace-nowrap">Short Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all placeholder:text-gray-400"
              placeholder="E.g., Medical camp in Islamabad..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex-1 px-8 py-5 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadLoading || !imageFile}
              className="flex-1 px-8 py-5 rounded-2xl bg-accent text-white font-bold hover:bg-accent-dark transition-all shadow-lg shadow-accent/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {uploadLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploadProgress !== null && uploadProgress < 100 && (
                    <span>{uploadProgress}%</span>
                  )}
                  {uploadProgress === 100 && <span>Processing...</span>}
                  {!uploadProgress && <span>Uploading...</span>}
                </div>
              ) : 'Start Upload'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Remove Photo?"
        message="This photo will be permanently deleted from the gallery."
      />

      <Toast 
        message={toast?.message || null} 
        type={toast?.type || 'success'} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
}
