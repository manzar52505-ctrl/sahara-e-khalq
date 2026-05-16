import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Campaign, CampaignStatus } from '../../types';
import { uploadImage } from '../../services/firebase';
import { Loader2, Upload, X } from 'lucide-react';

interface CampaignFormProps {
  campaign?: Campaign;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function CampaignForm({ campaign, onSave, onCancel }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    titleEn: campaign?.titleEn || '',
    titleUr: campaign?.titleUr || '',
    descriptionEn: campaign?.descriptionEn || '',
    descriptionUr: campaign?.descriptionUr || '',
    imageUrl: campaign?.imageUrl || '',
    targetAmount: campaign?.targetAmount || 0,
    collectedAmount: campaign?.collectedAmount || 0,
    easypaisaNumber: campaign?.easypaisaNumber || '0301-0076298',
    easypaisaName: campaign?.easypaisaName || 'Adeel Ahmed Farooqi',
    status: campaign?.status || 'active' as CampaignStatus,
    startDate: campaign?.startDate || new Date().toISOString().split('T')[0],
    endDate: campaign?.endDate || '',
    location: campaign?.location || 'Rawalpindi & Islamabad',
    isFeatured: campaign?.isFeatured || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(campaign?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setUploadProgress(null);
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload JPG or PNG.');
        return;
      }

      // Max size for resizing still applies but we check original size first
      if (file.size > 10 * 1024 * 1024) { // Up to 10MB as we resize client-side
        setError('Image size exceeds 10MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("TRACE: CampaignForm [STEP 1] handleSubmit triggered");
    setError(null);
    setUploadProgress(null);

    if (!imageFile && !formData.imageUrl) {
      console.warn("TRACE: CampaignForm [ABORT] No image selected");
      setError('Please upload a campaign image.');
      return;
    }

    setLoading(true);
    console.log("TRACE: CampaignForm [STEP 2] Loading state active");

    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        console.log("TRACE: CampaignForm [STEP 3] Starting uploadImage call");
        imageUrl = await uploadImage(imageFile, 'campaigns', (progress) => {
          setUploadProgress(Math.round(progress));
        });
        console.log("TRACE: CampaignForm [STEP 4] uploadImage returned:", imageUrl);
      } else {
        console.log("TRACE: CampaignForm [STEP 3b] Using existing image URL");
      }

      console.log('CampaignForm: Image upload step finished. Image URL:', imageUrl);
      console.log("TRACE: CampaignForm [STEP 5] Invoking onSave parent handler");
      await onSave({ ...formData, imageUrl });
      console.log('CampaignForm: onSave successfully returned.');
      console.log("TRACE: CampaignForm [STEP 6] Save process COMPLETE");
    } catch (err: any) {
      console.error('Error saving campaign:', err);
      let errorMsg = 'Failed to save campaign. Please try again.';
      try {
        // Try to parse if it's our JSON error format
        const errorData = JSON.parse(err.message);
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        errorMsg = err.message || errorMsg;
      }
      setError(errorMsg);
      // Re-throw so the parent's handleSave can catch it and keep the loading state consistent
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload */}
      <div className="flex flex-col items-center">
        <label className="text-sm font-bold text-gray-700 mb-2 w-full text-left">Campaign Cover Image</label>
        <div className="relative w-full h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden group">
          {imagePreview ? (
            <>
              <img src={imagePreview || null} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold">
                  Change Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </>
          ) : (
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">Click to upload (Max 2MB)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-2"
          >
            <X className="w-3 h-3" />
            {error}
          </motion.div>
        )}
      </div>

      {/* Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Title (English)</label>
          <input
            type="text"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
            required
            placeholder="Help Support Education"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 text-right">عنوان (اردو)</label>
          <input
            type="text"
            dir="rtl"
            value={formData.titleUr}
            onChange={(e) => setFormData({ ...formData, titleUr: e.target.value })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all font-urdu text-lg"
            required
            placeholder="تعلیم کی مدد کریں"
          />
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Target Amount (PKR)</label>
          <input
            type="number"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Amount Collected (PKR)</label>
          <input
            type="number"
            value={formData.collectedAmount}
            onChange={(e) => setFormData({ ...formData, collectedAmount: Number(e.target.value) })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* EasyPaisa Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">EasyPaisa Number</label>
          <input
            type="text"
            value={formData.easypaisaNumber}
            onChange={(e) => setFormData({ ...formData, easypaisaNumber: e.target.value })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">EasyPaisa Account Name</label>
          <input
            type="text"
            value={formData.easypaisaName}
            onChange={(e) => setFormData({ ...formData, easypaisaName: e.target.value })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description (English)</label>
          <textarea
            rows={4}
            value={formData.descriptionEn}
            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 text-right">تفصیل (اردو)</label>
          <textarea
            rows={4}
            dir="rtl"
            value={formData.descriptionUr}
            onChange={(e) => setFormData({ ...formData, descriptionUr: e.target.value })}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white outline-none transition-all font-urdu text-lg"
            required
          />
        </div>
      </div>

      {/* Features Toggle */}
      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
        <input
          type="checkbox"
          id="featured"
          checked={formData.isFeatured}
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
          className="w-5 h-5 rounded accent-accent"
        />
        <label htmlFor="featured" className="text-sm font-bold text-primary cursor-pointer select-none">
          Show as Featured Campaign on Home Page
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-8 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-8 py-4 rounded-xl bg-accent text-white font-bold hover:bg-accent-dark transition-all shadow-lg shadow-accent/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              {uploadProgress !== null && uploadProgress > 0 ? (
                <span>{uploadProgress < 100 ? `Uploading Image (${uploadProgress}%)` : 'Syncing with Server...'}</span>
              ) : (
                <span>Working...</span>
              )}
            </div>
          ) : 'Save Campaign'}
        </button>
      </div>
    </form>
  );
}
