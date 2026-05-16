import React, { useState } from 'react';
import { db, auth, uploadImage } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { Loader2, Database, ShieldCheck, Activity, Cloud } from 'lucide-react';

export default function DiagnosticTools() {
  const [firestoreStatus, setFirestoreStatus] = useState<any>(null);
  const [storageStatus, setStorageStatus] = useState<any>(null);
  const [loading, setLoading] = useState({ firestore: false, storage: false });
  
  // Debug overrides
  const [overrideCloudName, setOverrideCloudName] = useState('');
  const [overridePreset, setOverridePreset] = useState('');

  const testFirestore = async () => {
    console.log("DIAGNOSTIC: Starting Firestore isolated test (STEP 1)");
    setLoading(prev => ({ ...prev, firestore: true }));
    setFirestoreStatus(null);
    
    try {
      console.log("DIAGNOSTIC: Attempting addDoc on 'test_connectivity' (STEP 2)");
      const docRef = await addDoc(collection(db, "test_connectivity"), {
        message: "hello isolation test",
        timestamp: Date.now(),
        user: auth.currentUser?.email || 'anonymous'
      });
      console.log("DIAGNOSTIC: SUCCESS! Doc ID:", docRef.id, "(STEP 3)");
      setFirestoreStatus({ ok: true, id: docRef.id });
    } catch (err: any) {
      console.error("DIAGNOSTIC: FAILED", err);
      setFirestoreStatus({ ok: false, error: err.message, code: err.code });
    } finally {
      setLoading(prev => ({ ...prev, firestore: false }));
    }
  };

  const testImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("DIAGNOSTIC: Starting Cloudinary IMAGE UPLOAD test via Service");
    setLoading(prev => ({ ...prev, storage: true }));
    setStorageStatus(null);

    try {
      // If overrides are present, we still do manual fetch for debugging specific values
      if (overrideCloudName || overridePreset) {
        const cloudName = (overrideCloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
        const uploadPreset = (overridePreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();

        if (!cloudName || !uploadPreset) {
          throw new Error(`Missing config: Cloud=${!!cloudName}, Preset=${!!uploadPreset}`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        console.log(`DIAGNOSTIC: Manual Override POST to ${url}`);
        const response = await fetch(url, { method: 'POST', body: formData });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || "Cloudinary upload failed");
        }
        setStorageStatus({ ok: true, url: data.secure_url });
      } else {
        // Normal test using the shared service
        const url = await uploadImage(file, 'diagnostics');
        setStorageStatus({ ok: true, url });
      }
    } catch (err: any) {
      console.error("DIAGNOSTIC: CLOUDINARY FAIL", err);
      setStorageStatus({ ok: false, error: err.message });
    } finally {
      setLoading(prev => ({ ...prev, storage: false }));
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Cloudinary Migration Diagnostics" />
        
        <main className="p-10 max-w-5xl">
          {/* Build Info */}
          <div className="mb-8 p-4 bg-black text-white rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              <span className="font-bold text-sm text-blue-400">CLOUDINARY MODE ACTIVE</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-blue-200">Build ID: 20260516_CLOUDINARY</span>
              <span className="text-xs font-bold text-blue-400">MIGRATION_V1</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Firestore Test */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Database className="w-6 h-6 text-blue-500" />
                <h3 className="font-bold text-xl uppercase tracking-tighter">Firestore Probe</h3>
              </div>
              <button 
                onClick={testFirestore}
                disabled={loading.firestore}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {loading.firestore ? <Loader2 className="animate-spin w-5 h-5" /> : "PROBE FIRESTORE"}
              </button>
              
              {firestoreStatus && (
                <div className={`mt-6 p-4 rounded-xl text-xs font-mono break-all ${firestoreStatus.ok ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                  {firestoreStatus.ok ? (
                    <div>✅ DOC_ID: {firestoreStatus.id}</div>
                  ) : (
                    <div>❌ ERROR: {firestoreStatus.error}</div>
                  )}
                </div>
              )}
            </div>

            {/* Config Info */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Cloud className="w-6 h-6 text-blue-500" />
                <h3 className="font-bold text-xl uppercase tracking-tighter text-blue-900">Cloudinary Config Probes</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cloud Name</label>
                    <span className="text-[9px] font-mono opacity-40">VITE_CLOUDINARY_CLOUD_NAME</span>
                  </div>
                  <input 
                    type="text"
                    placeholder={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "Enter Cloud Name"}
                    value={overrideCloudName}
                    onChange={(e) => setOverrideCloudName(e.target.value)}
                    className="w-full bg-gray-50 p-3 rounded-xl font-mono text-xs border border-gray-100 focus:border-blue-400 outline-none transition-all mb-1"
                  />
                  {!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && !overrideCloudName && (
                    <span className="text-[9px] text-red-500 font-bold uppercase">Missing Core Value</span>
                  )}
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Preset</label>
                    <span className="text-[9px] font-mono opacity-40">VITE_CLOUDINARY_UPLOAD_PRESET</span>
                  </div>
                  <input 
                    type="text"
                    placeholder={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "Enter Preset Name"}
                    value={overridePreset}
                    onChange={(e) => setOverridePreset(e.target.value)}
                    className="w-full bg-gray-50 p-3 rounded-xl font-mono text-xs border border-gray-100 focus:border-blue-400 outline-none transition-all mb-1"
                  />
                  {!import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET && !overridePreset && (
                    <span className="text-[9px] text-red-500 font-bold uppercase">Missing Core Value</span>
                  )}
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <p className="text-[10px] leading-relaxed text-yellow-800">
                    <b>TIP:</b> Type a value above to <b>override</b> your settings for a quick test. 
                    If both fields are filled, it will use these instead of environment variables.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Storage Test */}
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              <h3 className="font-bold text-2xl uppercase tracking-tighter">Cloudinary Direct Probe</h3>
            </div>
            
            <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[2rem] p-16 hover:border-blue-200 transition-all cursor-pointer relative group bg-gray-50/50">
              <input 
                type="file" 
                onChange={testImageUpload}
                disabled={loading.storage}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept="image/*"
              />
              {loading.storage ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <span className="font-black text-blue-600 uppercase tracking-widest text-sm">Transmitting to Cloud...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Cloud className="w-12 h-12 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <span className="font-black text-lg block text-gray-800 uppercase tracking-tighter">Select Local Asset</span>
                    <span className="text-gray-400 text-sm font-medium italic">Direct unsigned upload via fetch()</span>
                  </div>
                </div>
              )}
            </div>

            {storageStatus && (
              <div className={`mt-10 p-8 rounded-[2rem] text-xs font-mono break-all ${storageStatus.ok ? 'bg-black text-white shadow-2xl' : 'bg-red-50 text-red-700'}`}>
                {storageStatus.ok ? (
                  <div className="flex items-center gap-8">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/10 p-1 flex-shrink-0">
                      <img src={storageStatus.url} alt="Result" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <div className="font-black text-xl uppercase tracking-tighter text-blue-400">UPLOAD_SUCCESSFUL</div>
                      <div className="opacity-60 text-[10px] break-all">{storageStatus.url}</div>
                      <a href={storageStatus.url} target="_blank" rel="noreferrer" className="inline-block bg-white text-black px-6 py-3 rounded-full font-bold text-xs hover:bg-blue-400 transition-colors">TEST CLOUDINARY LINK</a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="font-black text-lg">UPLOAD_FAIL</div>
                    <div className="mt-1">{storageStatus.error}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-[#0a0a0a] text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden mb-8">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mb-48 -mr-48 blur-[80px]" />
            <h4 className="font-serif text-3xl font-bold mb-10 flex items-center gap-3 text-blue-400">
              <Cloud className="w-8 h-8" />
              Cloudinary Setup Guide
            </h4>
            <div className="space-y-6 text-gray-400 max-w-2xl">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-bold mb-1">Create UNSIGNED Upload Preset</p>
                  <p className="text-sm">Go to <b>Settings → Upload → Upload Presets</b>. Create a new preset. CRITICAL: Set <b>Signing Mode</b> to <b>Unsigned</b>. If it is "Signed", your browser uploads will fail with "Upload preset not found".</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-bold mb-1">Update AI Studio Variables</p>
                  <p className="text-sm">Click <b>Settings</b> in the top right menu, then add/verify these keys EXACTLY:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                      <span className="font-mono text-[10px] text-blue-300">VITE_CLOUDINARY_CLOUD_NAME</span>
                      <span className="text-[10px] font-bold text-gray-400">dapoidzbw</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                      <span className="font-mono text-[10px] text-blue-300">VITE_CLOUDINARY_UPLOAD_PRESET</span>
                      <span className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">app_uploads</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-bold mb-1">Common Errors</p>
                  <ul className="text-xs list-disc list-inside space-y-1 opacity-70">
                    <li><b>"Upload preset not found"</b>: Verify the preset name matches exactly and is set to "Unsigned".</li>
                    <li><b>"Unauthorized"</b>: Check your Cloud Name in settings.</li>
                    <li><b>"Empty file"</b>: Ensure you select a valid image file.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Config Trace */}
          <div className="bg-[#0a0a0a] text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mb-48 -mr-48 blur-[80px]" />
            <h4 className="font-serif text-3xl font-bold mb-10 flex items-center gap-3">
              <Activity className="text-blue-400" />
              Runtime Evidence
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 opacity-70">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 block mb-2">Project_ID</label>
                  <p className="font-mono text-sm border-l-2 border-blue-400/30 pl-4">{db.app.options.projectId}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 block mb-2">Active_Cloud_Name</label>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm border-l-2 border-blue-400/30 pl-4">
                      {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ? `[${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}]` : 'EMPTY'}
                    </p>
                    {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME === 'app_uploads' && (
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-bounce">SWAPPED?</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 block mb-2">Identity_UID</label>
                  <p className="font-mono text-sm border-l-2 border-blue-400/30 pl-4 truncate">{auth.currentUser?.uid || 'ANONYMOUS'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 block mb-2">Active_Upload_Preset</label>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm border-l-2 border-blue-400/30 pl-4">
                      {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ? `[${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}]` : 'EMPTY'}
                    </p>
                    {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET === 'dapoidzbw' && (
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-bounce">SWAPPED?</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
