import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, ShieldCheck } from 'lucide-react';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide 1: مقدمة عامة على Anthropic
  const SlideOne = () => (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-center">
      {/* Badge / العنوان الصغير */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Découverte Entrepreneuriale</span>
      </div>

      {/* العنوان الرئيسي */}
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Anthropic & Claude
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          قصة الشركة الناشئة اللي خرجات من قلب معركة الذكاء الاصطناعي باش تبني أذكى وأأمن نظام فـ العالم.
        </p>
      </div>

      {/* كارت بروفايل الشركة بصورة حقيقية للمؤسسين */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 text-left shadow-2xl">
        <div className="w-full md:w-1/2 h-56 rounded-2xl overflow-hidden border border-slate-700/60 shrink-0">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Dario_Amodei_at_the_UK_AI_Safety_Summit_%28cropped%29.jpg/640px-Dario_Amodei_at_the_UK_AI_Safety_Summit_%28cropped%29.jpg" 
            alt="Dario Amodei" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 w-full">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              L'Entreprise & Les Fondateurs
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Dario & Daniela Amodei
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Fondée en 2021 • San Francisco, Californie
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            شركة أبحاث أمريكية متخصصة فـ الذكاء الاصطناعي التوليدي، أسسوها علماء كانو قياديين فـ OpenAI بهدف واحد: تطوير نماذج خارقة للذكاء الاصطناعي مع ضمان أعلى معايير الأمان والأخلاق.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-medium">
              🤖 Produit phare: Claude
            </span>
            <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Constitutional AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <main className="flex-1 flex items-center justify-center">
        {currentSlide === 0 && <SlideOne />}
      </main>

      {/* سهم التنقل */}
      <footer className="w-full max-w-4xl mx-auto flex justify-between items-center pt-4 border-t border-slate-800/60">
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Slide {currentSlide + 1}
        </span>

        <button
          onClick={() => setCurrentSlide((prev) => prev + 1)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};

export default Presentation;