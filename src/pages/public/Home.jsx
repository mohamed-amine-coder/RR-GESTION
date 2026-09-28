import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Calculator, TrendingUp, GraduationCap, Play, Zap } from 'lucide-react';

import homeImg from '../../assets/rr-team.png';
import teaserImg from '../../assets/teaser.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBFBF7] select-none flex flex-col justify-between overflow-x-hidden" dir="rtl">
      
      {/* 1. Main Hero Section (مضغوط شوية باش يخلي المساحة للتشويقة) */}
      <main className="flex-1 flex items-center justify-center py-6 md:py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-300 px-3 py-1.5 rounded-xl text-[11px] font-black text-amber-800 mb-4 shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              <span>أول منصة تفاعلية لطلبة OFPPT - شعبة TSGE</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.15]">
              Gestion des Entreprises <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                بأسهل وأذكى طريقة ⚡
              </span>
            </h1>

            <p className="text-slate-600 font-bold text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
              فهم مواد التخصص بحال <span className="text-slate-900 font-black">Comptabilité</span>، <span className="text-slate-900 font-black">Management</span>، و <span className="text-slate-900 font-black">Marketing</span> بالدارجة. ملخصات مركزة وتدريب عملي للامتحانات.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link 
                to="/modules"
                className="px-6 py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>استكشف الموديلات</span>
                <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-3px] transition-transform" />
              </Link>

              <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[11px] font-black text-slate-700">مواكبة برنامج TSGE</span>
              </div>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 md:-right-4 bg-white p-2.5 rounded-xl shadow-md border border-slate-100 z-20 flex items-center gap-2"
            >
              <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-black text-slate-400">Module 03</p>
                <p className="text-[11px] font-black text-slate-800" dir="ltr">Comptabilité</p>
              </div>
            </motion.div>

            <div className="relative w-full max-w-[18rem] md:max-w-sm z-10">
              <div className="absolute inset-0 bg-amber-400/20 rounded-[2rem] blur-xl -z-10" />
              <img 
                src={homeImg} 
                alt="RR Gestion Home" 
                className="w-full h-auto object-cover rounded-[2rem] shadow-xl border-4 border-white relative z-10"
              />
            </div>
          </motion.div>

        </div>
      </main>

      {/* 2. Teaser Section (مجموعة ومضغوطة) */}
      <section className="relative w-full bg-[#0B1120] py-8 md:py-10 overflow-hidden border-t-4 border-amber-500">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/10 blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4 md:mb-6"
          >
            <h2 className="text-xl md:text-3xl font-black text-white mb-2 tracking-tight">
              سلسلة الشرح <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">الواقعي 🎬</span>
            </h2>
            <p className="text-slate-400 font-bold text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              سلسلة دروس بأساتذة حقيقيين، متاحة <span className="text-white bg-emerald-600 px-1.5 py-0.5 rounded mx-1 shadow-sm">قريبا</span> لجميع المشتركين.
            </p>
          </motion.div>

          {/* حاوية الصورة المصغرة (صغرنا العرض لـ max-w-2xl باش ينقص الطول) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-2xl mx-auto group cursor-pointer aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-900"
          >
            <img 
              src={teaserImg} 
              alt="Series Teaser" 
              className="absolute inset-0 w-full h-full object-cover transform transition duration-500 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/70" />
            
            <div className="absolute top-4 left-0 right-0 flex flex-col items-center text-center px-4" dir="ltr">
              <span className="bg-rose-600 text-white font-black px-2 py-0.5 rounded text-[9px] uppercase mb-1.5 shadow-md transform -rotate-2">
                Série Exclusive
              </span>
              <h3 
                className="text-white font-black text-xl md:text-3xl uppercase leading-tight" 
                style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
              >
                <span className="text-amber-400">GESTION DES ENTREPRISES</span><br/>
                Kima 3emrek Cheftiha!
              </h3>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950 ml-0.5" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-white font-black text-sm drop-shadow-md">
                    TRAILER OFFICIEL
                  </p>
                  <p className="text-amber-400 font-bold text-[10px] flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> En cours de montage
                  </p>
                </div>
              </div>

              <div className="bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-white font-mono font-bold text-[10px] border border-white/10" dir="ltr">
                10:24
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-5"
          >
            <Link 
              to="/waitlist"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              <span>استفد من السلسلة الآن</span>
            </Link>
          </motion.div>

        </div>
      </section>

    </div>
  );
}