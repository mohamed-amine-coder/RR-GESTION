import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateProfile = useCallback(async (nextUser) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    const { data: nextProfile } = await supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', nextUser.id)
      .maybeSingle();

    setProfile(nextProfile ?? null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (!isMounted) return;

      const currentUser = currentSession?.user ?? null;
      setSession(currentSession ?? null);
      setUser(currentUser);
      await hydrateProfile(currentUser);
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!isMounted) return;

      const nextUser = nextSession?.user ?? null;
      setSession(nextSession ?? null);
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      await hydrateProfile(nextUser);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, [hydrateProfile]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/modules`,
      },
    });

    if (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  }, []);

  const hasActiveModuleAccess = useCallback(async (moduleId) => {
    if (!user?.id || !moduleId) return false;

    const { data } = await supabase
      .from('user_access')
      .select('id')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .eq('status', 'active')
      .maybeSingle();

    return Boolean(data);
  }, [user?.id]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: profile?.role === 'admin',
    hasActiveModuleAccess,
    signInWithGoogle,
    signOut,
  }), [user, profile, session, loading, hasActiveModuleAccess, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
