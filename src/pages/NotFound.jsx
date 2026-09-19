import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] bg-[#FBFBF7] flex items-center justify-center p-4 select-none" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white border border-slate-200/80 rounded-[2.5rem] shadow-xl p-8 md:p-12 text-center"
      >
        
        {/* أيقونة التلفان */}
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-200 shadow-xs">
          <Compass className="w-10 h-10 stroke-[2] animate-spin-slow" />
        </div>

        {/* كود الخطأ والعنوان الفكاهي */}
        <span className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter block mb-2">
          404
        </span>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 mb-3">
         توضرتي 😅
        </h1>

        <p className="text-slate-500 text-xs md:text-sm font-bold leading-relaxed mb-8">
          هاد الصفحة لي كتقلب عليها يا إما دارت Faillite، ولا دفعات Bilan خاوي، ولا أصلاً ما كايناش فـ RR GESTION!
        </p>

        {/* أزرار الرجوع */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full py-4 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer text-sm"
          >
            <Home className="w-4 h-4" />
            <span>رجع للصفحة الرئيسية</span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-black rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجع منين جيتي</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}