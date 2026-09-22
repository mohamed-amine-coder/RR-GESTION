import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, CheckCircle2, Lock, Layout, X, MessageCircle, TicketCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

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
      
      const { data: modData } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();
        
      if (modData) setModuleData(modData);

      const { data: chapsData } = await supabase
        .from('chapters')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index');
        
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

  const openPaywall = (chapter) => {
    setSelectedChapter(chapter);
  };

  const closePaywall = () => {
    setSelectedChapter(null);
  };

  const handleWaitlist = () => {
    closePaywall();
    navigate(`/waitlist?offer=single_module&module=${moduleId}`);
  };

  const handleWhatsApp = () => {
    if (!selectedChapter) return;
    const message = encodeURIComponent(
      ` ${selectedChapter.title_ar || selectedChapter.title || ' '}  "${moduleData?.title || ''}".`
    );
    closePaywall();
    window.open(`https://wa.me/212600000000?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  if (authLoading || loading) {
    return <LoadingScreen message=" ..." />;
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-[#FBFBF7] flex flex-col items-center justify-center gap-4">
        <div className="font-black text-xl text-rose-500"> !</div>
        <Link to="/modules" className="px-6 py-2 bg-[#0F172A] text-white font-bold rounded-xl"> </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF7] select-none pb-24" dir="rtl">
      
      {/* 1. DARK HERO SECTION */}
      <section className="bg-[#0B132B] text-white pt-14 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="order-2 md:order-1 bg-[#162033]/90 border border-white/10 rounded-3xl p-6 text-center min-w-[200px] shadow-2xl">
            <span className="text-xs font-bold text-slate-300 block mb-1"> </span>
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
            <span> </span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>{chapters.length}  </span>
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
              className="bg-white border border-slate-200/80 rounded-[2rem] p-5 md:p-6 shadow-xs flex flex-col-reverse md:flex-row md:items-center justify-between gap-4"
            >
              <div className="w-full md:w-auto shrink-0 mt-3 md:mt-0">
                {canAccess ? (
                  <Link
                    to={`/viewer/${ch.id}`}
                    className="w-full md:w-auto justify-center px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs md:text-sm font-black rounded-xl transition shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>بدا للدرس</span> {/* هنا زدنا الكلمة */}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openPaywall(ch)}
                    className="w-full md:w-auto justify-center px-6 py-2.5 bg-gradient-to-r from-amber-400 to-[#FFB800] hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs md:text-sm font-black rounded-xl transition shadow-md shadow-amber-200/70 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>افتح الدرس</span> {/* هنا زدنا الكلمة */}
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-4 flex-1 justify-end text-right w-full md:w-auto">
                <div>
                  <h3 className="text-sm md:text-base font-black text-slate-900 mb-1 leading-snug">
                    {ch.title_ar}
                  </h3>
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    {ch.badge && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-lg">
                        {ch.badge}
                      </span>
                    )}
                    {ch.is_free && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span> </span>
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
           <p className="text-center text-slate-400 font-bold py-8"> .</p>
        )}
      </div>

      {/* Paywall Modal */}
      <AnimatePresence>
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePaywall}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl"
              dir="rtl"
            >
              <div className="bg-[#0B132B] px-5 py-4 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300"> </p>
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
                      <p className="text-[11px] font-black text-slate-500"> </p>
                      <p className="mt-1 text-base font-black text-slate-900">{moduleData?.title}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-100 px-3 py-2 text-right">
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-700"> </p>
                      <p className="text-xl font-black text-slate-900">{moduleData?.price} <span className="text-sm">DH</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-800"> </h4>
                  <ul className="space-y-2.5 text-sm font-bold text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span> </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span> </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span> </span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleWaitlist}
                    className="flex-1 rounded-2xl bg-[#FFB800] px-4 py-3 text-sm font-black text-slate-950 shadow-md shadow-amber-200/70 transition hover:bg-[#f5ad00]"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <TicketCheck className="h-4 w-4" />
                      <span>  (Waitlist)  </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-200"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span> </span>
                    </span>
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