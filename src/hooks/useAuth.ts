import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { ADMIN_EMAILS } from '../constants';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

  return { user, loading, isAdmin };
}
