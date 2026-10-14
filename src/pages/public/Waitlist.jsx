import { ArrowLeft, MessageCircle } from 'lucide-react';
import mrRrImg from '../../assets/mr-rr.png';
import msRrImg from '../../assets/ms-rr.png';

const WHATSAPP_NUMBER = '212647400201';

const MESSAGES = [
  {
    character: 'mr',
    uiText: 'بغيت نعرف كتر على طريقة الشرح، واش الميكرو-سلايدات كافيين باش نضبط المصطلحات بالفرنسية ونفهم بالدارجة؟',
    waText: 'السلام عليكم، بغيت نعرف كتر على طريقة الشرح، واش الميكرو-سلايدات كافيين باش نضبط المصطلحات بالفرنسية ونفهم بالدارجة؟',
  },
  {
    character: 'ms',
    uiText: 'واش ممكن الاشتراك فـ موديل واحد، وواش كاين تخفيض إلا خديت كثر من موديل؟',
    waText: 'السلام عليكم، واش ممكن الاشتراك فـ موديل واحد، وواش كاين تخفيض إلا خديت كثر من موديل؟',
  },
  {
    character: 'mr',
    uiText: 'عندي عرض تقديمي (Exposé) واش تقدر المنصة تصاوب ليا ديزاين احترافي؟',
    waText: 'السلام عليكم، عندي عرض تقديمي (Exposé) واش تقدر المنصة تصاوب ليا ديزاين احترافي؟',
  },
  {
    character: 'ms',
    uiText: 'بغيت نلتحق بمجموعات الواتساب المصغرة المجانية (بنات بوحدهم / ولاد بوحدهم) باش نراجع التمارين مع مجموعة ملتزمة.',
    waText: 'السلام عليكم، بغيت نلتحق بمجموعات الواتساب المصغرة المجانية (بنات بوحدهم / ولاد بوحدهم) باش نراجع التمارين مع مجموعة ملتزمة.',
  },
];

const introSteps = [
  'كليكي على السؤال أو العرض لي بغيتي لتحت باش يدوزك ديريكت للواتساب ديالنا.',
  'غادي نعطيوك معلومات الدفع السريعة (CashPlus أو CIH/Attijari).',
  'غير كتصور لينا التوصيل (Reçu) فالواتساب، كنفتحو ليك الدروس وندخلوك لمجموعة المراجعة المصغرة (8 د الناس) فوراً!',
];

export default function Waitlist() {
  const sendToWhatsApp = (text) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[85vh] bg-[#FBFBF7] px-4 py-10 select-none" dir="rtl">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="text-center">
            <p className="inline-flex rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">
              التفعيل السريع
            </p>
            <h1 className="mt-4 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
              صفحة التفعيل السريع والتواصل عبر واتساب
            </h1>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {introSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-right">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700">
                  {index + 1}
                </div>
                <p className="text-sm font-bold leading-relaxed text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          {MESSAGES.map((msg, index) => {
            const isMr = msg.character === 'mr';

            return (
              <button
                key={index}
                type="button"
                onClick={() => sendToWhatsApp(msg.waText)}
                className="group flex w-full items-center gap-3.5 rounded-[1.75rem] border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:border-amber-300 hover:shadow-md md:p-4.5"
              >
                <img
                  src={isMr ? mrRrImg : msRrImg}
                  alt="Assistant"
                  className={`h-12 w-12 shrink-0 rounded-xl border-2 object-cover ${
                    isMr ? 'border-amber-400 bg-amber-50' : 'border-rose-400 bg-rose-50'
                  }`}
                />

                <div className="flex-1">
                  <p className="text-sm font-bold leading-relaxed text-slate-800 group-hover:text-slate-950 sm:text-base">
                    “{msg.uiText}”
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <MessageCircle className="h-4 w-4 fill-current hidden group-hover:block" />
                  <ArrowLeft className="h-4 w-4 group-hover:hidden" />
                </div>
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
}
