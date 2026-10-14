import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageCircle, RotateCcw } from 'lucide-react';
import rrTeamImg from '../../assets/rr-team.png';

const whatsappUrl = `https://wa.me/212647400201?text=${encodeURIComponent(
  'السلام عليكم، ساليت الدرس التجريبي وعجبني الشرح، بغيت نفتح باقي الدروس وننضم لمجموعة الواتساب'
)}`;

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
            className="bg-white rounded-[28px] p-5 md:p-6 max-w-md w-full shadow-[0_25px_80px_rgba(15,23,42,0.25)] border border-emerald-200 flex flex-col items-center text-center"
          >
            <div className="relative mb-4">
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

            <h2 className="text-xl font-black text-slate-900 leading-snug">
              ما عليكش يا بطل! ساليتي هاد الفصل بنجاح 🏆
            </h2>

            <div className="w-full mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-right shadow-sm">
              <p className="text-sm font-black text-emerald-900 mb-3">
                عجبك الشرح؟ كمّل الموديل كامل بلا تشتت! 🚀
              </p>
              <ul className="space-y-2 text-right text-xs font-bold text-emerald-950/85 leading-relaxed">
                <li>• فتح جميع فصول الموديل + أفخاخ الامتحانات (EFM/EFF).</li>
                <li>• انضمام لمجموعة واتساب مغلقة (8 طلبة كحد أقصى - بنات بوحدهم / ولاد بوحدهم) لمناقشة التمارين والملخصات.</li>
                <li>• خلاص ساهل وآمن عبر CashPlus (تصور غير التوصيل فالواتساب ويتفعل حسابك فالبلاصة).</li>
              </ul>
            </div>

            <div className="w-full mt-5 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>افتح باقي الدروس عبر واتساب 💬</span>
                <MessageCircle className="w-4 h-4" />
              </a>

              <div className="flex gap-2">
                <button
                  onClick={handleReturn}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>رجوع لفهرس الدروس</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleRepeat}
                  className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>إعادة الدرس</span>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
