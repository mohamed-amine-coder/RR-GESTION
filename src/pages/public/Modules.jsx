import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, UserPlus, Flame, BellRing, Layers, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import rrTeamImg from '../../assets/rr-team.png';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemestre, setSelectedSemestre] = useState('S1');

  useEffect(() => {
    const fetchModules = async () => {
      const { data } = await supabase
        .from('modules')
        .select('*')
        .order('order_index');
        
      if (data) setModules(data);
      setLoading(false);
    };

    fetchModules();
  }, []);

  const filteredModules = selectedSemestre === 'ALL' 
    ? modules 
    : modules.filter(m => m.semestre === selectedSemestre);

  // حساب عدد المقررات في كل فصل باش نبينوه للعميل (إيحاء بالوفرة)
  const counts = {
    S1: modules.filter(m => m.semestre === 'S1').length,
    S2: modules.filter(m => m.semestre === 'S2').length,
    EGTS: modules.filter(m => m.semestre === 'EGTS').length,
    ALL: modules.length,
  };

  if (loading) {
    return <LoadingScreen message="المرجو الانتظار..." />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 select-none pb-24 font-[family-name:var(--font-tajawal)]" dir="rtl">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B1120] text-white pt-10 pb-16 px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute top-0 right-1/4 w-[450px] h-[250px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-right flex-1">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black text-amber-300 mb-3 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>منصة التكوين الاحترافي</span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-2">
              استكشف جميع المقررات الدراسية
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed max-w-lg">
              اختر الفصل الدراسي المناسب لك وابدأ رحلة التفوق الأكاديمي بخطوات واضحة ومحتوى مركز.
            </p>
          </div>
          
          <div className="hidden md:block shrink-0">
            <img 
              src={rrTeamImg} 
              alt="RR Team" 
              className="w-28 h-auto rounded-2xl border border-amber-400/20 shadow-2xl opacity-90"
            />
          </div>
        </div>
      </section>

      {/* 2. PROMINENT FILTER BAR (STICKY & HIGHLY VISIBLE) */}
      <div className="sticky top-4 z-40 max-w-4xl mx-auto px-4 -mt-6">
        <div className="bg-slate-950/95 text-white backdrop-blur-xl border-2 border-amber-400/40 shadow-2xl shadow-slate-950/30 rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 text-xs font-black text-amber-400 px-2">
            <div className="w-7 h-7 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/30">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <span>تصفح حسب الفصل:</span>
          </div>

          <div className="grid grid-cols-2 sm:flex w-full sm:w-auto p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1">
            {[
              { id: 'S1', label: ' الدورة الأولى (S1)', count: counts.S1 },
              { id: 'S2', label: 'الدورة الثانية (S2)', count: counts.S2 },
              { id: 'EGTS', label: 'مقررات EGTS', count: counts.EGTS },
              { id: 'ALL', label: 'الكل', count: counts.ALL }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSemestre(tab.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedSemestre === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedSemestre === tab.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3. DEMAND-DRIVEN MODULE CARDS */}
      <main className="max-w-4xl mx-auto px-4 mt-6 relative z-20 space-y-3">
        {filteredModules.map((mod, idx) => {
          const isAvailable = mod.status === 'active';
          
          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className={`group bg-white rounded-2xl p-5 border transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isAvailable 
                  ? 'border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-md' 
                  : 'border-slate-200/60 bg-slate-50/60 opacity-85'
              }`}
            >
              
              {/* Content block */}
              <div className="flex-1 w-full text-right">
                
                {/* Meta details */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-slate-900 text-amber-300">
                    {mod.semestre}
                  </span>
                  
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-black">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>متاح الآن</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-black">
                      <UserPlus className="w-3 h-3 text-sky-500" />
                      <span>التسجيل مفتوح</span>
                    </span>

                  )}
                </div>

                {/* Title */}
                <h2 
                  className="text-lg md:text-xl font-black text-slate-950 tracking-tight leading-snug mb-1" 
                  dir="ltr"
                  style={{ textAlign: 'right' }}
                >
                  {mod.title}
                </h2>
                
                {/* Description */}
                {mod.description && (
                  <p className="text-xs font-semibold text-slate-500 line-clamp-1 leading-relaxed">
                    {mod.description}
                  </p>
                )}
              </div>

              {/* Action (CTA) */}
              <div className="w-full md:w-auto shrink-0 flex items-center justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                {isAvailable ? (
                  <Link
                    to={`/module/${mod.id}`}
                    className="w-full md:w-auto px-5 py-2.5 bg-slate-950 hover:bg-amber-400 hover:text-slate-950 text-white text-xs font-black rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>اكتشف الموديل</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </Link>
                ) : (
                  <Link
                    to={`/waitlist?offer=single_module&module=${mod.id}`}
                    className="w-full md:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/80 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BellRing className="w-3.5 h-3.5 text-amber-600" />
                    <span>انضم لقائمة الانتظار</span>
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}

        {filteredModules.length === 0 && (
          <div className="text-center py-14 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-bold text-xs">تأكد من اتصالك بالإنترنت</p>
          </div>
        )}
      </main>
    </div>
  );
}