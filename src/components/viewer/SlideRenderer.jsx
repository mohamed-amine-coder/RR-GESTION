import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Headphones,
  Play,
  ArrowLeftRight,
  KeyRound,
  Languages,
} from 'lucide-react';

export default function SlideRenderer({
  current,
  currentIndex,
  quizSubmitted,
  selectedOption,
  setSelectedOption,
  setQuizSubmitted,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}) {
  return (
    <main
      className="flex-1 min-h-0 w-full max-w-3xl mx-auto overflow-y-auto px-3 pt-5 pb-32 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.99 }}
          transition={{ duration: 0.2 }}
          className="w-full relative z-20"
        >
          {/* Intro Slide - Gold */}
          {current.type === 'intro' && (
            <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl p-4 md:p-7 text-center shadow-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#D97706] rounded-full text-[10px] md:text-xs font-black mb-3 border-2 border-[#F59E0B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{current.tag}</span>
              </div>
              <p className="text-black font-black text-[11px] md:text-base leading-relaxed max-w-lg mx-auto">
                {current.contentAr}
              </p>
            </div>
          )}

          {/* Concept Slide - Blue */}
          {current.type === 'concept' && (
            <div className="bg-[#DBEAFE] border-2 border-[#3B82F6] rounded-2xl p-4 md:p-7 text-center shadow-md">
              <div className="flex items-center justify-center gap-2 mb-3 text-[#2563EB]">
                <h3 className="text-xs md:text-lg font-black text-black">
                  {current.title}
                </h3>
                <Lightbulb className="w-4.5 h-4.5" />
              </div>
              <p className="text-black font-bold text-[11px] md:text-sm leading-relaxed mb-4 max-w-lg mx-auto">
                {current.desc}
              </p>
              {current.badges && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {current.badges.map((b, i) => (
                    <span
                      key={i}
                      className="text-[10px] md:text-xs font-black tracking-wider bg-[#3B82F6] text-white border-2 border-[#2563EB] px-3 py-1 rounded-lg"
                      dir="ltr"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comparison Slide - Blue & Gold */}
          {current.type === 'comparison' && (
            <div className="bg-white border-2 border-slate-300 rounded-2xl overflow-hidden shadow-md">
              <div className="grid grid-cols-2 relative text-center font-black text-[10px] md:text-sm">
                <div className={`p-3 bg-[#3B82F6] text-white border-b-2 border-slate-300`}>
                  {current.left.title}
                </div>
                <div className={`p-3 bg-[#F59E0B] text-black border-b-2 border-slate-300`}>
                  {current.right.title}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-black w-6 h-6 rounded-full border-2 border-white flex items-center justify-center z-10">
                  VS
                </div>
              </div>
              <div className="grid grid-cols-2 p-4 md:p-5 gap-3 text-[10px] md:text-xs font-bold text-black">
                <ul className="space-y-3 text-center pr-2 border-l-2 border-slate-100">
                  {current.left.items.map((item, idx) => (
                    <li key={idx} className="flex flex-col items-center justify-center gap-1">
                      <span className={`w-2 h-2 rounded-full bg-[#3B82F6] shrink-0`} />
                      <span dir="auto">{item}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3 text-center pl-2">
                  {current.right.items.map((item, idx) => (
                    <li key={idx} className="flex flex-col items-center justify-center gap-1">
                      <span className={`w-2 h-2 rounded-full bg-[#F59E0B] shrink-0`} />
                      <span dir="auto">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Dictionary Slide - Green */}
          {current.type === 'dictionary' && (
            <div className="bg-[#DCFCE7] border-2 border-[#22C55E] rounded-2xl p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-center gap-2 text-[#16A34A] mb-4 border-b-2 border-[#86EFAC] pb-3">
                <div className="p-1.5 bg-white rounded-md text-[#16A34A] border-2 border-[#22C55E]">
                  <Languages className="w-4 h-4" />
                </div>
                <KeyRound className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[11px] md:text-sm font-black text-black">{current.tag}</span>
              </div>
              <div className="divide-y-2 divide-[#86EFAC]">
                {current.terms.map((t, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-center px-2 gap-3">
                    <span dir="auto" className="font-black text-[#15803D] text-[11px] md:text-base text-center flex-1">
                      {t.ar}
                    </span>
                    <ArrowLeftRight className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span dir="ltr" className="font-extrabold text-black text-[11px] md:text-base text-center flex-1">
                      {t.fr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trap Slide - Red */}
          {current.type === 'trap' && (
            <div className="bg-[#FEE2E2] border-2 border-[#EF4444] rounded-2xl p-5 md:p-7 text-center shadow-md">
              <div className="inline-flex items-center gap-1.5 text-white bg-[#EF4444] px-3 py-1 rounded-full font-black text-[10px] md:text-xs mb-3 shadow-sm border-2 border-[#B91C1C]">
                <AlertTriangle className="w-4 h-4" />
                <span>{current.tag}</span>
              </div>
              <p dir="auto" className="text-black font-black text-[11px] md:text-base leading-relaxed max-w-lg mx-auto">
                {current.text}
              </p>
            </div>
          )}

          {/* Quiz Slide - Interactive Colors */}
          {current.type === 'quiz' && (
            <div className="bg-white border-2 border-[#3B82F6] rounded-2xl p-4 md:p-6 shadow-md text-center">
              <h3 dir="auto" className="text-[11px] md:text-base font-black text-black mb-4 leading-relaxed">
                {current.question}
              </h3>

              <div className="space-y-3 mb-4 max-w-md mx-auto">
                {current.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = current.correct === i;
                  let style = 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-black';

                  if (quizSubmitted) {
                    if (isCorrect)
                      style = 'border-[#22C55E] bg-[#DCFCE7] text-black ring-2 ring-[#22C55E]';
                    else if (isSelected)
                      style = 'border-[#EF4444] bg-[#FEE2E2] text-black ring-2 ring-[#EF4444]';
                  } else if (isSelected) {
                    style = 'border-[#3B82F6] bg-[#DBEAFE] text-black ring-2 ring-[#3B82F6]';
                  }

                  return (
                    <button
                      key={i}
                      disabled={quizSubmitted}
                      onClick={() => setSelectedOption(i)}
                      className={`w-full p-3 rounded-xl border-2 font-bold text-[10px] md:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer ${style}`}
                      dir="rtl"
                    >
                      <span dir="auto" className="flex-1 text-center leading-snug">
                        {opt}
                      </span>
                      {quizSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                      )}
                      {quizSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-[#DC2626] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={selectedOption === null}
                  className="w-full max-w-md mx-auto py-3 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:bg-slate-400 text-white font-black text-[11px] md:text-sm rounded-xl transition cursor-pointer shadow-md"
                >
                  تحقق
                </button>
              ) : selectedOption === current.correct ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto p-3 bg-[#DCFCE7] border-2 border-[#22C55E] rounded-xl text-[10px] md:text-xs font-black text-black text-center flex items-center gap-2 justify-center shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <span dir="auto">{current.explanation}</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto p-3 bg-[#FEE2E2] border-2 border-[#EF4444] rounded-xl text-[10px] md:text-xs font-bold text-black text-center flex items-start gap-2 justify-center shadow-sm"
                >
                  <XCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                  <div className="flex-1 text-center">
                    <div dir="auto" className="mb-1 font-black">
                      الجواب اللي ختاريتيه ماشي هو الصحيح.
                    </div>
                    <div className="text-black font-bold" dir="auto">
                      💡 {current.explanation}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Table Slide - Gold (Based directly on slide_07.png) */}
          {current.type === 'table' && (
            <div className="w-full text-center">
              {(current.title || current.tag) && (
                <div className="mb-4 flex flex-col items-center justify-center gap-2">
                  {current.tag && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#D97706] rounded-lg text-[10px] font-black border-2 border-[#F59E0B]">
                      <span>{current.tag}</span>
                    </div>
                  )}
                  {current.title && (
                    <h3 className="text-sm md:text-xl font-black text-black mb-2 flex items-center justify-center gap-2">
                      {current.title}
                    </h3>
                  )}
                </div>
              )}
              <div className="overflow-x-auto rounded-xl border-2 border-[#F59E0B] shadow-md bg-white">
                <table className="w-full text-center text-[10px] md:text-sm">
                  <thead className="bg-[#F59E0B] text-black font-black">
                    <tr>
                      {current.headers?.map((h, i) => (
                        <th key={i} className="p-3 border-x border-[#D97706]/40 first:border-l-0 last:border-r-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100 bg-white">
                    {current.rows?.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        {row.map((cell, j) => (
                          <td key={j} className="p-3 font-bold text-black border-x-2 border-slate-100 first:border-l-0 last:border-r-0" dir="auto">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audio Slide - Indigo / Blue */}
          {current.type === 'audio' && (
            <div className="bg-[#E0E7FF] border-2 border-[#6366F1] rounded-2xl p-5 md:p-7 text-center shadow-md">
              <div className="inline-flex items-center gap-1.5 text-white bg-[#6366F1] px-3 py-1 rounded-full font-black text-[10px] md:text-xs mb-4 shadow-sm border-2 border-[#4F46E5]">
                <Headphones className="w-4 h-4" />
                <span>{current.tag}</span>
              </div>
              <div className="bg-white border-2 border-[#818CF8] p-3 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 shadow-sm">
                <button className="w-10 h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full flex items-center justify-center shadow-md transition cursor-pointer shrink-0">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
                <div className="text-center flex-1">
                  <h4 dir="auto" className="font-black text-black text-[11px] md:text-sm">
                    {current.title}
                  </h4>
                  <span className="text-[10px] font-black text-[#4F46E5]" dir="ltr">
                    {current.duration}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}