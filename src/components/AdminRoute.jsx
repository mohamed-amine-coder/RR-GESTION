import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile && profile.role === 'admin') {
        setIsAdmin(true);
      }
      setLoading(false);
    };
    
    checkAdmin();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Kaytchargé...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}