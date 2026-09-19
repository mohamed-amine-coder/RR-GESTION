import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ message = 'جاري التحميل...', minHeight = 'min-h-screen' }) {
  return (
    <div
      className={`${minHeight} bg-[#FBFBF7] flex items-center justify-center p-4 select-none`}
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200/60 text-[#FFB800]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-slate-500 font-bold text-sm tracking-wide">
          {message}
        </p>
      </motion.div>
    </div>
  );
}