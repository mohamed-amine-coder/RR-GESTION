import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import rrTeamImg from '../../assets/rr-team.png';

export default function CelebrationModal({ isCompleted, handleReturn, handleRepeat }) {
  return (
    <AnimatePresence>
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="bg-white rounded-3xl p-6 md:p-7 max-w-sm w-full shadow-2xl border-2 border-amber-400 flex flex-col items-center text-center"
          >
            <div className="relative mb-3">
              <img
                src={rrTeamImg}
                alt="RR Team"
                className="w-24 h-auto object-cover rounded-2xl border-2 border-amber-200 shadow-sm"
              />
              <motion.span
                className="absolute -top-2 -right-2 text-xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                🏆
              </motion.span>
            </div>

            <h2 className="text-lg font-black text-slate-900 mb-1">ماعلكش يا بطل!</h2>
            <p className="text-slate-500 font-bold text-xs mb-5 leading-relaxed">
              سالييتي هاد الفصل بنجاح
            </p>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                onClick={handleReturn}
                className="flex-1 py-2.5 bg-[#FFB800] hover:bg-[#F0A500] text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>الدرس الجاي</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRepeat}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>تكرار الدرس</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
