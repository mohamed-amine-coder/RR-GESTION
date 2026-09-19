import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, GraduationCap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error logging in:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FBFBF7] flex items-center justify-center px-4 py-12 select-none" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-white border border-slate-200/80 rounded-[2.5rem] shadow-xl overflow-hidden"
      >
        <div className="bg-[#0F172A] p-8 text-center text-white relative overflow-hidden">
          <div className="w-16 h-16 bg-[#FFB800] text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-1">
            RR <span className="text-[#FFB800]">GESTION</span>
          </h1>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 mb-2">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Dkhoul l platform</h2>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white border-2 border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-900 font-black rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {/* SVG dyal Google */}
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>Kmel b Google</span>
              </>
            )}
          </button>

          <div className="text-center mt-6 pt-6 border-t border-slate-100 space-y-2">
            <p className="text-xs font-bold text-slate-400">
              Mazal ma3ndkch compte?{' '}
              <Link to="/waitlist" className="text-slate-900 hover:text-amber-600 transition font-black underline">
                Qyed blastek hna
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}