// src/contexts/SessionProvider.jsx
import { useEffect, useState } from 'react';
import { supabase } from './lib/SupabaseClient';
import { SessionContext } from './SessionContext';

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Load session once on mount
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Error fetching session:', error);
      setSession(data?.session || null);
    };

    getSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}
