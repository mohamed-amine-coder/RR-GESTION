import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Home, BookOpen, UserPlus, User, Menu, X, ChevronDown, LogOut, Sparkles, ShieldCheck, MessageCircle, ArrowLeft, Crown, GraduationCap, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs md:text-sm font-black rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>الحساب</span>
        </Link>
      );
    }

    if (isFreeUser) {
      return (
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs md:text-sm font-black text-slate-900 shadow-sm transition hover:bg-amber-100"
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
        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs md:text-sm font-black text-slate-900 shadow-sm transition hover:bg-emerald-100"
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
                onClick={() => { closeProfile(); navigate('/waitlist'); }}
                className="w-full rounded-2xl bg-[#FFB800] px-4 py-3 text-sm font-black text-slate-950 shadow-md shadow-amber-200/70 transition hover:bg-[#f5ad00]"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>ترقية الحساب وفتح الدروس 🚀</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => { closeProfile(); navigate('/modules'); }}
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
            onClick={() => { closeProfile(); navigate('/modules'); }}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-right text-sm font-black text-slate-800 transition hover:bg-slate-100"
          >
            <span>متابعة الدروس ⚡</span>
            <ArrowLeft className="h-4 w-4" />
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => { closeProfile(); navigate('/admin'); }}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-right text-sm font-black text-slate-800 transition hover:bg-slate-100"
            >
              <span>لوحة الإدارة 🛠️</span>
              <LayoutDashboard className="h-4 w-4" />
            </button>
          )}

          {/* <a
            href="https://wa.me/212600000000"
            target="_blank"
            rel="noreferrer"
            onClick={closeProfile}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-right text-sm font-black text-slate-800 transition hover:bg-slate-100"
          >
            <span>مساعدة أو استفسار عبر واتساب 💬</span>
            <MessageCircle className="h-4 w-4" />
          </a> */}
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
    <nav className="w-full bg-[#FBFBF7]/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-4 py-4 md:py-5 select-none" dir="rtl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#FFB800] flex items-center justify-center text-slate-950 font-black shadow-xs">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">
            RR <span className="text-[#FFB800]">GESTION</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {centerLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsProfileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all ${
                  isActive
                    ? 'bg-slate-200/70 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {!isGuest && (
            <Link
              to="/waitlist"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 text-xs md:text-sm font-black rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>التسجيل القبلي</span>
            </Link>
          )}

          <div ref={profileRef} className="relative">
            {renderProfileTrigger()}
            <AnimatePresence>
              {isProfileOpen && renderUserDropdown()}
            </AnimatePresence>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          {!isGuest && (
            <Link
              to="/waitlist"
              className="sm:hidden flex items-center gap-1 px-3 py-2 bg-[#FFB800] text-slate-950 text-xs font-black rounded-xl"
            >
              <span>التسجيل القبلي</span>
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="قائمة التنقل"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
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
            className="md:hidden overflow-hidden bg-white border border-slate-200/80 rounded-2xl mt-3 p-4 shadow-xl space-y-2"
          >
            {centerLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-black transition ${
                    isActive ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 space-y-2">
              {isGuest ? (
                <>
                  <Link
                    to="/waitlist"
                    onClick={closeMenu}
                    className="w-full py-3 bg-[#FFB800] text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>التسجيل القبلي</span>
                  </Link>

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="w-full py-3 bg-[#0F172A] text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <User className="w-4 h-4" />
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
                      className="w-full py-3 bg-emerald-600 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-xs"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>متابعة الدروس ⚡</span>
                    </Link>
                  )}

                  {isFreeUser && (
                    <Link
                      to="/modules"
                      onClick={closeMenu}
                      className="w-full py-3 bg-slate-900 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-xs"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>تصفح الموديلات 📚</span>
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="w-full py-3 bg-slate-100 text-slate-800 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-xs"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>لوحة الإدارة</span>
                    </Link>
                  )}

                  {/* <a
                    href="https://wa.me/212600000000"
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeMenu}
                    className="w-full py-3 border border-slate-200 bg-white text-slate-800 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>واتساب 💬</span>
                  </a> */}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-3 border border-slate-200 bg-white text-slate-700 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <LogOut className="w-4 h-4" />
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