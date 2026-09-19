import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Headphones,
  Play,
  X,
  ArrowLeftRight,
  KeyRound,
  Languages,
  Trophy,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import rrTeamImg from '../assets/rr-team.png';
import LoadingScreen from '../components/common/LoadingScreen';
import { useAuth } from '../contexts/AuthContext';

export default function CourseViewer() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user, hasActiveModuleAccess, loading: authLoading } = useAuth();

  const [slides, setSlides] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchChapterData = async () => {
      if (!chapterId) {
        setLoading(false);
        return;
      }

      const { data: chapData } = await supabase
        .from('chapters')
        .select('id, module_id, is_free')
        .eq('id', chapterId)
        .single();

      if (!chapData) {
        setLoading(false);
        return;
      }

      const nextModuleId = chapData.module_id;
      setModuleId(nextModuleId);

      if (!chapData.is_free) {
        if (!user) {
          navigate('/login', { replace: true });
          return;
        }

        const hasAccess = await hasActiveModuleAccess(nextModuleId);
        if (!hasAccess) {
          navigate(`/module/${nextModuleId}`, { replace: true });
          return;
        }
      }

      const { data, error } = await supabase
        .from('slides')
        .select('content')
        .eq('chapter_id', chapterId)
        .order('order_index');

      if (error) {
        console.error('Error fetching slides:', error);
      } else if (data) {
        setSlides(data.map(item => item.content));
      }
      setLoading(false);
    };

    fetchChapterData();
  }, [chapterId, hasActiveModuleAccess, navigate, user]);

  if (authLoading || loading) {
    return <LoadingScreen message="جارٍ تحميل الدرس..." />;
  }

  if (slides.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBF7] flex flex-col items-center justify-center gap-4">
        <div className="font-black text-xl text-rose-500">مزال مادخل تا سلايد فهاد الفصل!</div>
        <Link to="/modules" className="px-6 py-2 bg-[#0F172A] text-white font-bold rounded-xl">الرجوع للموديلات</Link>
      </div>
    );
  }

  const total = slides.length;
  const current = slides[currentIndex];
  const progressPercentage = ((currentIndex + 1) / total) * 100;

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      // وصل لآخر سلايد! نطلعو مودال الاحتفال والخيارات
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    }
  };

  const handleRepeat = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleReturn = () => {
    navigate(moduleId ? `/module/${moduleId}` : '/modules');
  };

  return (
    <div className="min-h-screen bg-[#FBFBF7] flex flex-col justify-between items-center select-none relative overflow-hidden" dir="rtl">
      
      {/* 🎉 CELEBRATION OVERLAY WITH OPTIONS */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-[3rem] p-8 md:p-10 max-w-md w-full shadow-2xl border-4 border-amber-400 flex flex-col items-center"
            >
              {/* Team Illustration Inside Modal */}
              <img 
                src={rrTeamImg} 
                alt="RR Team Success" 
                className="w-36 h-auto object-cover rounded-2xl mb-4 shadow-md border-2 border-slate-100"
              />

              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <Trophy className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2">
                عالمي يا بطل! 🚀
              </h2>
              <p className="text-slate-600 font-bold text-xs md:text-sm mb-6 leading-relaxed">
                سالييتي هاد الفصل بنجاح تام. شنو بغيتي دير دابا؟
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  onClick={handleReturn}
                  className="flex-1 py-3.5 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>العودة للموديل</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button 
                  onClick={handleRepeat}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>تكرار الدرس</span>
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="w-full bg-[#FBFBF7]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to={moduleId ? `/module/${moduleId}` : '/modules'} className="bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-xs">
            خروج من الدرس
          </Link>
          <div className="bg-[#FEF08A] border border-amber-300 text-slate-900 text-xs font-black px-5 py-2 rounded-2xl shadow-xs text-center hidden md:block">
            التركيز هو سر النجاح، خوذ وقتك فكل سلايد.
          </div>
          <div className="flex items-center gap-1.5 font-black text-slate-900 text-lg">
            <span>RR GESTION</span>
            <span className="w-7 h-7 bg-[#FFB800] rounded-lg flex items-center justify-center text-slate-900 text-xs">⚡</span>
          </div>
        </div>

        {/* Progress Bar & Exit Icon */}
        <div className="max-w-3xl mx-auto px-4 pt-4 flex items-center gap-4">
          <div className="flex-1 h-3 bg-slate-200/80 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#22C55E] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <Link to={moduleId ? `/module/${moduleId}` : '/modules'} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-6 h-6 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl px-4 my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >

            {/* 1. INTRO BLOCK */}
            {current.type === 'intro' && (
              <div className="bg-white border-2 border-[#FFB800] rounded-[2.5rem] p-8 md:p-12 text-center shadow-lg shadow-amber-100/30">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{current.tag}</span>
                </div>
                <p className="text-slate-800 font-bold text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
                  {current.contentAr}
                </p>
              </div>
            )}

            {/* 2. CONCEPT BLOCK */}
            {current.type === 'concept' && (
              <div className="bg-white border-2 border-sky-400 rounded-[2.5rem] p-8 md:p-12 text-center shadow-lg shadow-sky-100/30">
                <div className="flex items-center justify-center gap-2 mb-4 text-sky-500">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900">{current.title}</h3>
                  <Lightbulb className="w-6 h-6" />
                </div>
                <p className="text-slate-700 font-bold text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                  {current.desc}
                </p>
                {current.badges && (
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    {current.badges.map((b, i) => (
                      <span key={i} className="text-xs font-black tracking-wider bg-sky-50 text-sky-600 border border-sky-100 px-3.5 py-1.5 rounded-xl" dir="ltr">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. COMPARISON BLOCK (VS) */}
            {current.type === 'comparison' && (
              <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] overflow-hidden shadow-lg">
                <div className="grid grid-cols-2 relative border-b border-slate-100 text-center font-black text-sm md:text-base">
                  <div className={`p-4 ${current.left.bg} ${current.left.color}`}>
                    {current.left.title}
                  </div>
                  <div className={`p-4 ${current.right.bg} ${current.right.color}`}>
                    {current.right.title}
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F172A] text-white text-[11px] font-black w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    VS
                  </div>
                </div>
                <div className="grid grid-cols-2 p-6 md:p-8 gap-4 text-xs md:text-sm font-bold text-slate-700">
                  <ul className="space-y-4">
                    {current.left.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${current.left.dotColor} shrink-0`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-4">
                    {current.right.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${current.right.dotColor} shrink-0`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 4. DICTIONARY BLOCK */}
            {current.type === 'dictionary' && (
              <div className="bg-white border-2 border-teal-500 rounded-[2.5rem] p-6 md:p-10 shadow-lg shadow-teal-50/40">
                <div className="flex items-center justify-end gap-2 text-teal-600 mb-6 border-b border-slate-100 pb-4">
                  <span className="text-sm font-black text-slate-800">{current.tag}</span>
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                    <Languages className="w-4 h-4" />
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {current.terms.map((t, idx) => (
                    <div key={idx} className="py-4 flex items-center justify-between px-2">
                      <span className="font-black text-teal-600 text-base md:text-lg">{t.ar}</span>
                      <ArrowLeftRight className="w-4 h-4 text-teal-300" />
                      <span className="font-extrabold text-slate-800 text-base md:text-lg" dir="ltr">{t.fr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TRAP BLOCK */}
            {current.type === 'trap' && (
              <div className="bg-white border-2 border-rose-400 rounded-[2.5rem] p-8 md:p-12 text-center shadow-lg shadow-rose-50">
                <div className="inline-flex items-center gap-1.5 text-rose-500 font-black text-xs mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{current.tag}</span>
                </div>
                <p className="text-slate-800 font-black text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                  {current.text}
                </p>
              </div>
            )}

            {/* 6. QUIZ BLOCK */}
            {current.type === 'quiz' && (
              <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-lg text-center">
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6">
                  {current.question}
                </h3>
                <div className="space-y-3 mb-6 max-w-md mx-auto">
                  {current.options.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = current.correct === i;
                    let style = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";

                    if (quizSubmitted) {
                      if (isCorrect) style = "border-emerald-500 bg-emerald-50 text-emerald-900";
                      else if (isSelected) style = "border-rose-400 bg-rose-50 text-rose-800";
                    } else if (isSelected) {
                      style = "border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900";
                    }

                    return (
                      <button
                        key={i}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedOption(i)}
                        className={`w-full p-4 rounded-2xl border-2 font-bold text-sm md:text-base flex items-center justify-between transition-all cursor-pointer ${style}`}
                        dir="ltr"
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={selectedOption === null}
                    className="w-full max-w-md mx-auto py-3.5 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 text-white font-black rounded-2xl transition cursor-pointer"
                  >
                    تحقق
                  </button>
                ) : (
                  <div className="max-w-md mx-auto p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs md:text-sm font-bold text-emerald-800 text-right">
                    💡 {current.explanation}
                  </div>
                )}
              </div>
            )}

            {/* 7. AUDIO BLOCK */}
            {current.type === 'audio' && (
              <div className="bg-white border-2 border-purple-400 rounded-[2.5rem] p-8 md:p-12 text-center shadow-lg shadow-purple-50">
                <div className="inline-flex items-center gap-1.5 text-purple-600 font-black text-xs mb-6">
                  <Headphones className="w-4 h-4" />
                  <span>{current.tag}</span>
                </div>
                <div className="bg-purple-50/60 border border-purple-100 p-5 rounded-2xl max-w-md mx-auto flex items-center justify-between">
                  <button className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-md transition cursor-pointer">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                  <div className="text-right flex-1 mr-4">
                    <h4 className="font-extrabold text-slate-800 text-sm">{current.title}</h4>
                    <span className="text-xs font-bold text-purple-600" dir="ltr">{current.duration}</span>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Floating Bar */}
      <footer className="w-full max-w-3xl px-4 pb-8 flex items-center gap-3">
        <button
          onClick={handleNext}
          className="flex-1 py-4 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black text-base md:text-lg rounded-2xl shadow-sm transition active:scale-[0.99] cursor-pointer"
        >
          {currentIndex === total - 1 ? "إنهاء الدرس 🏆" : "تابع"}
        </button>

        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 disabled:opacity-0 disabled:pointer-events-none text-slate-600 font-black text-base rounded-2xl transition cursor-pointer"
        >
          سابق
        </button>
      </footer>

    </div>
  );
}