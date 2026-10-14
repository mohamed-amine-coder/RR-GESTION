import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Layout, Lock, MessageCircle, Sparkles, TicketCheck, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../components/common/LoadingScreen';

const WHATSAPP_NUMBER = '212647400201';

export default function ModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, hasActiveModuleAccess } = useAuth();

  const [moduleData, setModuleData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      setLoading(true);

      const { data: modData } = await supabase.from('modules').select('*').eq('id', moduleId).single();
      if (modData) setModuleData(modData);

      const { data: chapsData } = await supabase.from('chapters').select('*').eq('module_id', moduleId).order('order_index');
      if (chapsData) setChapters(chapsData);

      if (user?.id) {
        const hasAccess = await hasActiveModuleAccess(moduleId);
        setIsSubscribed(hasAccess);
      }

      setLoading(false);
    };

    if (!moduleId) return;
    fetchModuleDetails();
  }, [moduleId, user?.id, hasActiveModuleAccess]);

  const openPaywall = (chapter) => setSelectedChapter(chapter);
  const closePaywall = () => setSelectedChapter(null);

  const handleWaitlist = () => {
    closePaywall();
    navigate(`/waitlist?offer=single_module&module=${moduleId}`);
  };

  const handleWhatsApp = () => {
    if (!selectedChapter) return;

    const chapterTitle = selectedChapter.title_ar || selectedChapter.title || '';
    const moduleTitle = moduleData?.title || '';
    const message = encodeURIComponent(
      `سلام، بغيت نفتح الفصل "${chapterTitle}" من الموديل "${moduleTitle}". كاينني محتاج معلومات الدفع والتفعيل.`
    );

    closePaywall();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  if (authLoading || loading) {
    return <LoadingScreen message="جاري تحميل الموديل..." />;
  }

  if (!moduleData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FBFBF7]">
        <div className="text-xl font-black text-rose-500">هاد الموديل ماكاينش!</div>
        <Link to="/modules" className="rounded-xl bg-[#0F172A] px-6 py-2 font-bold text-white">
          الرجوع للموديلات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF7] pb-24 text-slate-900 select-none" dir="rtl">
      <section className="relative overflow-hidden bg-[#0F172A] px-4 pb-20 pt-14 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="min-w-[200px] rounded-[2rem] border border-white/10 bg-[#162033]/90 p-6 text-center shadow-2xl md:order-1">
              <span className="mb-1 block text-xs font-bold text-slate-300">ثمن الاشتراك</span>
              <div className="flex items-baseline justify-center gap-1.5" dir="ltr">
                <span className="text-xs font-black text-slate-400">DH</span>
                <span className="text-4xl font-black text-white">{moduleData.price}</span>
              </div>
              <span className="mt-2 block text-[10px] font-black uppercase tracking-widest text-amber-400">
                FULL ACCESS
              </span>
            </div>

            <div className="flex-1 text-center md:order-2 md:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFB800] px-3.5 py-1.5 text-xs font-black text-slate-950">
                <Layout className="h-3.5 w-3.5" />
                <span>{moduleData.semestre}</span>
              </span>

              <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl" dir="ltr">
                {moduleData.title}
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm font-bold leading-relaxed text-slate-300 sm:text-base md:mx-0">
                {moduleData.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-8 max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-around rounded-[1.5rem] border border-slate-200 bg-white p-4 text-xs font-black text-slate-800 shadow-md md:text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>ملخصات ذكية</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-sky-600" />
            <span>{chapters.length} فصول</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-[#FBFBF7] px-6 text-base font-black text-slate-900">فهرس الدروس</span>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-5xl space-y-4 px-4 sm:px-6">
        {chapters.map((ch, idx) => {
          const canAccess = ch.is_free || isSubscribed;
          const isFree = Boolean(ch.is_free);
          const isLocked = !isFree && !isSubscribed;

          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`rounded-[2rem] border p-5 md:p-6 ${
                isFree
                  ? 'border-emerald-300 bg-emerald-50/60 shadow-sm shadow-emerald-100'
                  : isLocked
                    ? 'border-amber-200 bg-amber-50/60 shadow-sm shadow-amber-100'
                    : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="w-full md:w-auto">
                  {canAccess ? (
                    <Link
                      to={`/viewer/${ch.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 md:w-auto"
                    >
                      <span>{isFree ? 'بدا تقرا الدرس دابا ▶' : 'بدا الدرس'}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openPaywall(ch)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] px-6 py-3 text-sm font-black text-slate-950 shadow-md shadow-amber-200/70 transition hover:bg-[#f5ad00] md:w-auto"
                    >
                      <Lock className="h-4 w-4" />
                      <span>افتح الدرس الكامل 🔒</span>
                    </button>
                  )}
                </div>

                <div className="flex w-full flex-1 items-center justify-end gap-4 text-right md:w-auto">
                  <div>
                    <h3 className="text-sm font-black leading-snug text-slate-900 md:text-base">{ch.title_ar}</h3>

                    <div className="mt-1 flex flex-wrap items-center justify-end gap-2">
                      {ch.badge && (
                        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                          {ch.badge}
                        </span>
                      )}

                      {isFree ? (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>🎁 فصل مجاني للتجربة (بلا حساب)</span>
                        </span>
                      ) : !isSubscribed ? (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[11px] font-black text-amber-700">
                          <Lock className="h-3 w-3" />
                          <span>مدفوع</span>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-black ${
                      isFree ? 'bg-emerald-100 text-emerald-700' : isLocked ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {ch.order_index || idx + 1}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {chapters.length === 0 && (
          <p className="py-8 text-center text-base font-bold text-slate-400">باقي ماتزادو الدروس فهاد الموديل.</p>
        )}
      </div>

      <AnimatePresence>
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePaywall}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl"
              dir="rtl"
            >
              <div className="bg-[#0F172A] px-5 py-4 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">فتح الموديل 🔒</p>
                    <h3 className="mt-2 text-xl font-black leading-tight">{selectedChapter.title_ar}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={closePaywall}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black text-slate-500">الموديل</p>
                      <p className="mt-1 text-base font-black text-slate-900">{moduleData?.title}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-100 px-3 py-2 text-right">
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-700">ثمن الاشتراك</p>
                      <p className="text-xl font-black text-slate-900">
                        {moduleData?.price} <span className="text-sm">DH</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-900">ما غتستافدوه عند الفتح؟</h4>
                  <ul className="space-y-2.5 text-sm font-bold text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>جميع فصول الموديل بالسلايدات التفاعلية + كويزات وأفخاخ الامتحانات + الدخول لمجموعة واتساب مغلقة من 8 طلاب كحد أقصى بنات/أولاد للمراجعة والتمارين.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>طريقة الدفع السهلة والآمنة: ما كاينش خلاص أونلاين بالبطاقة! كتخلص غير فـ CashPlus أو تحويل بنكي، وتصور لينا الوصل فالواتساب، وحتى إلا ما عرفتيش تصاوب حساب حنا كنتكلفو ليك بكلشي خطوة بخطوة فالواتساب.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-500"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>تواصل مباشرة بالواتساب</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWaitlist}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-4 py-3 text-sm font-black text-slate-950 shadow-md shadow-amber-200/70 transition hover:bg-[#f5ad00]"
                  >
                    <TicketCheck className="h-4 w-4" />
                    <span>الدخول لصفحة الانتظار</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
