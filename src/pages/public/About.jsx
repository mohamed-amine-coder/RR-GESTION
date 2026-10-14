import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  CheckCircle2,
  Languages,
  MessageCircle,
  Presentation,
  Rocket,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import mrRrImg from '../../assets/mr-rr.png';
import msRrImg from '../../assets/ms-rr.png';
import rrEnglishImg from '../../assets/rr-english-screen.png';
import rrStudentImg from '../../assets/rr-student-screen.png';

const TOC_ITEMS = [
  { id: 'methodology', label: 'المنهجية التعليمية', num: '01' },
  { id: 'expose', label: 'خدمة العروض Exposé', num: '02' },
  { id: 'projects', label: 'المشاريع السابقة', num: '03' },
  { id: 'mascots', label: 'المساعدين التفاعليين', num: '04' },
];

const FEATURES = [
  {
    icon: Languages,
    tag: 'اللغة والشرح',
    title: 'الدارجة والتبسيط العملي',
    desc: 'كنشرحو ليك الكور بدارجة بيضاء واضحة، مع الحفاظ الكامل على المصطلحات التقنية بالفرنسية باش تجاوب نهار الامتحان بثقة وبلا ارتباك.',
    badge: 'bg-white text-sky-800 border-slate-300',
    iconStyle: 'text-sky-700 bg-white',
  },
  {
    icon: BrainCircuit,
    tag: 'طريقة العرض',
    title: 'ميكرو-سلايدز بلا تعقيد',
    desc: 'حيدنا الفيديوهات الطويلة والـ PDF الممل. الدروس مقسمة لشرائح تفاعلية مركزة وسريعة كتخليك تستوعب القاعدة فأقل من دقيقة.',
    badge: 'bg-white text-amber-800 border-slate-300',
    iconStyle: 'text-amber-700 bg-white',
  },
  {
    icon: Target,
    tag: 'التطبيق والتقييم',
    title: 'كويزات وأفخاخ الامتحانات',
    desc: 'مورا كل فكرة كاين سؤال أو فخ امتحان (Exam Trap) كيثبت المعلومة فدماغك وكيوريك الثغرات لي كيطيحو فيها الطلبة عادة.',
    badge: 'bg-white text-emerald-800 border-slate-300',
    iconStyle: 'text-emerald-700 bg-white',
  },
];

const PROJECTS = [
  {
    title: 'RR ENGLISH',
    category: 'Interactive EdTech',
    desc: 'منصة تفاعلية لتعلم الإنجليزية موجهة للمغاربة بشرح دارجة مبسط، شرائح تفاعلية، نظام صوتي، وتتبع حي للنقاط ومستوى التقدم.',
    status: 'متاح حالياً',
    image: rrEnglishImg,
    tags: ['Micro-Slides', 'Audio System', 'Gamified Quiz'],
  },
  {
    title: 'RR STUDENT',
    category: 'University Prep',
    desc: 'منصة متخصصة لطلبة الجامعة لتبسيط دروس البيولوجيا بملخصات مركزة بالدارجة وخرائط ذهنية صُممت خصيصاً لمراجعة الامتحانات.',
    status: 'قصة نجاح',
    image: rrStudentImg,
    tags: ['Mind Maps', 'Summary Cards', 'Exam Prep'],
  },
];

