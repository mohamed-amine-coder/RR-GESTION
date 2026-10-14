import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

import homeImg from '../../assets/rr-team.png';
import teaserImg from '../../assets/teaser.png';

const steps = [
  {
    title: 'جرب فابور بلا حساب',
    description:
      'دخل لأي موديل، غتلقى الفصل الأول مفتوح كامل بالمجان باش تجرب طريقة الشرح السريعة وتختبر راسك فالكويزات.',
    icon: BookOpen,
  },
  {
    title: 'انضم لمجموعات الواتساب المغلقة (VIP)',
    description:
      'مجموعات مصغرة فيها 8 طلبة كحد أقصى، بنات بوحدهم وولاد بوحدهم، كنشاركو فيها الملخصات والتمارين وتناقشهم بكل أريحية وتركيز.',
    icon: Users,
  },
  {
    title: 'خلص بأمان عبر كاش بلوس',
    description:
      'ما محتاجش تخلص أونلاين؛ غير صيفط المبلغ فـ كاش بلوس أو تحويل بنكي، صور لينا التوصيل فواتساب، وحنا كنفعلو ليك الحساب ونصاوبو ليك كلشي فالبلاصة.',
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBFBF7] text-slate-900 select-none overflow-x-hidden" dir="rtl">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <section className="grid items-center gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-800 shadow-sm">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>أول منصة تفاعلية لطلبة OFPPT - شعبة TSGE</span>
            </div>

            <h1 className="mt-4 text-2xl font-black leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              Gestion des Entreprises
              <span className="mt-2 block text-transparent bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text">
                بأسهل وأذكى طريقة ⚡
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm font-bold leading-relaxed text-slate-600 sm:text-base lg:mx-0">
              تخلصك نهائياً من تشتت الفيديوهات الطويلة والـ PDF المعقد عبر{' '}
              <span className="font-black text-slate-900">شرائح تفاعلية قصيرة (Micro-Slides)</span>{' '}
              بالدارجة ومصطلحات الامتحان بالفرنسية.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                to="/modules"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-200/50 transition hover:bg-[#f5aa00]"
              >
                <span>جرب الدروس المجانية دابا (فابور) 🚀</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <Link
                to="/waitlist"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>تواصل واتساب</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="relative lg:col-span-5"
          >
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-2xl shadow-slate-200/80">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 via-transparent to-emerald-200/40" />
              <img src={homeImg} alt="RR Gestion" className="relative z-10 h-auto w-full object-cover" />
            </div>

            <div className="absolute -right-2 top-4 z-20 rounded-2xl border border-slate-200 bg-white p-3 shadow-md sm:-right-4">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-rose-100 p-2 text-rose-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[10px] font-black text-slate-400">Module 03</p>
                  <p className="text-[11px] font-black text-slate-900" dir="ltr">Comptabilité</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-12 rounded-[2rem] bg-[#0F172A] px-5 py-8 text-white shadow-xl shadow-slate-200/60 md:px-8 md:py-10">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">How it works</p>
          </div>

          <h2 className="mt-3 text-xl font-black text-white sm:text-2xl">
            كيفاش تقرا وتستافد فـ 3 خطوات بسيطة؟
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right shadow-inner shadow-slate-900/30"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-base font-black text-white">{title}</h3>
                <p className="mt-2 text-sm font-bold leading-relaxed text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 md:p-8">
          <div className="flex items-center gap-2 text-amber-700">
            <Users className="h-4 w-4" />
            <p className="text-xs font-black uppercase tracking-[0.18em]">VIP Groups</p>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                مجموعات الواتساب المغلقة والتمارين
              </h2>
              <p className="mt-3 text-sm font-bold leading-relaxed text-slate-600 sm:text-base">
                أقصى حد 8 أفراد، عزل تام بنات/أولاد، متابعة مباشرة وتمارين تطبيقية للامتحانات EFM و EFF بعيداً عن ضوضاء الكروبات الكبيرة.
              </p>
            </div>

            <div className="rounded-2xl bg-[#0F172A] p-4 text-white shadow-lg shadow-slate-200/70">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">المجموعة</p>
                  <p className="mt-1 text-base font-black text-white">VIP Review</p>
                </div>
                <div className="rounded-xl bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-300">
                  8 max
                </div>
              </div>

              <ul className="mt-4 space-y-2.5">
                {[
                  'ملخصات موجهة حسب البرنامج',
                  'تمارين تصحيحية كل أسبوع',
                  'مراجعة سريعة مع أسئلة امتحانية',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-bold text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <section className="relative overflow-hidden border-t border-slate-200 bg-[#0F172A] py-10 md:py-14">
        <div className="absolute inset-x-0 top-0 h-24 bg-amber-500/10 blur-[100px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-xl font-black text-white sm:text-2xl">
              سلسلة الشرح <span className="text-amber-400">الواقعي 🎬</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-slate-300 sm:text-base">
              شرح عملي، قصير، وواضح، مع تمارين حقيقية ومواكبة مباشرة للامتحان.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="relative mx-auto mt-6 max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl"
          >
            <img src={teaserImg} alt="Teaser RR Gestion" className="h-64 w-full object-cover md:h-[420px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/20" />
            <div className="absolute left-0 right-0 top-5 flex flex-col items-center px-4 text-center">
              <span className="rounded-full bg-rose-600 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Série Exclusive
              </span>
              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl md:text-3xl">
                GESTION DES ENTREPRISES
              </h3>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(255,184,0,0.5)]">
                  <Zap className="h-5 w-5 fill-current" />
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-black text-white">TRAILER OFFICIEL</p>
                  <p className="text-[10px] font-bold text-amber-300">قريباً على المنصة</p>
                </div>
              </div>

              <div className="rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[10px] font-black text-white">
                10:24
              </div>
            </div>
          </motion.div>

          <div className="mt-6 text-center">
            <Link
              to="/waitlist"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-200/30 transition hover:bg-[#f6a900]"
            >
              <Zap className="h-4 w-4" />
              <span>استفد من السلسلة الآن</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
