import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Briefcase, Calculator, TrendingUp, GraduationCap } from 'lucide-react';
// import homeImg from '../../assets/rr-gestion-home.png';
import homeImg from '../../assets/rr-team.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBFBF7] select-none flex flex-col justify-between overflow-x-hidden" dir="rtl">
      
      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-300 px-4 py-2 rounded-2xl text-xs font-black text-amber-800 mb-6 shadow-xs">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>أول منصة تفاعلية لطلبة OFPPT - شعبة TSGE</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.15]">
              Gestion des Entreprises <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                بأسهل وأذكى طريقة ⚡
              </span>
            </h1>

            <p className="text-slate-600 font-bold text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              فهم مواد التخصص بحال <span className="text-slate-900 font-black">Comptabilité</span>، <span className="text-slate-900 font-black">Management</span>، و <span className="text-slate-900 font-black">Marketing</span> بالدارجة. ملخصات مركزة وتدريب عملي باش توجد للامتحانات (EFM / EFF) ديالك بثقة وبلا تعقيد.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/modules"
                className="px-8 py-4 bg-[#0F172A] hover:bg-slate-800 text-white font-black text-base rounded-2xl shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>استكشف الموديلات المقررة</span>
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-3px] transition-transform" />
              </Link>

              <div className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs font-black text-slate-700">مواكبة شاملة لبرنامج TSGE</span>
              </div>
            </div>

            {/* Features Highlights */}
            {/* <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-200/80 text-center lg:text-right">
              <div>
                <span className="block text-2xl font-black text-slate-900 flex items-center justify-center lg:justify-start gap-2">
                  14+ <Briefcase className="w-5 h-5 text-amber-500" />
                </span>
                <span className="text-xs font-bold text-slate-500">موديل تخصصي</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-900 flex items-center justify-center lg:justify-start gap-2">
                  100% <TrendingUp className="w-5 h-5 text-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-500">شرح بالدارجة</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-900">الدروس</span>
                <span className="text-xs font-bold text-slate-500">محتوى متجدد باستمرار</span>
              </div>
            </div> */}
          </motion.div>

          {/* Image Side with Floating Elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            {/* Floating Badge 1 - Accounting */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 md:-right-8 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-3"
            >
              <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400">Module 03</p>
                <p className="text-xs font-black text-slate-800" dir="ltr">Comptabilité</p>
              </div>
            </motion.div>

            {/* Floating Badge 2 - Marketing */}
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 md:-left-8 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-3"
            >
              <div className="p-2 bg-sky-100 rounded-xl text-sky-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400">Module 07</p>
                <p className="text-xs font-black text-slate-800" dir="ltr">Marketing</p>
              </div>
            </motion.div>

            <div className="relative w-full max-w-md z-10">
              <div className="absolute inset-0 bg-amber-400/20 rounded-[3rem] blur-2xl -z-10" />
              <img 
                src={homeImg} 
                alt="RR Gestion Home" 
                className="w-full h-auto object-cover rounded-[3rem] shadow-2xl border-4 border-white relative z-10"
              />
            </div>
          </motion.div>

        </div>
      </main>

    </div>
  );
}