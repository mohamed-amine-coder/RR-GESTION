import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, BrainCircuit, Target, Languages, 
  Rocket, Monitor, CheckCircle2, Presentation, MessageCircle,
  Clock, Zap
} from 'lucide-react';
import mrRrImg from '../../assets/mr-rr.png';
import msRrImg from '../../assets/ms-rr.png';
import rrEnglishImg from '../../assets/rr-english-screen.png';
import rrStudentImg from '../../assets/rr-student-screen.png';

const TOC_ITEMS = [
  { id: 'methodology', label: 'المنهجية التعليمية', num: '01' },
  { id: 'expose', label: 'خدمة العروض Exposé', num: '02' },
  { id: 'projects', label: 'المشاريع السابقة', num: '03' },
  { id: 'mascots', label: 'المساعدين التفاعليين', num: '04' }
];

const FEATURES = [
  {
    icon: Languages,
    tag: 'اللغة والشرح',
    title: 'الدارجة والتبسيط العملي',
    desc: 'كنشرحو ليك الكور بدارجة بيضاء واضحة، مع الحفاظ الكامل على المصطلحات التقنية بالفرنسية باش تجاوب نهار الامتحان بثقة وبلا ارتباك.',
    badge: 'bg-white text-sky-800 border-slate-300',
    iconStyle: 'text-sky-700 bg-white'
  },
  {
    icon: BrainCircuit,
    tag: 'طريقة العرض',
    title: 'ميكرو-سلايدز بلا تعقيد',
    desc: 'حيدنا الفيديوهات الطويلة والـ PDF الممل. الدروس مقسمة لشرائح تفاعلية مركزة وسريعة كتخليك تستوعب القاعدة فأقل من دقيقة.',
    badge: 'bg-white text-amber-800 border-slate-300',
    iconStyle: 'text-amber-700 bg-white'
  },
  {
    icon: Target,
    tag: 'التطبيق والتقييم',
    title: 'كويزات وأفخاخ الامتحانات',
    desc: 'مورا كل فكرة كاين سؤال أو فخ امتحان (Exam Trap) كيثبت المعلومة فدماغك وكيوريك الثغرات لي كيطيحو فيها الطلبة عادة.',
    badge: 'bg-white text-emerald-800 border-slate-300',
    iconStyle: 'text-emerald-700 bg-white'
  }
];

const PROJECTS = [
  {
    title: 'RR ENGLISH',
    category: 'Interactive EdTech',
    desc: 'منصة تفاعلية لتعلم الإنجليزية موجهة للمغاربة بشرح دارجة مبسط، شرائح تفاعلية، نظام صوتي، وتتبع حي للنقاط ومستوى التقدم.',
    status: 'متاح حالياً',
    image: rrEnglishImg,
    tags: ['Micro-Slides', 'Audio System', 'Gamified Quiz']
  },
  {
    title: 'RR STUDENT',
    category: 'University Prep',
    desc: 'منصة متخصصة لطلبة الجامعة لتبسيط دروس البيولوجيا بملخصات مركزة بالدارجة وخرائط ذهنية صُممت خصيصاً لمراجعة الامتحانات.',
    status: 'قصة نجاح',
    image: rrStudentImg,
    tags: ['Mind Maps', 'Summary Cards', 'Exam Prep']
  }
];

