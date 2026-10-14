import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const { user, profile, signOut } = useAuth();

  const centerLinks = [
    { label: 'الرئيسية', path: '/', icon: Home },
    { label: 'الموديلات', path: '/modules', icon: BookOpen },
    { label: 'المراجعة', path: '/tracker', icon: CheckCircle2 },
    { label: 'كيفاش كنقراو؟', path: '/about', icon: Sparkles },
  ];

  const isAdmin = profile?.role === 'admin';
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'العضو';
  const isGuest = !user;
  const isFreeUser = Boolean(user) && !isAdmin;

  const closeMenu = () => setIsOpen(false);
  const closeProfile = () => setIsProfileOpen(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      closeProfile();
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        closeProfile();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderProfileTrigger = () => {
    if (isGuest) {
      return (
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800 md:text-sm"
        >
          <User className="h-4 w-4" />
          <span>الحساب</span>
        </Link>
      );
    }

    if (isFreeUser) {
      return (
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-slate-900 shadow-sm transition hover:bg-amber-100 md:text-sm"
        >
          <span>{firstName}</span>
          <span className="rounded-lg bg-[#FFB800] px-2 py-1 text-[10px] font-black text-slate-950">حساب مجاني ⚡</span>
          <ChevronDown className={`h-4 w-4 transition ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setIsProfileOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-slate-900 shadow-sm transition hover:bg-emerald-100 md:text-sm"
      >
        <span>{isAdmin ? 'لوحة التحكم ⚙️' : `${firstName}`}</span>
        <span className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-black text-white">{isAdmin ? 'إدارة' : 'عضو رسمي 🚀'}</span>
        <ChevronDown className={`h-4 w-4 transition ${isProfileOpen ? 'rotate-180' : ''}`} />
      </button>
    );
  };

  const renderUserDropdown = () => {
    if (isGuest) return null;

    if (isFreeUser) {
      return (
        <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-[340px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl">
          <div className="bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900">مرحباً بك {firstName} 👋</p>
                <span className="mt-1 inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-black text-slate-600">النسخة التجريبية</span>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-slate-700">
              كتستافد دابا فقط من الدروس المجانية. باغي تضمن النجاح فـ الامتحانات؟
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">عرض خاص</p>
                  <p className="mt-1 text-base font-black text-slate-900">باقة S1 الكاملة</p>
                </div>
                <div className="rounded-xl bg-[#FFB800] px-2.5 py-1.5 text-xs font-black text-slate-900">مميز</div>
              </div>
              <p className="mt-2 text-xs font-bold text-slate-600">افتح جميع الموديلات بتمارينها وسلايداتها.</p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  closeProfile();
                  navigate('/waitlist');
                }}
                className="w-full rounded-2xl bg-[#FFB800] px-4 py-3 text-sm font-black text-slate-950 shadow-md shadow-amber-200/70 transition hover:bg-[#f5ad00]"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>ترقية الحساب وفتح الدروس 🚀</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeProfile();
                  navigate('/modules');
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-200"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>تصفح الموديلات المقررة 📚</span>
                </span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 px-4 py-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-[320px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl">
        <div className="bg-slate-50 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-900">مرحباً بك يا بطل 🎓</p>
              <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">اشتراك نشط 🟢</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <button
            type="button"
            onClick={() => {
              closeProfile();
              navigate('/modules');
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-right text-sm font-black text-slate-800 transition hover:bg-slate-100"
          >
            <span>متابعة الدروس ⚡</span>
            <ArrowLeft className="h-4 w-4" />
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                closeProfile();
                navigate('/admin');
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-right text-sm font-black text-slate-800 transition hover:bg-slate-100"
            >
              <span>لوحة الإدارة 🛠️</span>
              <LayoutDashboard className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-[#FBFBF7]/90 px-4 py-4 backdrop-blur-md md:py-5" dir="rtl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFB800] text-slate-950 shadow-sm">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            RR <span className="text-[#FFB800]">GESTION</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {centerLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsProfileOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-all ${
                  isActive ? 'bg-slate-200/70 text-slate-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
          <Link
            to="/waitlist"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-black text-slate-950 shadow-sm transition hover:bg-[#f5aa00] md:text-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>انضمام</span>
          </Link>

          <div ref={profileRef} className="relative">
            {renderProfileTrigger()}
            <AnimatePresence>{isProfileOpen && renderUserDropdown()}</AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/waitlist"
            className="inline-flex items-center gap-1 rounded-xl bg-[#FFB800] px-3 py-2 text-[11px] font-black text-slate-950"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>انضمام</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="قائمة التنقل"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 transition hover:bg-slate-200"
          >
            {isOpen ? <X className="h-5 w-5 stroke-[2.5]" /> : <Menu className="h-5 w-5 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="mx-auto mt-3 max-w-5xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-xl md:hidden"
          >
            {centerLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`mb-2 flex items-center gap-2.5 rounded-xl p-3 text-sm font-black ${
                    isActive ? 'border border-amber-200 bg-amber-50 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="space-y-2 border-t border-slate-100 pt-2">
              {isGuest ? (
                <>
                  <Link
                    to="/waitlist"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] px-4 py-3 text-xs font-black text-slate-950"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>اشترك عبر واتساب 💬</span>
                  </Link>

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 text-xs font-black text-white"
                  >
                    <User className="h-4 w-4" />
                    <span>الحساب</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-black text-slate-500">حسابك</p>
                    <p className="mt-1 text-sm font-black text-slate-900">{isAdmin ? 'لوحة التحكم ⚙️' : `${firstName} (${isFreeUser ? 'حساب مجاني' : 'عضو رسمي'})`}</p>
                  </div>

                  {!isFreeUser && (
                    <Link
                      to="/modules"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white"
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>متابعة الدروس ⚡</span>
                    </Link>
                  )}

                  {isFreeUser && (
                    <Link
                      to="/modules"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>تصفح الموديلات 📚</span>
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs font-black text-slate-800"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>لوحة الإدارة</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}