import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, Rocket } from 'lucide-react';

export default function ViewerFooter({
  mood,
  msSpeech,
  mrSpeech,
  handleNext,
  handlePrev,
  currentIndex,
  total,
  charAnimate,
  charTransition,
  mrRrImg,
  msRrImg,
}) {
  return (
    <div className="shrink-0 w-full max-w-3xl mx-auto relative z-20">
      <motion.div
        className="hidden sm:block absolute bottom-full right-2 mb-2 pointer-events-none"
        animate={charAnimate[mood]}
        transition={charTransition}
      >
        <img
          src={mrRrImg}
          alt="Mr RR"
          draggable={false}
          className="w-14 md:w-16 h-14 md:h-16 object-cover rounded-2xl border-2 border-amber-300 shadow-lg bg-white"
        />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-full left-2 mb-2 pointer-events-none"
        animate={charAnimate[mood]}
        transition={{ ...charTransition, delay: mood === 'celebrate' ? 0.1 : 0 }}
      >
        <img
          src={msRrImg}
          alt="Ms RR"
          draggable={false}
          className="w-14 md:w-16 h-14 md:h-16 object-cover rounded-2xl border-2 border-rose-300 shadow-lg bg-white"
        />
      </motion.div>

      <AnimatePresence>
        {msSpeech && (
          <motion.div
            key={msSpeech}
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            className="hidden sm:block absolute bottom-[calc(100%+75px)] left-3 z-20 bg-white border-2 border-rose-300 text-rose-700 rounded-xl px-2.5 py-1 text-[10px] font-black shadow-md"
          >
            {msSpeech}
            <span className="absolute -bottom-1 left-3 w-2 h-2 bg-white border-b-2 border-l-2 border-rose-300 rotate-[-45deg]" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mrSpeech && (
          <motion.div
            key={mrSpeech}
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            className="hidden sm:block absolute bottom-[calc(100%+75px)] right-3 z-20 bg-white border-2 border-slate-900 text-slate-900 rounded-xl px-2.5 py-1 text-[10px] font-black shadow-md"
          >
            {mrSpeech}
            <span className="absolute -bottom-1 right-3 w-2 h-2 bg-white border-b-2 border-r-2 border-slate-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="w-full px-3 pt-2 pb-4 flex items-center gap-2 bg-[#FFFDF7]">
        <button
          onClick={handleNext}
          className="flex-1 py-2.5 bg-[#FFB800] hover:bg-[#F0A500] text-slate-950 font-black text-sm rounded-xl shadow-sm transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
        >
          {currentIndex === total - 1 ? (
            <>
              <Trophy className="w-4 h-4" />
              <span>إنهاء الدرس</span>
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              <span>تابع</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-slate-300 disabled:opacity-0 disabled:pointer-events-none text-slate-600 font-black text-sm rounded-xl transition cursor-pointer"
        >
          سابق
        </button>
      </footer>
    </div>
  );
}
