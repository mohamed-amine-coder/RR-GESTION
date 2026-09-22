import { useState, useEffect, useRef } from 'react';
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
  ArrowRight,
  Rocket,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import rrTeamImg from '../assets/rr-team.png';
import mrRrImg from '../assets/mr-rr.png';
import msRrImg from '../assets/ms-rr.png';
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

  // للتمرير باللمس
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

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
      <div className="h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-4">
        <div className="font-black text-lg text-rose-500">مزال مادخل تا محتوى فهاد الفصل!</div>
        <Link to="/modules" className="px-6 py-2 bg-[#0F172A] text-white font-bold rounded-xl text-sm">
          الرجوع للموديلات
        </Link>
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

  // ===== التمرير باللمس =====
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const dist = touchStartX.current - touchEndX.current;
    const threshold = 60;
    if (Math.abs(dist) < threshold) return;
    if (dist < 0) handleNext();
    else handlePrev();
  };

  // ===== حالة الشخصيات =====
  const isQuizSlide = current?.type === 'quiz';
  const isAnswerCorrect =
    isQuizSlide && quizSubmitted && selectedOption === current?.correct;
  const isAnswerWrong =
    isQuizSlide && quizSubmitted && selectedOption !== current?.correct;

  const mood = isCompleted
    ? 'celebrate'
    : isAnswerCorrect
      ? 'correct'
      : isAnswerWrong
        ? 'wrong'
        : isQuizSlide && selectedOption !== null && !quizSubmitted
          ? 'thinking'
          : 'idle';

  const charAnimate = {
    idle: { y: [0, -3, 0], rotate: [0, -1, 1, 0] },
    thinking: { rotate: [0, 3, -3, 0], y: [0, -2, 0] },
    correct: { y: [0, -14, 0], scale: [1, 1.1, 1] },
    wrong: { x: [0, -4, 4, -4, 4, 0] },
    celebrate: { y: [0, -16, 0], rotate: [0, 6, -6, 0], scale: [1, 1.06, 1] },
  };

  const charTransition = {
    duration:
      mood === 'idle' || mood === 'thinking' || mood === 'celebrate' ? 2 : 0.5,
    repeat:
      mood === 'idle' || mood === 'thinking' || mood === 'celebrate' ? Infinity : 0,
    ease: 'easeInOut',
  };

  // ===== تعليقات ms RR =====
  const msSpeech = (() => {
    if (isCompleted || isQuizSlide) return null;
    if (current?.type === 'intro') return 'يلا نبداو الدرس! 🌟';
    if (current?.type === 'concept') return 'ركز فهاد المفهوم 💡';
    if (current?.type === 'comparison') return 'شوف الفرق بيناتهم 👀';
    // if (current?.type === 'dictionary') return 'حفظ هاد المصطلحات 📚';
    // if (current?.type === 'trap') return 'حذاري! هاد الغلطة شائعة ⚠️';
    if (current?.type === 'audio') return 'سمع مزيان 🎧';
    return null;
  })();

  // ===== تعليقات mr RR =====
  const mrSpeech = (() => {
    if (isQuizSlide && !quizSubmitted && selectedOption !== null) {
      return 'تحقق واش صحيح';
    }
    if (current?.type === 'dictionary') return 'حفظ هاد المصطلحات 📚';
    if (current?.type === 'trap') return 'حذاري! هاد الغلطة شائعة ⚠️';
    return null;
  })();

  return (
    <div
      className="fixed inset-0 w-full bg-[#FFFDF7] flex flex-col overflow-hidden select-none"
      dir="rtl"
    >
      {/* ===================== CELEBRATION MODAL ===================== */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="bg-white rounded-3xl p-6 md:p-7 max-w-sm w-full shadow-2xl border-2 border-amber-400 flex flex-col items-center text-center"
            >
              <div className="relative mb-3">
                <img
                  src={rrTeamImg}
                  alt="RR Team"
                  className="w-24 h-auto object-cover rounded-2xl border-2 border-amber-200 shadow-sm"
                />
                <motion.span
                  className="absolute -top-2 -right-2 text-xl"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  🏆
                </motion.span>
              </div>

              <h2 className="text-lg font-black text-slate-900 mb-1">ماعلكش يا بطل!</h2>
              <p className="text-slate-500 font-bold text-xs mb-5 leading-relaxed">
                سالييتي هاد الفصل بنجاح
              </p>

              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  onClick={handleReturn}
                  className="flex-1 py-2.5 bg-[#FFB800] hover:bg-[#F0A500] text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>الدرس الجاي</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRepeat}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>تكرار الدرس</span>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== TOP BAR (فيكس الفوق) ===================== */}
      <header className="shrink-0 w-full bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
          <Link
            to={moduleId ? `/module/${moduleId}` : '/modules'}
            className="bg-[#0F172A] hover:bg-slate-800 text-white text-[11px] font-black px-2.5 py-1 rounded-lg transition"
          >
            خروج
          </Link>

          <div className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-slate-800 text-[11px] font-black px-2.5 py-1 rounded-lg">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>خوذ وقتك فكل سلايد.</span>
          </div>

          <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
            <span>RR GESTION</span>
            <span className="w-5 h-5 bg-[#FFB800] rounded-md flex items-center justify-center text-slate-900 text-[10px]">
              ⚡
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-3 pb-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-l from-[#22C55E] to-[#16A34A] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] font-black text-slate-500 tabular-nums">
            {currentIndex + 1}/{total}
          </span>
          <Link
            to={moduleId ? `/module/${moduleId}` : '/modules'}
            className="text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </header>

      {/* ===================== MAIN SCROLLABLE CONTENT (كتاخد المساحة كاملة) ===================== */}
      <main
        className="flex-1 min-h-0 w-full max-w-3xl mx-auto overflow-y-auto px-3 pt-5 pb-32 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="w-full relative z-20"
          >
            {/* 1. INTRO */}
            {current.type === 'intro' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border-2 border-[#FFB800] rounded-2xl p-5 md:p-7 text-center shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/70 text-amber-700 rounded-full text-[10px] font-black mb-3 border border-amber-200">
                  <Sparkles className="w-3 h-3" />
                  <span>{current.tag}</span>
                </div>
                <p className="text-slate-800 font-bold text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                  {current.contentAr}
                </p>
              </div>
            )}

            {/* 2. CONCEPT */}
            {current.type === 'concept' && (
              <div className="bg-gradient-to-br from-amber-50/70 to-sky-50/40 border-2 border-sky-400 rounded-2xl p-5 md:p-7 text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2 text-sky-500">
                  <h3 className="text-base md:text-lg font-black text-slate-900">
                    {current.title}
                  </h3>
                  <Lightbulb className="w-4 h-4" />
                </div>
                <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed mb-4 max-w-lg mx-auto">
                  {current.desc}
                </p>
                {current.badges && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {current.badges.map((b, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-black tracking-wider bg-white/80 text-sky-600 border border-sky-200 px-2.5 py-0.5 rounded-lg"
                        dir="ltr"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. COMPARISON */}
            {current.type === 'comparison' && (
              <div className="bg-gradient-to-br from-amber-50/60 to-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 relative border-b border-slate-100 text-center font-black text-xs md:text-sm">
                  <div className={`p-2.5 ${current.left.bg} ${current.left.color}`}>
                    {current.left.title}
                  </div>
                  <div className={`p-2.5 ${current.right.bg} ${current.right.color}`}>
                    {current.right.title}
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F172A] text-white text-[10px] font-black w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                    VS
                  </div>
                </div>
                <div className="grid grid-cols-2 p-4 md:p-5 gap-3 text-[11px] md:text-xs font-bold text-slate-700">
                  <ul className="space-y-2.5 text-center">
                    {current.left.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${current.left.dotColor} shrink-0`} />
                        <span dir="auto">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2.5 text-center">
                    {current.right.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${current.right.dotColor} shrink-0`} />
                        <span dir="auto">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 4. DICTIONARY */}
            {current.type === 'dictionary' && (
              <div className="bg-gradient-to-br from-amber-50/60 to-teal-50/40 border-2 border-teal-500 rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex items-center justify-center gap-2 text-teal-600 mb-3 border-b border-teal-100 pb-2.5">
                  <div className="p-1 bg-white rounded-md text-teal-600">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-black text-slate-800">{current.tag}</span>
                </div>
                <div className="divide-y divide-teal-100/60">
                  {current.terms.map((t, idx) => (
                    <div
                      key={idx}
                      className="py-2 flex items-center justify-center px-1 gap-3"
                    >
                      <span
                        dir="auto"
                        className="font-black text-teal-600 text-sm md:text-base text-center flex-1"
                      >
                        {t.ar}
                      </span>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                      <span
                        dir="ltr"
                        className="font-extrabold text-slate-800 text-sm md:text-base text-center flex-1"
                      >
                        {t.fr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TRAP */}
            {current.type === 'trap' && (
              <div className="bg-gradient-to-br from-amber-50/60 to-rose-50/50 border-2 border-rose-400 rounded-2xl p-5 md:p-7 text-center shadow-sm">
                <div className="inline-flex items-center gap-1.5 text-rose-500 font-black text-[10px] mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{current.tag}</span>
                </div>
                <p
                  dir="auto"
                  className="text-slate-800 font-black text-sm md:text-base leading-relaxed max-w-lg mx-auto"
                >
                  {current.text}
                </p>
              </div>
            )}

            {/* 6. QUIZ */}
            {current.type === 'quiz' && (
              <div className="bg-gradient-to-br from-amber-50/60 to-white border-2 border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm text-center">
                <h3
                  dir="auto"
                  className="text-sm md:text-base font-black text-slate-900 mb-3 leading-relaxed"
                >
                  {current.question}
                </h3>

                <div className="space-y-2 mb-3 max-w-md mx-auto">
                  {current.options.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = current.correct === i;
                    let style =
                      'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                    if (quizSubmitted) {
                      if (isCorrect)
                        style = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                      else if (isSelected)
                        style = 'border-rose-400 bg-rose-50 text-rose-800';
                    } else if (isSelected) {
                      style =
                        'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900';
                    }

                    return (
                      <button
                        key={i}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedOption(i)}
                        className={`w-full p-2.5 rounded-xl border-2 font-bold text-xs md:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer ${style}`}
                        dir="rtl"
                      >
                        <span dir="auto" className="flex-1 text-center leading-snug">
                          {opt}
                        </span>
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={selectedOption === null}
                    className="w-full max-w-md mx-auto py-2.5 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 text-white font-black text-xs rounded-xl transition cursor-pointer"
                  >
                    تحقق
                  </button>
                ) : selectedOption === current.correct ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] md:text-xs font-bold text-emerald-800 text-center flex items-start gap-2 justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span dir="auto">{current.explanation}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] md:text-xs font-bold text-rose-800 text-center flex items-start gap-2 justify-center"
                  >
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1 text-center">
                      <div dir="auto" className="mb-1">
                        الجواب اللي ختاريتيه ماشي هو الصحيح.
                      </div>
                      {/* حيدنا السطر ديال "الجواب الصحيح هو..." من هنا حيت ديجا البوطونة ديالو ولات خضرا الفوق */}
                      <div className="text-slate-600" dir="auto">
                        💡 {current.explanation}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* 7. AUDIO */}
            {current.type === 'audio' && (
              <div className="bg-gradient-to-br from-amber-50/60 to-indigo-50/40 border-2 border-indigo-400 rounded-2xl p-5 md:p-7 text-center shadow-sm">
                <div className="inline-flex items-center gap-1.5 text-indigo-600 font-black text-[10px] mb-3">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{current.tag}</span>
                </div>
                <div className="bg-white/70 border border-indigo-100 p-3 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3">
                  <button className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow transition cursor-pointer shrink-0">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                  <div className="text-center flex-1">
                    <h4 dir="auto" className="font-extrabold text-slate-800 text-xs md:text-sm">
                      {current.title}
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-600" dir="ltr">
                      {current.duration}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {/* ===================== BOTTOM AREA (فيكس فاللخر ديال الشاشة) ===================== */}
      <div className="shrink-0 w-full max-w-3xl mx-auto relative z-20">
        
        {/* --- شخصية مستر RR (يمين - لاصقة فوق الفوتر) --- */}
        <motion.div
          className="hidden sm:block absolute bottom-full right-2 mb-2 pointer-events-none"
          animate={charAnimate[mood]}
          transition={charTransition}
        >
          <img
            src={mrRrImg}
            alt="Mr RR"
            draggable={false}
            className="w-14 md:w-16 h-14 md:h-16 object-cover rounded-2xl border-2 border-amber-300 shadow-lg bg-white"
          />
        </motion.div>

        {/* --- شخصية مس RR (يسار - لاصقة فوق الفوتر) --- */}
        <motion.div
          className="hidden sm:block absolute bottom-full left-2 mb-2 pointer-events-none"
          animate={charAnimate[mood]}
          transition={{ ...charTransition, delay: mood === 'celebrate' ? 0.1 : 0 }}
        >
          <img
            src={msRrImg}
            alt="Ms RR"
            draggable={false}
            className="w-14 md:w-16 h-14 md:h-16 object-cover rounded-2xl border-2 border-rose-300 shadow-lg bg-white"
          />
        </motion.div>

        {/* --- فقاعة مس RR --- */}
        <AnimatePresence>
          {msSpeech && (
            <motion.div
              key={msSpeech}
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              className="hidden sm:block absolute bottom-[calc(100%+75px)] left-3 z-20 bg-white border-2 border-rose-300 text-rose-700 rounded-xl px-2.5 py-1 text-[10px] font-black shadow-md"
            >
              {msSpeech}
              <span className="absolute -bottom-1 left-3 w-2 h-2 bg-white border-b-2 border-l-2 border-rose-300 rotate-[-45deg]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- فقاعة مستر RR --- */}
        <AnimatePresence>
          {mrSpeech && (
            <motion.div
              key={mrSpeech}
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              className="hidden sm:block absolute bottom-[calc(100%+75px)] right-3 z-20 bg-white border-2 border-slate-900 text-slate-900 rounded-xl px-2.5 py-1 text-[10px] font-black shadow-md"
            >
              {mrSpeech}
              <span className="absolute -bottom-1 right-3 w-2 h-2 bg-white border-b-2 border-r-2 border-slate-900 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- الأزرار ديال الفوتر --- */}
        <footer className="w-full px-3 pt-2 pb-4 flex items-center gap-2 bg-[#FFFDF7]">
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 bg-[#FFB800] hover:bg-[#F0A500] text-slate-950 font-black text-sm rounded-xl shadow-sm transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            {currentIndex === total - 1 ? (
              <>
                <Trophy className="w-4 h-4" />
                <span>إنهاء الدرس</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>تابع</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-slate-300 disabled:opacity-0 disabled:pointer-events-none text-slate-600 font-black text-sm rounded-xl transition cursor-pointer"
          >
            سابق
          </button>
        </footer>
      </div>
    </div>
  );
}
