import { MessageCircle, ArrowLeft } from 'lucide-react';
import mrRrImg from '../../assets/mr-rr.png';
import msRrImg from '../../assets/ms-rr.png';

const WHATSAPP_NUMBER = '212647400201';

const MESSAGES = [
  {
    character: 'mr',
    uiText: 'بغيت نعرف كتر على طريقة الشرح، واش الميكرو-سلايدات كافيين باش نضبط المصطلحات بالفرنسية ونفهم بالدارجة؟',
    waText: 'السلام عليكم، بغيت نعرف كتر على طريقة الشرح، واش الميكرو-سلايدات كافيين باش نضبط المصطلحات بالفرنسية ونفهم بالدارجة؟'
  },
  {
    character: 'ms',
    uiText: 'واش ممكن الاشتراك فـ موديل واحد، وواش كاين تخفيض إلا خديت كثر من موديل؟',
    waText: 'السلام عليكم، واش ممكن الاشتراك فـ موديل واحد، وواش كاين تخفيض إلا خديت كثر من موديل؟'
  },
  {
    character: 'mr',
    uiText: 'عندي عرض تقديمي (Exposé) واش تقدر المنصة تصاوب ليا ديزاين احترافي؟',
    waText: 'السلام عليكم، عندي عرض تقديمي (Exposé) واش تقدر المنصة تصاوب ليا ديزاين احترافي؟'
  },
  {
    character: 'ms',
    uiText: 'بغيت نلتحق بمجموعات الواتساب المصغرة المجانية (بنات بوحدهم / ولاد بوحدهم) باش نراجع التمارين مع مجموعة ملتزمة.',
    waText: 'السلام عليكم، بغيت نلتحق بمجموعات الواتساب المصغرة المجانية (بنات بوحدهم / ولاد بوحدهم) باش نراجع التمارين مع مجموعة ملتزمة.'
  }
];

export default function Waitlist() {
  const sendToWhatsApp = (text) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 bg-[#FBF6EA] select-none font-[family-name:var(--font-tajawal)]" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* مقدمة الصفحة */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
            ختار السؤال لي فبالك وتواصل معنا فواتساب 💬
          </h1>
        </div>

        {/* قائمة الرسائل */}
        <div className="space-y-3">
          {MESSAGES.map((msg, index) => {
            const isMr = msg.character === 'mr';

            return (
              <button
                key={index}
                type="button"
                onClick={() => sendToWhatsApp(msg.waText)}
                className="w-full bg-white border border-[#E7DFCB] hover:border-amber-400 hover:shadow-md p-4 sm:p-4.5 rounded-2xl transition-all duration-150 flex items-center gap-3.5 text-right cursor-pointer group active:scale-[0.99]"
              >
                {/* صورة الشخصية */}
                <img
                  src={isMr ? mrRrImg : msRrImg}
                  alt="Assistant"
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border-2 shrink-0 ${
                    isMr ? 'border-amber-400 bg-amber-50' : 'border-rose-400 bg-rose-50'
                  }`}
                />

                {/* نص السؤال المباشر */}
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed group-hover:text-slate-950">
                    "{msg.uiText}"
                  </p>
                </div>

                {/* إشارة التوجيه للواتساب */}
                <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-[#22C55E] text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <MessageCircle className="w-4 h-4 fill-current hidden group-hover:block" />
                  <ArrowLeft className="w-4 h-4 group-hover:hidden" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}