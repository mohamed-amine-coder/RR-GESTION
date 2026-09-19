import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

export default function LoadingScreen({ message = 'جارٍ التحميل...', minHeight = 'min-h-screen' }) {
  return (
    <div
      className={`${minHeight} bg-[#FBFBF7] flex items-center justify-center px-6 select-none`}
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-[#FFB800] shadow-lg shadow-amber-200/70">
          <LoaderCircle className="h-8 w-8 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-lg font-black tracking-tight text-slate-800">{message}</p>
          <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#FFB800]"
              initial={{ x: '-100%' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
