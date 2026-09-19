import { Link } from 'react-router-dom';
import { Zap, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-12 px-4 select-none" dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
        
        {/* اللوجو والوصف */}
        <div className="space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFB800] flex items-center justify-center text-slate-950 font-black shadow-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900">
              RR <span className="text-[#FFB800]">GESTION</span>
            </span>
          </Link>
          <p className="text-xs font-bold text-slate-500 max-w-sm">
            منصة مخصصة لتبسيط مواد التسيير والاقتصاد للطلبة والمتدربين بالمغرب.
          </p>
        </div>

        {/* روابط سريعة */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-black text-slate-600">
          <Link to="/" className="hover:text-amber-600 transition">الرئيسية</Link>
          <Link to="/modules" className="hover:text-amber-600 transition">الموديلات</Link>
          <Link to="/viewer" className="hover:text-amber-600 transition">درس تجريبي</Link>
          <Link to="/waitlist" className="hover:text-amber-600 transition">حجز مقعد</Link>
          <Link to="/login" className="hover:text-amber-600 transition">تسجيل الدخول</Link>
        </div>

        {/* حقوق الملكية وضمان المحتوى */}
        <div className="flex flex-col items-center md:items-end gap-1 text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            محتوى مطابق لمنهاج OFPPT
          </span>
          <p className="flex items-center gap-1">
            صنع بـ <Heart className="w-3 h-3 text-rose-500 fill-current" /> لطلبة التسيير © 2026
          </p>
        </div>

      </div>
    </footer>
  );
}