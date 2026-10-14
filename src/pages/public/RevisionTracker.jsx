import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Lock, ArrowUpLeft, Clock, ChevronDown, 
  Users, MessageCircle, LogIn, Pin, Sparkles 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../components/common/LoadingScreen';

const GUEST_STORAGE_KEY = 'rr_revision_guest_progress';

// تدرجات لونية خفيفة بحال الـ Sticky Notes لتمييز كل موديل بصرياً
const NOTE_THEMES = [
  { bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]', badge: 'bg-[#FEF3C7] text-amber-900 border-[#FCD34D]' },
  { bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', badge: 'bg-[#DCFCE7] text-emerald-900 border-[#86EFAC]' },
  { bg: 'bg-[#F0F9FF]', border: 'border-[#BAE6FD]', badge: 'bg-[#E0F2FE] text-sky-900 border-[#7DD3FC]' },
  { bg: 'bg-[#FFF1F2]', border: 'border-[#FECDD3]', badge: 'bg-[#FFE4E6] text-rose-900 border-[#FDA4AF]' },
  { bg: 'bg-[#FAF5FF]', border: 'border-[#E9D5FF]', badge: 'bg-[#F3E8FF] text-purple-900 border-[#D8B4FE]' },
];

export default function RevisionTracker() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [completedMap, setCompletedMap] = useState({});
  const [userActiveModules, setUserActiveModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // جميع الموديلات مغلوقة في البداية
  const [openModuleId, setOpenModuleId] = useState(null);

  useEffect(() => {
    const loadTrackerData = async () => {
      setLoading(true);
      try {
        const { data: modsData } = await supabase
          .from('modules')
          .select('*')
          .order('order_index');

        const { data: chapsData } = await supabase
          .from('chapters')
          .select('*')
          .order('order_index');

        if (modsData) setModules(modsData);
        if (chapsData) setChapters(chapsData);

        if (user?.id) {
          const { data: accessData } = await supabase
            .from('user_access')
            .select('module_id')
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (accessData) {
            setUserActiveModules(accessData.map((item) => item.module_id));
          }

          const { data: progressData } = await supabase
            .from('user_chapter_progress')
            .select('chapter_id, is_completed')
            .eq('user_id', user.id);

          if (progressData) {
            const map = {};
            progressData.forEach((item) => {
              if (item.is_completed) map[item.chapter_id] = true;
            });
            setCompletedMap(map);
          }
        } else {
          // استرجاع تقدم الزائر من localStorage إذا كان غير مسجل
          try {
            const localSaved = localStorage.getItem(GUEST_STORAGE_KEY);
            if (localSaved) {
              setCompletedMap(JSON.parse(localSaved));
            }
          } catch (e) {
            console.error('LocalStorage read error:', e);
          }
        }
      } catch (err) {
        console.error('Tracker data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTrackerData();
  }, [user?.id]);

  const { activeModules, upcomingModules } = useMemo(() => {
    const active = [];
    const upcoming = [];

    modules.forEach((mod) => {
      const hasChapters = chapters.some((chap) => chap.module_id === mod.id);
      if (mod.status === 'active' && hasChapters) {
        active.push(mod);
      } else {
        upcoming.push(mod);
      }
    });

    return { activeModules: active, upcomingModules: upcoming };
  }, [modules, chapters]);

  const canAccessChapter = (chapter, moduleId) => {
    if (chapter.is_free) return true;
    return userActiveModules.includes(moduleId);
  };

  const toggleChapter = async (chapter, moduleId) => {
    // إيلا كان الدرس مدفوع وما عندوش اشتراك، كيديه ديريكت للوايت ليست
    if (!canAccessChapter(chapter, moduleId)) {
      navigate('/waitlist');
      return;
    }

    const chapId = chapter.id;
    const isDone = Boolean(completedMap[chapId]);
    const nextState = !isDone;

    const nextMap = { ...completedMap, [chapId]: nextState };
    setCompletedMap(nextMap);

    // إيلا كان الزائر ما مسجلش، كنحفظو فـ localStorage باش يحس بالإنجاز والتفاعل
    if (!isAuthenticated || !user?.id) {
      try {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(nextMap));
      } catch (e) {
        console.error('LocalStorage write error:', e);
      }
      return;
    }

    // إيلا كان مسجل، الحفظ فـ Supabase
    try {
      if (nextState) {
        await supabase
          .from('user_chapter_progress')
          .upsert({
            user_id: user.id,
            chapter_id: chapId,
            is_completed: true,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,chapter_id' });
      } else {
        await supabase
          .from('user_chapter_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('chapter_id', chapId);
      }
    } catch (err) {
      console.error('Update progress failed:', err);
      setCompletedMap((prev) => ({ ...prev, [chapId]: isDone }));
    }
  };

  const toggleModuleAccordion = (modId) => {
    setOpenModuleId((prev) => (prev === modId ? null : modId));
  };

  const activeChapterCount = useMemo(() => {
    const activeIds = new Set(activeModules.map((m) => m.id));
    return chapters.filter((c) => activeIds.has(c.module_id)).length;
  }, [activeModules, chapters]);

  const completedCount = useMemo(() => {
    const activeIds = new Set(activeModules.map((m) => m.id));
    const validChaps = chapters.filter((c) => activeIds.has(c.module_id));
    return validChaps.filter((c) => completedMap[c.id]).length;
  }, [activeModules, chapters, completedMap]);

  if (loading) {
    return <LoadingScreen message="جاري تجهيز دفتر المراجعة..." />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-slate-900 px-4 sm:px-6 py-8 md:py-12 select-none font-[family-name:var(--font-tajawal)]" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* 1. ستيكي نوت الفوقاني: مجموعات الدراسة المجانية */}
        <div className="bg-[#FEF08A]/90 border-2 border-[#FACC15] rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3.5 relative overflow-hidden">
          <div className="flex items-center gap-3 text-right w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-amber-950 text-[#FEF08A] flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-amber-950">
                مجموعات مراجعة مغلقة (8 طلبة كحد أقصى - بنات بوحدهم / ولاد بوحدهم)
              </h2>
              <p className="text-sm font-bold text-amber-900/85 mt-0.5 leading-relaxed">
                كنشاركو فيها الملخصات والتمارين باش توجد للامتحان بأريحية وبلا تشتت.
              </p>
            </div>
          </div>

          <Link
            to="/waitlist"
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-950 hover:bg-slate-900 text-[#FEF08A] font-black text-sm rounded-2xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>صيفط لينا ميساج</span>
          </Link>
        </div>

        {/* 2. تنبيه لطيف لحفظ التقدم الدائم في الحساب */}
        {!isAuthenticated && (
          <div className="bg-[#FFFBEB] border-2 border-[#FDE68A] rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-right w-full sm:w-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <p className="text-sm font-bold text-amber-950">
                تنبيه: التقدم ديالك دابا محفوظ غير فهاد المتصفح مؤقتاً. سجل دخولك بحساب Google باش يبقى تقدمك محفوظ ديما!
              </p>
            </div>

            <Link
              to="/login"
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>أنشئ حسابك لحفظ دائم</span>
            </Link>
          </div>
        )}

        {/* 3. العنوان الرئيسي وملخص الإنجاز */}
        <div className="bg-white border-2 border-[#E7DFCB] rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
              <Pin className="w-5 h-5 rotate-[-20deg]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-950">
                دفتر تتبع المراجعة 📌
              </h1>
              <p className="text-sm font-bold text-slate-500">
                كليكي على الموديل باش تفتح لائحة الدروس ديالو
              </p>
            </div>
          </div>

          <div className="bg-[#FBF6EA] border border-[#E7DFCB] px-3.5 py-2 rounded-2xl text-center shrink-0">
            <span className="text-xs font-bold text-slate-500 block">راجعتي</span>
            <span className="text-sm sm:text-base font-black text-slate-900 font-mono" dir="ltr">
              {completedCount} / {activeChapterCount}
            </span>
          </div>
        </div>

        {/* 4. الموديلات (Sticky Notes) */}
        <div className="space-y-2.5">
          {activeModules.map((module, mIdx) => {
            const moduleChapters = chapters.filter((c) => c.module_id === module.id);
            const modDone = moduleChapters.filter((c) => completedMap[c.id]).length;
            const isOpen = openModuleId === module.id;
            const stageNum = String(mIdx + 1).padStart(2, '0');
            const theme = NOTE_THEMES[mIdx % NOTE_THEMES.length];
            const isAllCompleted = modDone === moduleChapters.length && modDone > 0;

            return (
              <div 
                key={module.id} 
                className={`border-2 rounded-3xl overflow-hidden transition-all duration-200 shadow-2xs ${theme.bg} ${theme.border}`}
              >
                {/* زر الموديل */}
                <button
                  type="button"
                  onClick={() => toggleModuleAccordion(module.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-right cursor-pointer hover:opacity-95 transition-opacity"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 border ${theme.badge}`}>
                      {stageNum}
                    </span>
                    <div className="truncate">
                      <h2 className="text-sm sm:text-base font-black text-slate-900 truncate" dir="ltr" style={{ textAlign: 'right' }}>
                        {module.title}
                      </h2>
                      <span className="text-xs font-black text-slate-500">
                        {module.semestre} • {moduleChapters.length} دروس
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                      isAllCompleted
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white/80 text-slate-800 border-black/10'
                    }`}>
                      {modDone}/{moduleChapters.length}
                    </span>
                    <div className={`w-7 h-7 rounded-xl bg-white/70 border border-black/5 flex items-center justify-center text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* الدروس وسط الموديل */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border-t-2 divide-y divide-slate-100 overflow-hidden"
                      style={{ borderColor: 'inherit' }}
                    >
                      {moduleChapters.map((chap) => {
                        const isDone = Boolean(completedMap[chap.id]);
                        const hasAccess = canAccessChapter(chap, module.id);

                        return (
                          <div
                            key={chap.id}
                            className={`p-3.5 sm:px-4 flex items-center justify-between gap-3 transition-colors ${
                              isDone ? 'bg-emerald-50/40' : 'hover:bg-slate-50/80'
                            }`}
                          >
                            {/* منطقة النقر: المجاني كيتكوشا، المدفوع كيديه للوايت ليست */}
                            <div
                              onClick={() => toggleChapter(chap, module.id)}
                              className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                            >
                              <button
                                type="button"
                                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : hasAccess
                                      ? 'border-2 border-slate-300 bg-white hover:border-amber-500'
                                      : 'bg-amber-50 text-amber-700 border border-amber-300'
                                }`}
                              >
                                {isDone ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : !hasAccess ? (
                                  <Lock className="w-3.5 h-3.5" />
                                ) : null}
                              </button>

                              <div className="text-right flex-1 min-w-0">
                                <span className={`text-xs sm:text-sm font-black leading-snug block truncate ${
                                  isDone ? 'line-through text-slate-400' : 'text-slate-900'
                                }`}>
                                  {chap.title_ar || chap.title_fr}
                                </span>

                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {isDone ? (
                                    <span className="text-xs font-black text-emerald-700">
                                      تمت المراجعة ✓
                                    </span>
                                  ) : chap.is_free ? (
                                    <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                      🎁 درس مجاني — جرب دابا
                                    </span>
                                  ) : !hasAccess ? (
                                    <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                                      🔒 فصل خاص بالمشتركين (تفعيل عبر CashPlus / واتساب)
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-slate-400">
                                      باقي ما تراجع
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* زر التصفح */}
                            {hasAccess ? (
                              chap.is_free ? (
                                <Link
                                  to={`/viewer/${chap.id}`}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition flex items-center gap-1 shrink-0"
                                >
                                  <span>ابدا الدرس</span>
                                  <ArrowUpLeft className="w-3 h-3" />
                                </Link>
                              ) : (
                                <Link
                                  to={`/viewer/${chap.id}`}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition flex items-center gap-1 shrink-0"
                                >
                                  <span>قرا</span>
                                  <ArrowUpLeft className="w-3 h-3" />
                                </Link>
                              )
                            ) : (
                              <Link
                                to="/waitlist"
                                className="px-3 py-1.5 bg-[#FFB800] hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1 shrink-0 shadow-2xs"
                              >
                                <span>افتح الفصل 🔒</span>
                                <Lock className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* 5. الموديلات القادمة */}
        {upcomingModules.length > 0 && (
          <div className="bg-[#F5EFE0] border-2 border-dashed border-[#D8CEB5] rounded-3xl p-4 text-right">
            <div className="flex items-center gap-2 mb-2.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <h3 className="text-xs font-black text-slate-700">
                موديلات غتوصل قريباً:
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {upcomingModules.map((mod) => (
                <div
                  key={mod.id}
                  className="bg-white/80 border border-[#E2D9C0] px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-600 flex items-center gap-1.5"
                >
                  <span className="text-[10px] font-mono font-black text-amber-700">{mod.semestre}</span>
                  <span>{mod.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}