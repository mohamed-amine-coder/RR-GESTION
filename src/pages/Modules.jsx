import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronLeft, BookOpen, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import rrTeamImg from '../assets/rr-team.png';

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
    return <div className="min-h-screen bg-[#FBFBF7] flex items-center justify-center font-black text-2xl text-slate-400">جاري التحميل... ⚡</div>;
  }

  return (
    <div className="min-h-screen bg-[#FBFBF7] select-none pb-24 overflow-x-hidden" dir="rtl">
      
      {/* 🚀 HERO SECTION WITH ROUNDED TEAM IMAGE */}
      <section className="bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white pt-16 pb-32 px-4 relative overflow-hidden rounded-b-[3.5rem] shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-amber-500/10 border border-amber-400/30 px-4 py-2 rounded-2xl text-xs font-black text-amber-400 mb-6 shadow-inner">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>منصة التكوين المهني الاحترافي - TSGE</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              ابني مستقبلكم المهنــي <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-amber-200">
                بأسهل وأذكى طريقة ⚡
              </span>
            </h1>
            
            <p className="text-slate-300 font-bold text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              اختر وحدتك الدراسية وتتبع الدروس، الملخصات، والاختبارات التفاعلية المصممة خصيصاً لتفوقك.
            </p>

            {/* Semestres Filter Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {['ALL', 'EGTS', 'S1', 'S2'].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemestre(sem)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md ${
                    selectedSemestre === sem
                      ? 'bg-[#FFB800] text-slate-950 scale-105 shadow-amber-400/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'
                  }`}
                >
                  {sem === 'ALL' ? '🌟 جميع الوحدات' : `📚 ${sem}`}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Team / Characters Illustration (Rounded & Styled) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-amber-400/10 rounded-[3rem] blur-xl -z-10" />
              <img 
                src={rrTeamImg} 
                alt="RR Team" 
                className="w-full h-auto object-cover rounded-[3rem] shadow-2xl border-4 border-white/10 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 📚 HORIZONTAL MODULES CARDS LIST */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20 space-y-4">
        {filteredModules.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Link 
              to={`/module/${mod.id}`}
              className="bg-white/95 backdrop-blur-md border-2 border-slate-200/80 hover:border-amber-400 rounded-[2.5rem] p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 group"
            >
              {/* Left Side: Icon & Titles */}
              <div className="flex items-center gap-5 w-full md:w-auto flex-1">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-[#0F172A] group-hover:text-white flex items-center justify-center text-amber-600 transition-colors shadow-inner shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 group-hover:bg-[#FFB800] group-hover:text-slate-950 text-slate-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider transition-colors">
                      {mod.semestre}
                    </span>
                  </div>

                  {/* French / Main Title */}
                  <h3 className="text-base md:text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-snug" dir="ltr" style={{ textAlign: 'right' }}>
                    {mod.title}
                  </h3>

                  {/* Arabic Description */}
                  <p className="text-slate-500 font-bold text-xs mt-1 leading-relaxed line-clamp-1">
                    {mod.description || 'محتوى شامل لدروس وتمارين هذا الموديل.'}
                  </p>
                </div>
              </div>

              {/* Right Side: Start Button (No Price) */}
              <div className="w-full md:w-auto shrink-0 flex justify-end">
                <div className="w-full md:w-auto text-xs font-black text-slate-900 group-hover:text-slate-950 flex items-center justify-center gap-2 bg-slate-100 group-hover:bg-[#FFB800] px-6 py-3.5 rounded-2xl transition-all shadow-xs">
                  <span>استكشف الموديل</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>

            </Link>
          </motion.div>
        ))}

        {filteredModules.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <p className="text-slate-400 font-bold text-base">ما كاين حتى موديل فـ هاد الفئة حالياً.</p>
          </div>
        )}
      </div>

    </div>
  );
}