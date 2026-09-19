import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Home, BookOpen, UserPlus, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // الروابط لي فالوسط
  const centerLinks = [
    { label: 'الرئيسية', path: '/', icon: Home },
    { label: 'الموديلات', path: '/modules', icon: BookOpen },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="w-full bg-[#FBFBF7]/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-4 py-4 md:py-5 select-none" dir="rtl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* اللوجو (أقصى اليمين) */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#FFB800] flex items-center justify-center text-slate-950 font-black shadow-xs">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">
            RR <span className="text-[#FFB800]">GESTION</span>
          </span>
        </Link>

        {/* أزرار التنقل (الوسط) */}
        <div className="hidden md:flex items-center gap-2">
          {centerLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
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

        {/* أزرار أقصى الشمال: التسجيل القبلي + حسابي */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* زر التسجيل القبلي */}
          <Link
            to="/waitlist"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 text-xs md:text-sm font-black rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>التسجيل القبلي</span>
          </Link>

          {/* زر حسابي */}
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs md:text-sm font-black rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>حسابي</span>
          </Link>
        </div>

        {/* زر البرجر للهاتف */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/waitlist"
            className="sm:hidden flex items-center gap-1 px-3 py-2 bg-[#FFB800] text-slate-950 text-xs font-black rounded-xl"
          >
            <span>التسجيل القبلي</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="قائمة التنقل"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
          </button>
        </div>

      </div>

      {/* قائمة الهاتف المنسدلة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
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
                    isActive 
                      ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 space-y-2">
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
                <span>حسابي</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}