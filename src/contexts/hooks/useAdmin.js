// src/hooks/useAdmin.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/SupabaseClient';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch list of admin emails from Supabase
      const { data: admins, error } = await supabase
        .from('admins')
        .select('email');

      if (error) {
        console.error('Failed to fetch admin list:', error.message);
        setLoading(false);
        return;
      }

      const adminEmails = admins.map((a) => a.email);
      setIsAdmin(adminEmails.includes(user.email));
      setLoading(false);
    }

    checkAdmin();
  }, [navigate]);

  return { isAdmin, loading };
}
