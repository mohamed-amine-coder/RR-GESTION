import { useState } from 'react';
import { User, Phone, CheckCircle2, Loader2, BookOpen, Layers, Sparkles, ArrowLeft, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const offersList = [
  {
    id: 'single_module',
    title: 'موديل واحد فقط (1 Module)',
    desc: 'مادة وحدة باغي تضبطها (Comptabilité ولا Droit...)',
    badge: null,
    icon: BookOpen
  },
  {
    id: 'pack_3_modules',
    title: '3 ديال الموديلات (3 Modules)',
    desc: 'المواد الأساسية لي كتلقى فيهم صعوبة',
    badge: 'الأكثر طلباً ⭐',
    icon: Layers
  },
  {
    id: 'pack_complet',
    title: 'جميع موديلات السداسي (Pack Complet)',
    desc: 'كاع المواد بتمارينهم وسلايداتهم من اللول للخر',
    badge: 'شامل 🔥',
    icon: Sparkles
  }
];

export default function Waitlist() {
  const [selectedOffer, setSelectedOffer] = useState('pack_3_modules');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            full_name: fullName.trim(),
            phone: phone.trim(),
            offer_id: selectedOffer,
          }
        ]);

      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error('Error saving to waitlist:', err.message);
      setErrorMessage(err.message || 'وقع مشكل فالتسجيل، تأكد من الكونيكسيون وعاود جرب.');
      setStatus('idle');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-[90vh] bg-[#FBFBF7] flex items-center justify-center p-3 sm:p-6 md:p-8 select-none" 
      dir="rtl"
    >
      <div className="w-full max-w-5xl">
        
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            /* بطاقة النجاح ملي كيتسجل */
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              className="bg-white border-2 border-emerald-500 max-w-lg mx-auto p-6 sm:p-10 rounded-[2.5rem] shadow-2xl text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10 stroke-[2.5]" />
              </div>
              
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full mb-2">
                تقيدتي معنا بنجاح 🟢
              </span>
              
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                مرحبا بك يا {fullName}! 🎉
              </h1>
              
              <p className="text-xs sm:text-sm font-bold text-slate-600 mb-6 leading-relaxed">
                قيدنا عندك: <span className="text-slate-950 font-black">{offersList.find(o => o.id === selectedOffer)?.title}</span>.<br />
                غير نفتحو التسجيل فالسيت غيوصلك ميساج فواتساب فيه كاع التفاصيل باش تبدا الدروس.
              </p>

              <Link
                to="/modules"
                className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white font-black rounded-2xl transition text-xs flex items-center justify-center gap-2"
              >
                <span>الرجوع للموديلات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            /* الحاوية الرئيسية للتسجيل */
            <motion.div
              key="form-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* القسم الأيمن: اختيار المواد */}
              <div className="md:w-1/2 bg-slate-50/70 p-5 sm:p-8 md:p-10 border-b md:border-b-0 md:border-l border-slate-200/60 flex flex-col justify-between">
                <div>
                  <div className="mb-5">
                    <span className="text-[11px] font-black text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-2.5">
                      <Sparkles className="w-3.5 h-3.5" /> باغي تراجع بذكاء؟
                    </span>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                      شنو هما المواد لي عندك فيهم مشكل؟ 🎯
                    </h1>
                    <p className="text-xs font-bold text-slate-500 mt-1.5">
                      عزل الباقة لي بغيتي باش نوجدو ليك الدروس ديالها مشروحين بالدارجة.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {offersList.map((offer) => {
                      const isSelected = selectedOffer === offer.id;
                      const IconComponent = offer.icon;

                      return (
                        <button
                          key={offer.id}
                          type="button"
                          onClick={() => setSelectedOffer(offer.id)}
                          className={`w-full relative flex items-center p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-150 text-right cursor-pointer ${
                            isSelected
                              ? 'border-[#0F172A] bg-white shadow-md'
                              : 'border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white text-slate-600'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl ml-3 transition-colors shrink-0 ${
                            isSelected
                              ? 'bg-[#0F172A] text-[#FFB800]'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-black text-xs sm:text-sm md:text-base ${
                                isSelected ? 'text-slate-950' : 'text-slate-700'
                              }`}>
                                {offer.title}
                              </span>

                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all mr-2 shrink-0 ${
                                isSelected ? 'border-[#0F172A] bg-[#0F172A]' : 'border-slate-300'
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 mt-0.5 leading-snug">
                              {offer.desc}
                            </p>
                          </div>

                          {offer.badge && (
                            <span className="absolute -top-2.5 left-4 bg-[#FFB800] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                              {offer.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <p className="text-[11px] font-bold text-slate-500">
                    💡 الشرح كامل بالدارجة مع مصطلحات الفرنسية الخاصة بـ OFPPT (TSGE).
                  </p>
                </div>
              </div>

              {/* القسم الأيسر: الفورم */}
              <div className="md:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col justify-center bg-white">
                <div className="mb-5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    فين نتواصلو معاك؟ 📲
                  </h2>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    خلي سميتك ونمرتك باش نرسلو ليك ميساج فاش يطلق الموديل.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 mr-1">
                      السمية ديالك
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثلاً: محمد أمين"
                        className="w-full pr-11 pl-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 mr-1">
                      نمرة الواتساب
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 XX XX XX XX"
                        className="w-full pr-11 pl-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all text-left font-mono"
                        dir="ltr"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#FFB800]" />
                          <span>جاري التسجيل...</span>
                        </>
                      ) : (
                        <>
                          <span>علموني فاش يبدا التسجيل</span>
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center font-bold text-slate-400 mt-2.5">
                      💬 كنصيفطو غير ميساج خفيف فواتساب نهار يبدا التسجيل.
                    </p>
                  </div>
                </form>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}