export default function About() {
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
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF7] px-4 py-4 text-slate-900 md:px-6 md:py-8" dir="rtl">
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 z-50 h-1 origin-right bg-amber-500" />

      <div className="mx-auto max-w-5xl space-y-8 pb-24 md:pb-16">
        <div className="sticky top-16 z-30 -mx-4 px-4 py-2.5 md:mx-0 md:px-0">
          <nav className="flex items-center justify-start gap-1.5 overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white/95 p-1.5 shadow-sm backdrop-blur-md sm:justify-center">
            {TOC_ITEMS.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
                    isActive ? 'bg-slate-900 text-amber-300 shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                      isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-700'
                    }`}
                    dir="ltr"
                  >
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-8 pt-2">
          <section id="methodology" className="scroll-mt-36 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-slate-200 pb-5">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-900">
                01 / الركائز الأساسية
              </span>
              <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">منهجية الدراسة فـ RR GESTION</h2>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
                3 ديال المبادئ بنينا عليهم المحتوى باش تفهم بسرعة وماتضيعش الوقت فالامتحانات:
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {FEATURES.map((feat, idx) => {
                const Icon = feat.icon;

                return (
                  <div key={idx} className="flex min-h-[220px] flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-[#FBFBF7] p-5 transition hover:border-amber-300 hover:shadow-md">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 ${feat.iconStyle}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`rounded-md border px-2.5 py-0.5 text-[10px] font-black ${feat.badge}`}>
                          {feat.tag}
                        </span>
                      </div>

                      <h3 className="mb-2 text-base font-black text-slate-900">{feat.title}</h3>
                      <p className="text-sm font-bold leading-relaxed text-slate-600">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section id="expose" className="scroll-mt-36 rounded-[2rem] border border-slate-200 bg-[#F3F6F8] p-6 shadow-sm md:p-8">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-900">
                    <Presentation className="h-3.5 w-3.5 text-sky-700" /> خدمة طلابية احترافية
                  </span>
                  <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">محتاج عرض تقديمي (Exposé) واعر ومتقون؟</h2>
                  <p className="mt-2 max-w-xl text-sm font-bold leading-relaxed text-slate-600 sm:text-base">
                    كنصاوبو ليك عروض تقديمية احترافية بالـ PowerPoint أو بصفحات الويب (Interactive Slides)؛ ديزاين نقي، ألوان متناسقة، وتلخيص ذكي للمحتوى يخليك تقدم قدام الأستاذ بثقة وراحة تامة.
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  {['ديزاين عصري', 'تلخيص الأفكار', 'تسليم سريع'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-900">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6 text-white shadow-lg lg:w-72">
                <span className="mb-3 block text-[10px] font-black uppercase tracking-wider text-slate-400">تسعيرة الخدمة</span>

                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                  <span className="font-semibold text-slate-300">للعموم:</span>
                  <span className="font-black text-slate-100" dir="ltr">15 DH</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-1 text-xs font-black text-amber-400">
                    <Zap className="h-3.5 w-3.5" /> أعضاء المنصة:
                  </span>
                  <span className="text-2xl font-black text-amber-400" dir="ltr">10 DH</span>
                </div>

                <Link
                  to="/waitlist"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-amber-400"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>بغيتي تستافد؟</span>
                </Link>
              </div>
            </div>
          </section>

          <section id="projects" className="scroll-mt-36 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-slate-200 pb-5">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-900">
                03 / سابقة الأعمال
              </span>
              <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">منصات تعليمية بنيناها من قبل</h2>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
                RR GESTION ماشي تجربة أولى، بل امتداد لمشاريع تعليمية حقيقية صممناها باش ترجع القراية ممتعة:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {PROJECTS.map((proj, idx) => (
                <div key={idx} className="flex min-h-[420px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#FBFBF7] shadow-sm">
                  <div className="border-b border-slate-200 bg-slate-100 p-3.5">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-600" dir="ltr">
                        {proj.title.toLowerCase().replace(' ', '')}.vercel.app
                      </span>
                    </div>

                    <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                      <img src={proj.image} alt={proj.title} className="h-full w-full object-contain" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <h3 className="text-base font-black text-slate-900">{proj.title}</h3>
                        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-black text-amber-400">
                          {proj.status}
                        </span>
                      </div>
                      <span className="mb-2 block text-[11px] font-black text-sky-800">{proj.category}</span>
                      <p className="text-sm font-bold leading-relaxed text-slate-600">{proj.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 border-t border-slate-200 pt-3">
                      {proj.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[10px] font-black text-slate-700" dir="ltr">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="mascots" className="scroll-mt-36 rounded-[2rem] border border-slate-200 bg-[#F3F6F8] p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-slate-200 pb-5">
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-900">
                04 / التجربة التفاعلية
              </span>
              <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">شكون كيعاونك وسط الدروس؟</h2>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
                شخصيات RR حاضرين معاك فكل سلايد وكويز باش يحيدو عليك الملل:
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 md:p-5">
                <img src={mrRrImg} alt="Mr RR" className="h-16 w-16 shrink-0 rounded-2xl border-2 border-amber-500 bg-slate-50 object-cover" />
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">Mr. RR</h3>
                    <span className="rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
                      الموجه التقني
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-slate-600">
                    كيعطيك الخلاصة، كيبسط المصطلحات الصعبة، وكينبهك من فخاخ الامتحانات (Traps).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 md:p-5">
                <img src={msRrImg} alt="Ms RR" className="h-16 w-16 shrink-0 rounded-2xl border-2 border-rose-500 bg-slate-50 object-cover" />
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">Ms. RR</h3>
                    <span className="rounded-md border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-900">
                      التطبيق العملي
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-slate-600">
                    كتهتم بالأمثلة الواقعية، التمارين التطبيقية، وكتشجعك وتصحح ليك الخطوات فاش تجاوب.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-4 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-600">واجد تبدا مراجعة مركزة وذكية؟ 🚀</p>
            <Link
              to="/modules"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-8 py-3.5 text-sm font-black text-slate-950 shadow-md shadow-amber-200/40 transition hover:bg-[#f5aa00]"
            >
              <Rocket className="h-4 w-4" />
              <span>اكتشف الموديلات دابا</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <a
            href="https://wa.me/212647400201?text=السلام%20عليكم%20بغيت%20طلب%20Expos%C3%A9%20عند%20RR%20GESTION"
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white"
          >
            <MessageCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>طلب Exposé</span>
          </a>

          <Link
            to="/modules"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-black text-slate-950"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>تصفح الموديلات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

