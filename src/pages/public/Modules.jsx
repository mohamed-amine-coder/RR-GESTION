import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Lock, Flame, BellRing, Layers, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import rrTeamImg from '../../assets/rr-team.png';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemestre, setSelectedSemestre] = useState('ALL');

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

  if (loading) {
    return <LoadingScreen message=" ..." />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 select-none pb-24 font-[family-name:var(--font-tajawal)]" dir="rtl">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B1120] text-white pt-12 pb-20 px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute top-0 right-1/4 w-[450px] h-[250px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-right flex-1">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black text-amber-300 mb-3 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span> </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-2">
                           
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed mb-6 max-w-lg">
                           
            </p>

            {/* Segmented Filter Bar - FIXED FOR MOBILE */}
            <div className="flex w-full md:w-auto md:inline-flex p-1 bg-slate-900/90 border border-slate-700/60 rounded-xl backdrop-blur-lg overflow-x-auto hide-scrollbar gap-1">
              {[
                { id: 'ALL', label: ' الكل' },
                { id: 'EGTS', label: '  EGTS' },
                { id: 'S1', label: '  1 (S1)' },
                { id: 'S2', label: '  2 (S2)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSemestre(tab.id)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer ${
                    selectedSemestre === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
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

      {/* 2. DEMAND-DRIVEN MODULE CARDS */}
      <main className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 space-y-3">
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
                      <span> </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-black">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span> </span>
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
                    <span>افتح المقرر الكامل</span>
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}

        {filteredModules.length === 0 && (
          <div className="text-center py-14 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-bold text-xs"> .</p>
          </div>
        )}
      </main>
    </div>
  );
}