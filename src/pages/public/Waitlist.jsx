// import { useState } from 'react';
// import { User, Phone, CheckCircle2, Loader2, Wallet, HandCoins, CircleDollarSign, Sparkles, ArrowLeft } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import { motion, AnimatePresence } from 'framer-motion';

// // Design tokens (light / friendly theme — matches the RR GESTION brand,
// // no heavy dark "official form" feel that makes people hesitate to fill it in)
// const INK = '#211B12';
// const BODY = '#4B4436';
// const CREAM = '#FBF6EA';
// const CARD = '#FFFFFF';
// const HAIRLINE = '#E7DFCB';
// const AMBER = '#C97A19';
// const AMBER_SOFT = '#F5A623';

// const offersList = [
//   {
//     id: 'full_pay',
//     title: 'قادر نخلص الثمن',
//     icon: Wallet
//   },
//   {
//     id: 'wants_discount',
//     title: 'بغيت تخفيض على الثمن',
//     icon: HandCoins
//   },
//   // {
//   //   id: 'cant_afford',
//   //   title: 'ظروفي المادية ماكتسمحش ليا نخلص',
//   //   icon: CircleDollarSign
//   // }
// ];

// export default function Waitlist() {
//   const [selectedOffer, setSelectedOffer] = useState('can_pay');
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [status, setStatus] = useState('idle'); // idle | loading | success
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus('loading');
//     setErrorMessage('');

//     try {
//       const { error } = await supabase
//         .from('waitlist')
//         .insert([
//           {
//             full_name: fullName.trim(),
//             phone: phone.trim(),
//             offer_id: selectedOffer,
//           }
//         ]);

//       if (error) throw error;
//       setStatus('success');
//     } catch (err) {
//       console.error('Error saving to waitlist:', err.message);
//       setErrorMessage(err.message || 'وقع مشكل فالتسجيل، تأكد من الكونيكسيون وعاود جرب.');
//       setStatus('idle');
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 15 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35, ease: 'easeOut' }}
//       className="min-h-[90vh] flex items-center justify-center p-3 sm:p-6 md:p-8 select-none"
//       dir="rtl"
//       style={{ background: CREAM }}
//     >
//       <div className="w-full max-w-5xl">

//         <AnimatePresence mode="wait">
//           {status === 'success' ? (
//             <motion.div
//               key="success-card"
//               initial={{ opacity: 0, scale: 0.94 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.94 }}
//               transition={{ duration: 0.25 }}
//               className="max-w-lg mx-auto p-6 sm:p-10 rounded-[2.5rem] shadow-sm text-center"
//               style={{ background: CARD, border: `1px solid #BFE1CC` }}
//             >
//               <div
//                 className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
//                 style={{ background: '#EEF7F1', color: '#276A45' }}
//               >
//                 <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10 stroke-[2.5]" />
//               </div>

//               <span
//                 className="inline-block px-3 py-1 text-xs font-black rounded-full mb-2"
//                 style={{ background: '#EEF7F1', color: '#276A45' }}
//               >
//                 تقيدتي معنا فالتسجيل المسبق 🟢
//               </span>

//               <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: INK }}>
//                 مرحبا بك يا {fullName}! 🎉
//               </h1>

//               <p className="text-xs sm:text-sm font-bold mb-6 leading-relaxed" style={{ color: BODY }}>
//                 سجلنا عندنا: <span style={{ color: AMBER }} className="font-black">{offersList.find(o => o.id === selectedOffer)?.title}</span>.<br />
//                 غير نفتحو التسجيل، غيوصلك ميساج فواتساب باش تبدا الدروس معانا.
//               </p>

//               <Link
//                 to="/modules"
//                 className="w-full py-3.5 font-black rounded-2xl transition text-xs flex items-center justify-center gap-2"
//                 style={{ background: CREAM, color: INK, border: `1px solid ${HAIRLINE}` }}
//               >
//                 <span>رجع للموديلات</span>
//                 <ArrowLeft className="w-4 h-4" />
//               </Link>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="form-container"
//               initial={{ opacity: 0, scale: 0.98 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col md:flex-row"
//               style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
//             >
//               {/* القسم الأيمن: اختيار الوضعية */}
//               <div
//                 className="md:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col justify-between"
//                 style={{ background: CREAM, borderBottom: `1px solid ${HAIRLINE}` }}
//               >
//                 <div>
//                   <div className="mb-5">
//                     <span
//                       className="text-[11px] font-black px-3 py-1 rounded-full inline-flex items-center gap-1 mb-2.5"
//                       style={{ background: 'rgba(201,122,25,0.10)', color: AMBER }}
//                     >
//                       <Sparkles className="w-3.5 h-3.5" /> حجز بلاصتك من دبا
//                     </span>
//                     <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight" style={{ color: INK }}>
//                       باش توصل لأحسن استفادة 💯
//                     </h1>
//                     <p className="text-xs font-bold mt-1.5" style={{ color: BODY }}>
//                       غير عزل الطريقة لي تناسبك، والباقي علينا.
//                     </p>
//                   </div>