export default function About() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('methodology');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );

    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -140;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 p-4 md:p-8 font-[family-name:var(--font-tajawal)]" dir="rtl">
      
      {/* مؤشر السكرول */}
      <motion.div style={{ scaleX }} className="fixed top-0 right-0 left-0 h-1 bg-amber-500 origin-right z-50" />

      <div className="max-w-5xl mx-auto space-y-6 pb-28 md:pb-16">
        
        {/* ============ Header ============ */}
        {/* <header className="flex items-center justify-between border-b border-slate-300 pb-6 pt-2">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 bg-white border border-slate-300 hover:border-slate-400 rounded-2xl flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
              aria-label="رجوع"
            >
              <ArrowRight className="w-5 h-5 text-slate-800" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
                  كيفاش كنقراو؟
                </h1>
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-600 mt-1">
                المنهجية الذكية، فلسفة التعلم السريع، والخدمات التفاعلية لمنصة RR
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs font-black text-slate-950 bg-amber-200 border border-amber-400 px-3 py-1 rounded-xl">
              OFPPT • TSGE
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <Clock className="w-3.5 h-3.5" /> قراءة سريعة: 2 دقائق ☕
            </span>
          </div>
        </header> */}

        {/* ============ Top Sticky Navigation ============ */}
        <div className="sticky top-16 md:top-20 z-30 py-2.5 -mx-4 px-4 md:mx-0 md:px-0">
          <nav className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-1.5 shadow-sm flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar">
            {TOC_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 text-amber-400 shadow-sm' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`} dir="ltr">
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ============ Content Sections (خلفية رمادية صلبة bg-[#E8EAEF]) ============ */}
        <div className="space-y-8 pt-2">
          
          {/* 01. Methodology */}
          <section id="methodology" className="bg-[#E8EAEF] border border-slate-300/90 rounded-3xl p-6 md:p-8 shadow-xs scroll-mt-36">
            <div className="border-b border-slate-300 pb-5 mb-6">
              <span className="text-[11px] font-black text-slate-900 bg-white border border-slate-300 px-3 py-1 rounded-full uppercase tracking-wider">
                01 / الركائز الأساسية
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-950 mt-2.5">
                منهجية الدراسة فـ RR GESTION
              </h2>
              <p className="text-xs md:text-sm text-slate-700 mt-1 font-bold">
                3 ديال المبادئ بنينا عليهم المحتوى باش تفهم بسرعة وماتضيعش الوقت فالامتحانات:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {FEATURES.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl border border-slate-300/80 bg-white hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${feat.iconStyle} border border-slate-300 flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${feat.badge}`}>
                          {feat.tag}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-950 text-sm md:text-base mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 02. Exposé Service */}
          <section id="expose" className="bg-[#E8EAEF] border border-slate-300/90 rounded-3xl p-6 md:p-8 shadow-xs scroll-mt-36">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              <div className="flex-1 space-y-4">
                <div>
                  <span className="text-[11px] font-black text-slate-900 bg-white border border-slate-300 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                    <Presentation className="w-3.5 h-3.5 text-sky-700" /> خدمة طلابية احترافية
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-950 mt-2.5">
                    محتاج عرض تقديمي (Exposé) واعر ومتقون؟
                  </h2>
                  <p className="text-xs md:text-sm text-slate-700 mt-2 leading-relaxed font-bold max-w-xl">
                    كنصاوبو ليك عروض تقديمية احترافية بالـ PowerPoint أو بصفحات الويب (Interactive Slides)؛ ديزاين نقي، ألوان متناسقة، وتلخيص ذكي للمحتوى يخليك تقدم قدام الأستاذ بثقة وراحة تامة.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ديزاين عصري</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>تلخيص الأفكار</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>تسليم سريع</span>
                  </div>
                </div>
              </div>

              {/* بطاقة السعر */}
              <div className="w-full lg:w-72 shrink-0 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md text-center">
                <span className="text-[10px] font-black text-slate-400 tracking-wider block mb-3 uppercase">
                  تسعيرة الخدمة
                </span>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="text-slate-300 font-semibold">للعموم:</span>
                  <span className="text-base font-bold text-slate-100" dir="ltr">15 DH</span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> أعضاء المنصة:
                  </span>
                  <span className="text-2xl font-black text-amber-400" dir="ltr">10 DH</span>
                </div>

                <Link
                  to="/waitlist"
                  className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>بغيتي تستافد ؟</span>
                </Link>
              </div>

            </div>
          </section>

          {/* 03. Previous Projects */}
          <section id="projects" className="bg-[#E8EAEF] border border-slate-300/90 rounded-3xl p-6 md:p-8 shadow-xs scroll-mt-36">
            <div className="border-b border-slate-300 pb-5 mb-6">
              <span className="text-[11px] font-black text-slate-900 bg-white border border-slate-300 px-3 py-1 rounded-full uppercase tracking-wider">
                03 / سابقة الأعمال
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-950 mt-2.5">
                منصات تعليمية بنيناها من قبل
              </h2>
              <p className="text-xs md:text-sm text-slate-700 mt-1 font-bold">
                RR GESTION ماشي تجربة أولى، بل امتداد لمشاريع تعليمية حقيقية صممناها باش ترجع القراية ممتعة:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {PROJECTS.map((proj, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-300 bg-white hover:border-slate-400 transition-all overflow-hidden flex flex-col justify-between shadow-2xs">
                  <div className="p-3.5 bg-slate-100 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-600" dir="ltr">
                        {proj.title.toLowerCase().replace(' ', '')}.web.app
                      </span>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-300 bg-white p-2 h-44 flex items-center justify-center">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-black text-slate-950 text-base">{proj.title}</h3>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400">
                          {proj.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-sky-800 block mb-2">{proj.category}</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">{proj.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200">
                      {proj.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-md" dir="ltr">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 04. Mascots */}
          <section id="mascots" className="bg-[#E8EAEF] border border-slate-300/90 rounded-3xl p-6 md:p-8 shadow-xs scroll-mt-36">
            <div className="border-b border-slate-300 pb-5 mb-6">
              <span className="text-[11px] font-black text-slate-900 bg-white border border-slate-300 px-3 py-1 rounded-full uppercase tracking-wider">
                04 / التجربة التفاعلية
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-950 mt-2.5">
                شكون كيعاونك وسط الدروس؟
              </h2>
              <p className="text-xs md:text-sm text-slate-700 mt-1 font-bold">
                شخصيات RR حاضرين معاك فكل سلايد وكويز باش يحيدو عليك الملل:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-4 md:p-5 rounded-2xl border border-slate-300 bg-white flex items-center gap-4 shadow-2xs">
                <img
                  src={mrRrImg}
                  alt="Mr RR"
                  className="w-16 h-16 object-cover rounded-2xl border-2 border-amber-500 bg-slate-50 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-base text-slate-950">Mr. RR</h3>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">الموجه التقني</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    كيعطيك الخلاصة، كيبسط المصطلحات الصعبة، وكينبهك من فخاخ الامتحانات (Traps).
                  </p>
                </div>
              </div>

              <div className="p-4 md:p-5 rounded-2xl border border-slate-300 bg-white flex items-center gap-4 shadow-2xs">
                <img
                  src={msRrImg}
                  alt="Ms RR"
                  className="w-16 h-16 object-cover rounded-2xl border-2 border-rose-500 bg-slate-50 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-base text-slate-950">Ms. RR</h3>
                    <span className="text-[10px] font-bold text-rose-900 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-md">التطبيق العملي</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    كتهتم بالأمثلة الواقعية، التمارين التطبيقية، وكتشجعك وتصحح ليك الخطوات فاش تجاوب.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final Call to Action */}
          <div className="text-center pt-4">
            <p className="text-xs font-bold text-slate-600 mb-3">
              واجد تبدا مراجعة مركزة وذكية؟ 🚀
            </p>
            <Link
              to="/modules"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl transition shadow-md shadow-amber-200/50 cursor-pointer active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              <span>اكتشف الموديلات دابا</span>
            </Link>
          </div>

        </div>

      </div>

      {/* ============ Mobile Sticky Action Bar ============ */}
      <div className="fixed bottom-0 inset-x-0 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-300 p-3 z-40">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <a
            href="https://wa.me/212600000000?text=%D8%B3%D9%84%D8%A7%D9%85%D8%8C%20%D8%A8%D8%BA%D9%8A%D8%AA%20%D9%86%D8%B5%D8%A7%D9%88%D8%A8%20%D8%B9%D8%B1%D8%B6%20%D8%AA%D9%82%D8%AF%D9%8A%D9%85%D9%8A%20(Expos%C3%A9)%20%D9%85%D8%B9%20RR%20GESTION"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>طلب Exposé</span>
          </a>
          <Link
            to="/modules"
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>تصفح الموديلات</span>
          </Link>
        </div>
      </div>

    </div>
  );
}