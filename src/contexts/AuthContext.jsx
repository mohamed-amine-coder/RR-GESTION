
// import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import LoadingScreen from '../components/common/LoadingScreen';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const hydrateProfile = useCallback(async (nextUser) => {
//     if (!nextUser) {
//       setProfile(null);
//       return;
//     }

//     const { data: nextProfile } = await supabase
//       .from('profiles')
//       .select('id, role, full_name, email')
//       .eq('id', nextUser.id)
//       .maybeSingle();

//     setProfile(nextProfile ?? null);
//   }, []);

//   useEffect(() => {
//     let isMounted = true;

//     const initAuth = async () => {
//       const { data: { session: currentSession } } = await supabase.auth.getSession();

//       if (!isMounted) return;

//       const currentUser = currentSession?.user ?? null;
//       setSession(currentSession ?? null);
//       setUser(currentUser);
//       await hydrateProfile(currentUser);
//       setLoading(false);
//     };

//     initAuth();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
//       if (!isMounted) return;

//       const nextUser = nextSession?.user ?? null;
//       setSession(nextSession ?? null);
//       setUser(nextUser);

//       if (!nextUser) {
//         setProfile(null);
//         setLoading(false);
//         return;
//       }

//       await hydrateProfile(nextUser);
//       setLoading(false);
//     });

//     return () => {
//       isMounted = false;
//       subscription?.unsubscribe?.();
//     };
//   }, [hydrateProfile]);

//   const signInWithGoogle = useCallback(async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         redirectTo: `${window.location.origin}/modules`,
//       },
//     });

//     if (error) {
//       console.error('Error logging in:', error.message);
//       throw error;
//     }
//   }, []);

//   const signOut = useCallback(async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error('Error signing out:', error.message);
//       throw error;
//     }
//   }, []);

//   const hasActiveModuleAccess = useCallback(async (moduleId) => {
//     if (!user?.id || !moduleId) return false;

//     const { data } = await supabase
//       .from('user_access')
//       .select('id')
//       .eq('user_id', user.id)
//       .eq('module_id', moduleId)
//       .eq('status', 'active')
//       .maybeSingle();

//     return Boolean(data);
//   }, [user?.id]);

//   const value = useMemo(() => ({
//     user,
//     profile,
//     session,
//     loading,
//     isAuthenticated: Boolean(user),
//     isAdmin: profile?.role === 'admin',
//     hasActiveModuleAccess,
//     signInWithGoogle,
//     signOut,
//   }), [user, profile, session, loading, hasActiveModuleAccess, signInWithGoogle, signOut]);

//   if (loading) {
//     return <LoadingScreen message="جارٍ تهيئة الحساب..." />;
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }

//   return context;
// }



import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import LoadingScreen from '../components/common/LoadingScreen';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
  if (!userId) {
    setProfile(null);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[Profile fetch error]:', error.message);
      // إذا كان التوكن منتهي أو verification failed، نمسحو الجلسة نهائياً باش نحبسو الـ loop
      if (error.message?.includes('JWT') || error.code === 'PGRST301') {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
      }
      return;
    }

    if (data) {
      setProfile(data);
    }
  } catch (err) {
    console.error('[Unexpected profile error]:', err);
  }
}, []);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error || !initialSession) {
          if (isMounted) setLoading(false);
          return;
        }

        // واش التوكن مسالي؟
        const isExpired = initialSession.expires_at 
          ? initialSession.expires_at <= Math.floor(Date.now() / 1000)
          : false;

        if (isExpired) {
          console.log('[Auth] Token expired on init, refreshing...');
          const { data: refreshed, error: refreshErr } = await supabase.auth.refreshSession();
          
          if (refreshErr || !refreshed?.session) {
            console.warn('[Auth] Refresh failed, signing out clean');
            await supabase.auth.signOut();
            if (isMounted) {
              setSession(null);
              setUser(null);
              setProfile(null);
              setLoading(false);
            }
            return;
          }

          if (isMounted) {
            setSession(refreshed.session);
            setUser(refreshed.session.user);
            await fetchProfile(refreshed.session.user.id);
            setLoading(false);
          }
        } else {
          if (isMounted) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchProfile(initialSession.user.id);
            setLoading(false);
          }
        }
      } catch (e) {
        console.error('[Auth init error]:', e);
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const nextUser = currentSession?.user ?? null;
          setSession(currentSession);
          setUser(nextUser);
          if (nextUser) {
            await fetchProfile(nextUser.id);
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, [fetchProfile]);

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
    if (error) console.error('Error signing out:', error.message);
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  const hasActiveModuleAccess = useCallback(async (moduleId) => {
    if (!user?.id || !moduleId) return false;

    try {
      const { data, error } = await supabase
        .from('user_access')
        .select('id')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return Boolean(data);
    } catch {
      return false;
    }
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

  if (loading) {
    return <LoadingScreen message="جارٍ تهيئة الحساب..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

