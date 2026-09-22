import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export default function ViewerHeader({ moduleId, progressPercentage, currentIndex, total }) {
  return (
    <header className="shrink-0 w-full bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
        <Link
          to={moduleId ? `/module/${moduleId}` : '/modules'}
          className="bg-[#0F172A] hover:bg-slate-800 text-white text-[11px] font-black px-2.5 py-1 rounded-lg transition"
        >
          خروج
        </Link>

        <div className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-slate-800 text-[11px] font-black px-2.5 py-1 rounded-lg">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>خوذ وقتك فكل سلايد.</span>
        </div>

        <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
          <span>RR GESTION</span>
          <span className="w-5 h-5 bg-[#FFB800] rounded-md flex items-center justify-center text-slate-900 text-[10px]">
            ⚡
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 pb-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-[#22C55E] to-[#16A34A] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
        <span className="text-[10px] font-black text-slate-500 tabular-nums">
          {currentIndex + 1}/{total}
        </span>
        <Link
          to={moduleId ? `/module/${moduleId}` : '/modules'}
          className="text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
      </div>
    </header>
  );
}
