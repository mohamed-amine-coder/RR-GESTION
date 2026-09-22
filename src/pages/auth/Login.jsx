import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, BookOpen, Loader2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/modules`
      }
    });
    
    if (error) {
      console.error('Error logging in:', error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#FBFBF7] flex items-center justify-center p-4 md:p-8 select-none" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200/60"
      >
        {/* الجانب الأيمن: التسويق والثقة */}
        <div className="md:w-5/12 bg-[#0F172A] p-10 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
          
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-xl bg-[#FFB800] flex items-center justify-center text-slate-950 font-black shadow-md">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-black text-xl tracking-tight">
                RR <span className="text-[#FFB800]">GESTION</span>
              </span>
            </Link>

            <h2 className="text-2xl md:text-3xl font-black leading-snug mb-4">
              التكوين المهني <br/>
              <span className="text-amber-400">أسهل وأذكى ⚡</span>
            </h2>
            <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
              سجل دخولك باش تكمل الدروس ديالك، تراجع الملخصات، وتوجد للامتحانات بكل ثقة.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>محتوى مطابق لمنهاج OFPPT</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <span>دروس وتطبيقات عملية</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span>شرح مبسط بالدارجة</span>
              </div>
            </div>
          </div>
        </div>

        {/* الجانب الأيسر: الفورم */}
        <div className="md:w-7/12 p-10 md:p-14 flex flex-col justify-center bg-white relative">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">تسجيل الدخول</h1>
            <p className="text-sm font-bold text-slate-500">استخدم حساب Google للوصول السريع والآمن</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full max-w-sm mx-auto py-3.5 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-black rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>المتابعة باستخدام Google</span>
              </>
            )}
          </button>

          {/* <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-500">
              مازال ما عندكش حساب؟{' '}
              <Link to="/waitlist" className="text-[#0F172A] hover:text-amber-600 transition font-black underline underline-offset-4">
                حجز مقعدك الآن
              </Link>
            </p>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}