//                   {/* اختيارات سريعة (chip واحد لكل سطر) — بلا وصف طويل، مقاس مضبوط للهاتف */}
//                   <div className="flex flex-col gap-2">
//                     {offersList.map((offer) => {
//                       const isSelected = selectedOffer === offer.id;
//                       const IconComponent = offer.icon;

//                       return (
//                         <button
//                           key={offer.id}
//                           type="button"
//                           onClick={() => setSelectedOffer(offer.id)}
//                           className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full transition-all duration-150 text-right cursor-pointer"
//                           style={
//                             isSelected
//                               ? { background: CARD, border: `2px solid ${AMBER_SOFT}` }
//                               : { background: CARD, border: `1px solid ${HAIRLINE}` }
//                           }
//                         >
//                           <div
//                             className="p-1.5 rounded-full shrink-0"
//                             style={
//                               isSelected
//                                 ? { background: AMBER_SOFT, color: INK }
//                                 : { background: CREAM, color: '#8A8064' }
//                             }
//                           >
//                             <IconComponent className="w-4 h-4" />
//                           </div>

//                           <span className="flex-1 font-black text-xs sm:text-sm leading-snug" style={{ color: INK }}>
//                             {offer.title}
//                           </span>

//                           <div
//                             className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
//                             style={isSelected ? { borderColor: AMBER_SOFT, background: AMBER_SOFT } : { borderColor: HAIRLINE }}
//                           >
//                             {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ background: INK }} />}
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* القسم الأيسر: إدخال المعلومات */}
//               <div className="md:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col justify-center" style={{ background: CARD }}>
//                 <div className="mb-5">
//                   <h2 className="text-xl sm:text-2xl font-black leading-tight" style={{ color: INK }}>
//                     نتواصلو معاك قأقرب وقت 📲
//                   </h2>
//                 </div>

//                 {errorMessage && (
//                   <div
//                     className="p-3 mb-4 rounded-xl text-xs font-bold"
//                     style={{ background: '#FDF1EF', border: '1px solid #F3D3CE', color: '#C4463A' }}
//                   >
//                     ⚠️ {errorMessage}
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-black mb-1.5 mr-1" style={{ color: INK }}>
//                       الاسم ديالك
//                     </label>
//                     <div className="relative flex items-center">
//                       <input
//                         type="text"
//                         required
//                         value={fullName}
//                         onChange={(e) => setFullName(e.target.value)}
//                         placeholder="مثلاً: محمد أمين"
//                         className="w-full pr-11 pl-4 py-3 rounded-2xl outline-none text-sm font-bold transition-all"
//                         style={{ background: CREAM, border: `2px solid ${HAIRLINE}`, color: INK }}
//                         onFocus={(e) => (e.target.style.borderColor = AMBER_SOFT)}
//                         onBlur={(e) => (e.target.style.borderColor = HAIRLINE)}
//                       />
//                       <User className="w-4 h-4 absolute right-3.5 pointer-events-none" style={{ color: '#B8AD8F' }} />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-black mb-1.5 mr-1" style={{ color: INK }}>
//                       رقم الواتساب
//                     </label>
//                     <div className="relative flex items-center">
//                       <input
//                         type="text"
//                         inputMode="numeric"
//                         maxLength={10}
//                         required
//                         value={phone}
//                         onChange={(e) => {
//                           const val = e.target.value.replace(/\D/g, '');
//                           setPhone(val);
//                         }}
//                         placeholder="06 XX XX XX XX"
//                         className="w-full pr-11 pl-4 py-3 rounded-2xl outline-none text-sm font-bold transition-all text-left font-mono"
//                         style={{ background: CREAM, border: `2px solid ${HAIRLINE}`, color: INK }}
//                         dir="ltr"
//                         onFocus={(e) => (e.target.style.borderColor = AMBER_SOFT)}
//                         onBlur={(e) => (e.target.style.borderColor = HAIRLINE)}
//                       />
//                       <Phone className="w-4 h-4 absolute right-3.5 pointer-events-none" style={{ color: '#B8AD8F' }} />
//                     </div>
//                   </div>

