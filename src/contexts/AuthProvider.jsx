// src/contexts/AuthProvider.jsx
import { useEffect, useState } from 'react';
import { supabase } from './lib/SupabaseClient';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    signInWithEmail: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    signUpWithEmail: (email, password) =>
      supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
