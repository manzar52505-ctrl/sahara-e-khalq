import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_EMAILS } from '../../constants';
import { Heart, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      
      if (!email || !ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
        await auth.signOut();
        throw new Error(`Unauthorized access. Your email (${email}) is not in the authorized list.`);
      }

      // Provision admin document for Firestore rules compatibility
      try {
        const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
        const { db } = await import('../../services/firebase');
        await setDoc(doc(db, 'admins', result.user.uid), {
          email: email.toLowerCase(),
          lastLogin: serverTimestamp(),
          role: 'admin'
        }, { merge: true });
        console.log('Admin document provisioned successfully');
      } catch (adminErr) {
        console.warn('Failed to provision admin document:', adminErr);
      }
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Failed to sign in with Google.';
      
      if (err.message?.includes('Unauthorized access')) {
        msg = err.message;
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Login cancelled. Please make sure popups are allowed and try again.';
      } else if (err.code === 'auth/cancelled-by-user') {
        msg = 'Login request was cancelled.';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Network error: Cannot reach Firebase servers. Please refresh and check your internet connection.';
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = `Domain not authorized: ${window.location.hostname}. 
        
Troubleshooting Steps:
1. Verify "https://${window.location.hostname}" is in Firebase Console -> Authentication -> Settings -> Authorized Domains.
2. If using root domain (e.g. example.com), also add the "www" version.
3. Check Google Cloud Console -> APIs & Services -> Credentials. Find the OAuth 2.0 Client ID used by Firebase and ensure "${window.location.origin}" is in "Authorized JavaScript origins".
4. Propagation can take 5-10 minutes. Please try again in a few minutes.`;
      } else if (err.code) {
        msg = `Error (${err.code}): ${err.message || 'An unexpected error occurred.'}`;
      } else {
        msg = err.message || 'An unexpected error occurred.';
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 bg-gradient-to-br from-ivory to-accent/5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
        
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-24 h-24 flex items-center justify-center mb-6 transition-transform duration-500 hover:scale-110">
            <img 
              src="/logo.png" 
              alt="Sahara-e-Khalq Logo" 
              className="w-full h-full object-contain filter drop-shadow-xl rounded-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-16 h-16 bg-accent rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-accent/20 rotate-3">
              <Heart className="w-8 h-8 text-white fill-current" />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mb-2 text-center text-nowrap">
            Sahara-e-Khalq | سہارا خلق
          </h1>
          <p className="text-gray-500 font-medium">Admin Portal Access</p>
        </div>

        <div className="space-y-6">
          <div className="text-center mb-8 px-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Please sign in with an authorized Google account to access the dashboard.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100 mb-6"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-primary font-bold py-5 rounded-2xl shadow-lg border-2 border-gray-100 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-accent text-sm font-bold transition-colors">
            ← Return to Foundation Website
          </a>
          
          <div className="flex items-center gap-2 text-[10px] text-gray-300 font-mono uppercase tracking-widest">
            <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
            Authorized Admins Only
          </div>
        </div>
      </motion.div>
    </div>
  );
}