//                   <div className="pt-2">
//                     <button
//                       type="submit"
//                       disabled={status === 'loading'}
//                       className="w-full py-3.5 disabled:opacity-50 font-black text-sm rounded-2xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
//                       style={{ background: AMBER_SOFT, color: INK }}
//                     >
//                       {status === 'loading' ? (
//                         <>
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                           <span>جاري التسجيل...</span>
//                         </>
//                       ) : (
//                         <>
//                           <span>علموني فاش يبدا التسجيل</span>
//                           <ArrowLeft className="w-4 h-4" />
//                         </>
//                       )}
//                     </button>
//                     <p className="text-[11px] text-center font-bold mt-2.5" style={{ color: '#8A8064' }}>
//                       💬 كنصيفطو غير ميساج خفيف فواتساب نهار نحلّو التسجيل.
//                     </p>
//                   </div>
//                 </form>
//               </div>

//             </motion.div>
//           )}
//         </AnimatePresence>

//       </div>
//     </motion.div>
//   );
// }






import { useState } from 'react';
import { Wallet, HandCoins, Sparkles, MessageCircle, ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const INK = '#211B12';
const BODY = '#4B4436';
const CREAM = '#FBF6EA';
const CARD = '#FFFFFF';
const HAIRLINE = '#E7DFCB';
const AMBER = '#C97A19';
const AMBER_SOFT = '#F5A623';

const WHATSAPP_NUMBER = '212647400201';

const offersList = [
  {
    id: 'wants_discount',
    title: 'عرض التخفيض المؤقت 🏷️',
    badge: 'كيسالي نهار 15 أو عند اكتمال 100 مشترك',
    icon: HandCoins,
  },
  {
    id: 'full_pay',
    title: 'الاشتراك بالثمن العادي ⚡',
    badge: 'تفعيل مباشر',
    icon: Wallet,
  },
];

export default function Waitlist() {
  const [selectedOffer, setSelectedOffer] = useState('wants_discount');

  const handleOpenWhatsApp = () => {
  const isDiscount = selectedOffer === 'wants_discount';
  const messageText = isDiscount
  ? 'السلام عليكم، باغي نستافد من التخفيض ونشترك فـ RR GESTION، عفاك شحال الثمن وطريقة الخلاص باش يتفتحو ليا الدروس؟ 🏷️'
  : 'السلام عليكم، باغي نشترك بالثمن الأصلي فـ RR GESTION وندعم المنصة، كيفاش ندير نخلص باش يتفتحو ليا الدروس؟ ⚡'
  const message = encodeURIComponent(messageText);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 select-none font-[family-name:var(--font-tajawal)]"
      dir="rtl"
      style={{ background: CREAM }}
    >
      <div className="w-full max-w-xl">
        <div
          className="rounded-[2.5rem] shadow-sm p-6 sm:p-9 text-center flex flex-col items-center"
          style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
        >
          {/* شارة التخفيض والوقت */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-700 border border-amber-300 mb-4">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            {/* <span>عرض التخفيض متاح إلى غاية 15 فهاد الشهر ⏳</span> */}
            <span>ما نخليوش الميزانية عائق: إلا كنتي مزير، درنا ليك تخفيض تضامني خاص حتى لـ 15 فهاد الشهر</span>
          </div>

          {/* العنوان الرئيسي */}
          {/* <h1 className="text-2xl sm:text-3xl font-black mb-2 leading-tight" style={{ color: INK }}>
            تواصل معنا 
          </h1> */}

          <p className="text-xs sm:text-sm font-bold max-w-sm mx-auto mb-6 leading-relaxed" style={{ color: INK }}>
            عزل العرض لي يناسبك وتواصل معانا نجاوبوك على أي تساؤل
          </p>

          {/* الاختيارات */}
          <div className="w-full space-y-3 mb-6">
            {offersList.map((offer) => {
              const isSelected = selectedOffer === offer.id;
              const IconComponent = offer.icon;

              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => setSelectedOffer(offer.id)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-150 cursor-pointer text-right"
                  style={
                    isSelected
                      ? { background: '#FFFDF9', border: `2px solid ${AMBER_SOFT}` }
                      : { background: CREAM, border: `1px solid ${HAIRLINE}` }
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={
                        isSelected
                          ? { background: AMBER_SOFT, color: INK }
                          : { background: '#EDE5D0', color: '#8A8064' }
                      }
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900">{offer.title}</h3>
                      <span className="text-[11px] font-bold text-amber-700">{offer.badge}</span>
                    </div>
                  </div>

                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{
                      borderColor: isSelected ? AMBER_SOFT : HAIRLINE,
                      background: isSelected ? AMBER_SOFT : 'transparent',
                    }}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: INK }} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* زر الواتساب */}
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full py-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>صيفط ميساج فواتساب دابا</span>
          </button>

          {/* الرجوع */}
          {/* <div className="mt-6 pt-4 border-t w-full" style={{ borderColor: HAIRLINE }}>
            <Link
              to="/modules"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition"
            >
              <span>الرجوع لتصفح الموديلات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div> */}
        </div>
      </div>
    </motion.div>
  );
}