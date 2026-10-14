import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BellRing, Flame, Layers, MessageCircle, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import rrTeamImg from '../../assets/rr-team.png';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemestre, setSelectedSemestre] = useState('S1');

  useEffect(() => {
    const fetchModules = async () => {
      const { data } = await supabase.from('modules').select('*').order('order_index');
      if (data) setModules(data);
      setLoading(false);
    };

    fetchModules();
  }, []);

  const filteredModules = selectedSemestre === 'ALL' ? modules : modules.filter((m) => m.semestre === selectedSemestre);

  const counts = {
    S1: modules.filter((m) => m.semestre === 'S1').length,
    S2: modules.filter((m) => m.semestre === 'S2').length,
    EGTS: modules.filter((m) => m.semestre === 'EGTS').length,
    ALL: modules.length,
  };

  if (loading) {
    return <LoadingScreen message="المرجو الانتظار..." />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-slate-900 select-none pb-24" dir="rtl">
      <section className="relative overflow-hidden bg-[#0F172A] py-10 md:py-14">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/10" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex-1 text-center md:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] font-black text-amber-300">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>منصة التكوين الاحترافي</span>
              </div>

              <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
                استكشف جميع الموديلات الدراسية
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm font-bold leading-relaxed text-slate-300 md:mx-0 sm:text-base">
                اختر الفصل المناسب لك وابدأ رحلتك بخطوات واضحة ومحتوى عملي ومدروس بالدارجة والفرنسية.
              </p>
            </div>

            <div className="hidden shrink-0 md:block">
              <img src={rrTeamImg} alt="RR Team" className="h-auto w-28 rounded-2xl border border-white/10 shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-4 z-40 mx-auto max-w-5xl px-4 sm:px-6 -mt-6">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950/95 p-3 text-white shadow-2xl shadow-slate-950/20 backdrop-blur-xl md:p-4">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-2.5 px-2 text-xs font-black text-amber-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10">
                <Layers className="h-4 w-4 text-amber-300" />
              </div>
              <span>تصفح حسب الفصل:</span>
            </div>

            <div className="grid w-full gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 sm:flex sm:w-auto">
              {[
                { id: 'S1', label: 'الدورة الأولى (S1)', count: counts.S1 },
                { id: 'S2', label: 'الدورة الثانية (S2)', count: counts.S2 },
                { id: 'EGTS', label: 'مقررات EGTS', count: counts.EGTS },
                { id: 'ALL', label: 'الكل', count: counts.ALL },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedSemestre(tab.id)}
                  className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-[11px] font-black transition-all ${
                    selectedSemestre === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      selectedSemestre === tab.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-20 mx-auto mt-6 max-w-5xl space-y-3 px-4 sm:px-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right text-sm font-black text-emerald-900 shadow-sm">
          💡 كل موديل متاح فيه الفصل الأول مجاناً للتجربة المباشرة بلا تسجيل الدخول — كليكي على الموديل وبدا تقرا!
        </div>

        {filteredModules.map((mod, idx) => {
          const isAvailable = mod.status === 'active';

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className={`flex flex-col items-start justify-between gap-4 rounded-[1.75rem] border p-5 md:flex-row md:items-center ${
                isAvailable
                  ? 'border-emerald-200 bg-white shadow-lg shadow-emerald-50'
                  : 'border-slate-200 bg-slate-50/80 opacity-90'
              }`}
            >
              <div className="w-full flex-1 text-right">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-slate-900 px-2.5 py-0.5 text-[11px] font-black text-amber-300">
                    {mod.semestre}
                  </span>

                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-emerald-700">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      <span>متاح الآن</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-black text-sky-700">
                      <UserPlus className="h-3 w-3 text-sky-500" />
                      <span>التسجيل مفتوح</span>
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-black leading-snug text-slate-900 md:text-xl" dir="ltr" style={{ textAlign: 'right' }}>
                  {mod.title}
                </h2>

                {mod.description && (
                  <p className="mt-1 text-sm font-bold leading-relaxed text-slate-500">{mod.description}</p>
                )}
              </div>

              <div className="w-full shrink-0 border-t border-slate-100 pt-2 md:w-auto md:border-0 md:pt-0">
                {isAvailable ? (
                  <Link
                    to={`/module/${mod.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500 md:w-auto"
                  >
                    <span>دخل جرب الدرس المجاني ⬅</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to={`/waitlist?offer=single_module&module=${mod.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100 md:w-auto"
                  >
                    <BellRing className="h-4 w-4 text-amber-600" />
                    <span>طلب هذا الموديل عبر واتساب</span>
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}

        {filteredModules.length === 0 && (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white py-14 text-center shadow-sm">
            <Layers className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm font-bold text-slate-500">تأكد من اتصالك بالإنترنت</p>
          </div>
        )}
      </main>
    </div>
  );
}
