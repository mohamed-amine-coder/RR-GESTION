import { useState } from 'react';
import { User, Phone, CheckCircle2, Loader2, GraduationCap, Briefcase, Award, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const offersList = [
  {
    id: 'first_year',
    title: 'السنة الأولى (1ère Année TSGE)',
    desc: 'دروس، تمارين ومصطلحات السداسي الأول والثاني بالدارجة',
    badge: 'الأكثر إقبالاً ⭐',
    icon: GraduationCap
  },
  {
    id: 'second_year',
    title: 'السنة الثانية (2ème Année TSGE)',
    desc: 'التحضير للامتحانات والـ Synthèse والمواد المتخصصة',
    badge: 'مهم 🔥',
    icon: Award
  },
  {
    id: 'other_formation',
    title: 'مساعد إداري أو تكوين آخر',
    desc: 'برامج ومستويات أخرى تابعة لـ OFPPT',
    badge: null,
    icon: Briefcase
  }
];

export default function Waitlist() {
  const [selectedOffer, setSelectedOffer] = useState('first_year');
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
      className="min-h-[90vh] flex items-center justify-center p-3 sm:p-6 md:p-8 select-none" 
      dir="rtl"
    >
      <div className="w-full max-w-5xl">
        
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0F172A] border-2 border-emerald-500/50 max-w-lg mx-auto p-6 sm:p-10 rounded-[2.5rem] shadow-2xl text-center text-slate-100"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10 stroke-[2.5]" />
              </div>
              
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-full mb-2 border border-emerald-500/20">
                تقيدتي معنا فالتسجيل المسبق 🟢
              </span>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                مرحبا بك يا {fullName}! 🎉
              </h1>
              
              <p className="text-xs sm:text-sm font-bold text-slate-300 mb-6 leading-relaxed">
                سجلنا عندنا: <span className="text-[#FFB800] font-black">{offersList.find(o => o.id === selectedOffer)?.title}</span>.<br />
                غير نفتحو التسجيل، غيوصلك ميساج فواتساب باش تبدا الدروس معانا.
              </p>

              <Link
                to="/modules"
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition text-xs flex items-center justify-center gap-2 border border-slate-700"
              >
                <span>رجع للموديلات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0F172A] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row text-slate-100"
            >
              {/* القسم الأيمن: اختيار المستوى */}
              <div className="md:w-1/2 bg-[#0B1120] p-5 sm:p-8 md:p-10 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="mb-5">
                    <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-2.5">
                      <Sparkles className="w-3.5 h-3.5" /> حجز بلاصتك من دبا
                    </span>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                      فأي مستوى كتقرا دابا؟ 🎓
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1.5">
                      عزل مستواك الدراسي باش نوجدو ليك الدروس والملخصات لي غاتفعك.
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
                              ? 'border-[#FFB800] bg-slate-900 shadow-md'
                              : 'border-slate-800 bg-[#0F172A]/50 hover:border-slate-700 hover:bg-[#0F172A] text-slate-400'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl ml-3 transition-colors shrink-0 ${
                            isSelected
                              ? 'bg-[#FFB800] text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-black text-xs sm:text-sm md:text-base ${
                                isSelected ? 'text-white' : 'text-slate-300'
                              }`}>
                                {offer.title}
                              </span>

                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all mr-2 shrink-0 ${
                                isSelected ? 'border-[#FFB800] bg-[#FFB800]' : 'border-slate-700'
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
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

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400">
                    💡 الشرح كامل بالدارجة وبالمصطلحات المهنية (TSGE).
                  </p>
                </div>
              </div>

              {/* القسم الأيسر: إدخال المعلومات */}
              <div className="md:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col justify-center bg-[#0F172A]">
                <div className="mb-5">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                   نتواصلو معاك قأقرب وقت 📲
                  </h2>
                </div>

                {errorMessage && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1.5 mr-1">
                      الاسم ديالك
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثلاً: محمد أمين"
                        className="w-full pr-11 pl-4 py-3 bg-slate-900 border-2 border-slate-800 focus:border-[#FFB800] focus:bg-slate-950 rounded-2xl outline-none text-sm font-bold text-white transition-all placeholder:text-slate-600"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute right-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1.5 mr-1">
                      رقم الواتساب
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 XX XX XX XX"
                        className="w-full pr-11 pl-4 py-3 bg-slate-900 border-2 border-slate-800 focus:border-[#FFB800] focus:bg-slate-950 rounded-2xl outline-none text-sm font-bold text-white transition-all text-left font-mono placeholder:text-slate-600"
                        dir="ltr"
                      />
                      <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3.5 bg-[#FFB800] hover:bg-[#e0a200] disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>جاري التسجيل...</span>
                        </>
                      ) : (
                        <>
                          <span>علموني فاش يبدا التسجيل</span>
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center font-bold text-slate-500 mt-2.5">
                      💬 كنصيفطو غير ميساج خفيف فواتساب نهار نحلّو التسجيل.
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