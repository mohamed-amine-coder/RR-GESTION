import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Sparkles, CheckCircle2, Lock, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function ModulePage() {
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      setLoading(true);

      // 1. نجيبو معلومات الموديل
      const { data: modData } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();
      
      if (modData) setModuleData(modData);

      // 2. نجيبو الفصول ديال هاد الموديل
      const { data: chapsData } = await supabase
        .from('chapters')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index');
      
      if (chapsData) setChapters(chapsData);

      // 3. نتأكدو واش المستخدم الحالي عندو الحق يشوف الدروس المسدودة
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: access } = await supabase
          .from('user_access')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('module_id', moduleId)
          .eq('status', 'active')
          .maybeSingle();
        
        if (access) setIsSubscribed(true);
      }

      setLoading(false);
    };

    fetchModuleDetails();
  }, [moduleId]);

  if (loading) {
    return <div className="min-h-screen bg-[#FBFBF7] flex items-center justify-center font-black text-2xl text-slate-400">جاري التحميل... ⚡</div>;
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-[#FBFBF7] flex flex-col items-center justify-center gap-4">
        <div className="font-black text-xl text-rose-500">هاد الموديل ماكاينش!</div>
        <Link to="/modules" className="px-6 py-2 bg-[#0F172A] text-white font-bold rounded-xl">الرجوع للموديلات</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF7] select-none pb-24" dir="rtl">
      
      {/* 1. DARK HERO SECTION */}
      <section className="bg-[#0B132B] text-white pt-14 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="order-2 md:order-1 bg-[#162033]/90 border border-white/10 rounded-3xl p-6 text-center min-w-[200px] shadow-2xl">
            <span className="text-xs font-bold text-slate-300 block mb-1">الثمن الحالي</span>
            <div className="flex items-baseline justify-center gap-1.5" dir="ltr">
              <span className="text-xs font-black text-slate-400">DH</span>
              <span className="text-4xl font-black text-white">{moduleData.price}</span>
            </div>
            <span className="text-[10px] font-black text-amber-400 tracking-widest block mt-2 uppercase">
              FULL ACCESS
            </span>
          </div>

          <div className="order-1 md:order-2 text-center md:text-right flex-1">
            <span className="inline-flex items-center gap-1.5 bg-[#FFB800] text-slate-950 px-3.5 py-1 rounded-lg text-xs font-black mb-4 uppercase tracking-wider">
              <Layout className="w-3.5 h-3.5" />
              <span>{moduleData.semestre}</span>
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight" dir="ltr">
              {moduleData.title}
            </h1>

            <p className="text-slate-400 text-sm md:text-base font-bold max-w-xl leading-relaxed">
              {moduleData.description}
            </p>
          </div>

        </div>
      </section>

      {/* 2. FLOATING STATS PILL */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-md flex items-center justify-around text-xs md:text-sm font-black text-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>جودة عالية</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>{chapters.length} فصول</span>
          </div>
        </div>
      </div>

      {/* 3. SECTION DIVIDER */}
      <div className="max-w-3xl mx-auto px-4 mt-12 mb-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-[#FBFBF7] px-6 text-base font-black text-slate-900">
            محتوى الموديل
          </span>
        </div>
      </div>

      {/* 4. CHAPTER CARDS LIST */}
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {chapters.map((ch, idx) => {
          const canAccess = ch.is_free || isSubscribed;

          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200/80 rounded-[2rem] p-5 md:p-6 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="shrink-0">
                {canAccess ? (
                  <Link
                    to={`/viewer/${ch.id}`}
                    className="px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs md:text-sm font-black rounded-xl transition shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>بدا الدرس</span>
                  </Link>
                ) : (
                  <div className="px-5 py-2.5 bg-slate-100 text-slate-400 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    <span>خاص بالمشتركين</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 flex-1 justify-end text-right">
                <div>
                  <h3 className="text-sm md:text-base font-black text-slate-900 mb-1 leading-snug">
                    {ch.title_ar}
                  </h3>
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    {ch.badge && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-lg">
                        {ch.badge} 🪄
                      </span>
                    )}
                    {ch.is_free && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>متاح مجاناً</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
                  ch.is_free 
                    ? 'bg-emerald-100/70 text-emerald-700' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {ch.order_index || idx + 1}
                </div>
              </div>
            </motion.div>
          );
        })}
        {chapters.length === 0 && (
           <p className="text-center text-slate-400 font-bold py-8">مزال ماتزادو فصول فهاد الموديل.</p>
        )}
      </div>

    </div>
  );
}