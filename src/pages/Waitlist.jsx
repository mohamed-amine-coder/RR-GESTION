import { useState } from 'react';
import { User, Phone, CheckCircle2, Loader2, BookOpen, Package, Layers, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const offersList = [
  {
    id: 'pack_complet',
    title: 'باقة S1 كاملة (Pack Complet)',
    desc: 'جميع الموديلات الـ 6 بتمارينها وسلايداتها',
    badge: 'الأكثر طلباً 🔥',
    icon: Package
  },
  {
    id: 'pack_besties',
    title: 'عرض الرفاق (Besties)',
    desc: 'اشتراك لـ 3 ديال الطلبة مع تخفيض 20 DH للواحد',
    badge: 'توفير جماعي ✨',
    icon: Layers
  },
  {
    id: 'single_module',
    title: 'موديل واحد فقط',
    desc: 'اختيار مادة معينة (Comptabilité أو Droit...)',
    badge: null,
    icon: BookOpen
  }
];

export default function Waitlist() {
  const [selectedOffer, setSelectedOffer] = useState('pack_complet');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus('loading');

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
    alert('وقع خطأ أثناء حفظ البيانات، عاود المحاولة.');
    setStatus('idle');
  }
};

  const handleWhatsAppRedirect = () => {
    const offerLabel = offersList.find(o => o.id === selectedOffer)?.title;
    const msg = encodeURIComponent(`السلام عليكم، أنا ${fullName}، بغيت ناكد تسجيلي فلائحة انتظار RR GESTION بالنسبة لـ: ${offerLabel}`);
    window.open(`https://wa.me/212600000000?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-[90vh] bg-[#FBFBF7] flex items-center justify-center p-4 md:p-8 select-none" dir="rtl">
      <div className="w-full max-w-5xl">
        
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            /* نافذة تأكيد النجاح */
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200/80 max-w-lg mx-auto p-8 md:p-12 rounded-[2.5rem] shadow-xl text-center"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-xs">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                تم حجز مقعدك بنجاح! 🎉
              </h2>
              <p className="text-sm font-bold text-slate-500 mb-2">
                مرحباً بك معنا يا <span className="text-slate-900 font-black">{fullName}</span>.
              </p>
              <p className="text-xs font-bold text-slate-400 mb-8 leading-relaxed">
                ختارتي: <strong className="text-slate-800">{offersList.find(o => o.id === selectedOffer)?.title}</strong>. غادي نتواصلو معاك فالواتساب أول ما يفتح التسجيل الرسمي للدفعة.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-4 bg-[#22C55E] hover:bg-[#16a34a] text-white font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد الحجز فوراً عبر واتساب</span>
                </button>
                <Link
                  to="/modules"
                  className="block w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition text-xs"
                >
                  الرجوع لقائمة الموديلات
                </Link>
              </div>
            </motion.div>
          ) : (
            /* الحاوية المزدوجة: مرحلة 1 + مرحلة 2 */
            <motion.div
              key="form-container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* القسم 1: اختيار الباقة */}
              <div className="md:w-1/2 bg-slate-50/70 p-6 md:p-10 border-b md:border-b-0 md:border-l border-slate-200/60 flex flex-col justify-between">
                <div>
                  <div className="mb-6">
                    <span className="text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                      المرحلة 1 من 2
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                      شنو هو العرض لي باغي تستافد منو؟ 🎯
                    </h2>
                    <p className="text-xs font-bold text-slate-500 mt-2">
                      حدد باقتك المفضلة باش نوجدو ليك حسابك بالشكل المناسب.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {offersList.map((offer) => {
                      const isSelected = selectedOffer === offer.id;
                      const IconComponent = offer.icon;

                      return (
                        <button
                          key={offer.id}
                          type="button"
                          onClick={() => setSelectedOffer(offer.id)}
                          className={`w-full relative flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-right cursor-pointer ${
                            isSelected
                              ? 'border-[#0F172A] bg-white shadow-md scale-[1.01]'
                              : 'border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white text-slate-600'
                          }`}
                        >
                          {/* أيقونة العرض */}
                          <div className={`p-3 rounded-xl ml-3 transition-colors ${
                            isSelected
                              ? 'bg-[#0F172A] text-[#FFB800]'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>

                          {/* نصوص الباقة */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-black text-sm md:text-base ${
                                isSelected ? 'text-slate-900' : 'text-slate-700'
                              }`}>
                                {offer.title}
                              </span>

                              {/* مؤشر الاختيار الدائري */}
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mr-2 ${
                                isSelected ? 'border-[#0F172A] bg-[#0F172A]' : 'border-slate-300'
                              }`}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </div>
                            <p className="text-xs font-bold text-slate-400 mt-0.5">
                              {offer.desc}
                            </p>
                          </div>

                          {/* الشارة الإضافية إن وجدت */}
                          {offer.badge && (
                            <span className="absolute -top-2.5 left-4 bg-[#FFB800] text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              {offer.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/60 hidden md:block">
                  <p className="text-[11px] font-bold text-slate-400">
                    🔒 حجز المقعد مجاني 100% ولا يتطلب أداء أي رسوم حالياً.
                  </p>
                </div>
              </div>

              {/* القسم 2: إدخال معلومات الطالب */}
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white">
                <div className="mb-6">
                  <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                    المرحلة 2 من 2
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    معلومات التواصل معك 🚀
                  </h2>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    عمر معلوماتك باش نصيفطو ليك إشعار فتح التسجيل فالواتساب.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* الاسم الكامل */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 mr-1">
                      الاسم الكامل
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثلاً: محمد أمين"
                        className="w-full pr-11 pl-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all"
                      />
                      <User className="w-5 h-5 text-slate-400 absolute right-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* رقم الواتساب */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 mr-1">
                      رقم الواتساب
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 XX XX XX XX"
                        className="w-full pr-11 pl-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all text-left font-mono"
                        dir="ltr"
                      />
                      <Phone className="w-5 h-5 text-slate-400 absolute right-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* زر التأكيد السفلي العريض */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm md:text-base rounded-2xl transition shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-[#FFB800]" />
                          <span>جاري تأكيد الحجز...</span>
                        </>
                      ) : (
                        <>
                          <span>تأكيد حجز المقعد الآن</span>
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center font-bold text-slate-400 mt-3 md:hidden">
                      🔒 الحجز مجاني بالكامل بدون دفع مسبق.
                    </p>
                  </div>
                </form>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}