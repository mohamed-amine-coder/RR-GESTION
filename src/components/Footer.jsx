import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-[#FBFBF7] px-4 py-12 select-none" dir="rtl">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-right">
        <div className="space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFB800] text-slate-950 shadow-sm">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              RR <span className="text-[#FFB800]">GESTION</span>
            </span>
          </Link>
          <p className="max-w-sm text-xs font-bold leading-relaxed text-slate-500">
            منصة مخصصة لتبسيط مواد التسيير والاقتصاد للطلبة والمتدربين بالمغرب.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-black text-slate-600">
          <Link to="/" className="transition hover:text-amber-600">الرئيسية</Link>
          <Link to="/modules" className="transition hover:text-amber-600">الموديلات</Link>
          <Link to="/waitlist" className="transition hover:text-amber-600">اشترك عبر واتساب</Link>
        </div>

        <div className="flex flex-col items-center gap-1 text-[11px] font-bold text-slate-400 md:items-end">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            محتوى مطابق لمنهاج OFPPT
          </span>
          <p className="flex items-center gap-1">
            صنع بـ <Heart className="h-3 w-3 fill-current text-rose-500" /> لطلبة التسيير © 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
