import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Loader2, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const WHATSAPP_URL = `https://wa.me/212647400201?text=${encodeURIComponent(
  'السلام عليكم، بغيت نشترك فالموديلات أو ننضم لمجموعات الواتساب (CashPlus) وبغيتكم تعاونوني فالتفعيل.'
)}`;

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
    <div className="min-h-[85vh] bg-[#FBFBF7] flex items-center justify-center px-4 py-8 select-none" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8"
      >
        {/* 1. الهيدر المختصر */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FFB800] flex items-center justify-center text-slate-950 font-black shadow-xs">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900">
              RR <span className="text-[#FFB800]">GESTION</span>
            </span>
          </Link>

          <h1 className="text-2xl font-black text-slate-900 mb-1.5">
            تسجيل الدخول
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            احفظ تقدمك فالمراجعة وافتح دروسك بضغطة وحدة
          </p>
        </div>

        {/* 2. الزر الرئيسي (بارز جداً في الموبايل) */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 px-5 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-lg shadow-slate-900/15 flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          ) : (
            <>
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              </div>
              <span>المتابعة بحساب Google</span>
            </>
          )}
        </button>

        {/* فاصل خفيف */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs font-bold text-slate-400 shrink-0">
            أو بدون حساب
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* 3. الخيارات البديلة بدون تشتيت */}
        <div className="space-y-3">
          {/* خيار التجربة المجانية */}
          <Link
            to="/modules"
            className="w-full py-3 px-4 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-slate-900 font-black text-xs sm:text-sm rounded-2xl transition flex items-center justify-between"
          >
            <span>🎁 جرب الدروس المجانية دابا (بلا تسجيل)</span>
            <ArrowLeft className="w-4 h-4 text-amber-700 shrink-0" />
          </Link>

          {/* خيار الاشتراك والتفعيل عبر واتساب */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-right space-y-2.5">
            <p className="text-xs font-black text-slate-800 leading-relaxed">
              بغيتي تشترك عبر <span className="text-emerald-700">CashPlus</span> أو تدخل لمجموعات الواتساب (8 طلبة) وما عرفتيش تسجل؟
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>تواصل معنا فواتساب ونتكلفو ليك بكلشي</span>
            </a>
          </div>
        </div>

      </motion.div>
    </div>
  );
}