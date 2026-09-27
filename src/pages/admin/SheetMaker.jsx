import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
  AlertOctagon,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  CircleHelp,
  Download,
  FileJson,
  Globe2,
  GraduationCap,
  Layers3,
  Lightbulb,
  ListOrdered,
  Loader2,
  LockKeyhole,
  PenTool,
  RefreshCcw,
  Scale,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  Zap,
  List
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                               CONFIGURATION                                */
/* -------------------------------------------------------------------------- */

const PAGE_WIDTH = 1080;
const PAGE_MIN_HEIGHT = 1350;

const BRAND = {
  amber: '#FFB800',
  dark: '#0F172A',
  paper: '#FBFBF7',
  dots: '#CBD5E1',
};

const DEFAULT_CTA = 'راجع الدرس كامل وتمرّن أكثر فالمنصة';
const DEFAULT_WEBSITE = 'rrgestion.vercel.app';
const DEFAULT_COHORT = 'TSGE 2026/2027';

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function textOr(value, fallback = '') {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  return fallback;
}
function slugify(text) {
  return text
    .toString()
    .trim()
    .replace(/\s+/g, '_')           // تعويض المسافات بـ _
    .replace(/[^\w\u0600-\u06FF-]/g, '') // الحفاظ على الحروف العربية، اللاتينية والأرقام
    .replace(/\_\_+/g, '_');         // مسح التكرار ديال _
}

function RichText({ html, className = '', dir = 'auto' }) {
  return (
    <div
      dir={dir}
      className={className}
      dangerouslySetInnerHTML={{ __html: textOr(html) }}
    />
  );
}

function validateSheetData(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['الـ JSON الرئيسي خاصو يكون Object.'];
  if (!data.ficheNumber) errors.push('ficheNumber ناقص.');
  if (!textOr(data.chapter)) errors.push('chapter ناقص.');
  if (!Array.isArray(data.pages)) {
    errors.push('pages خاصها تكون Array.');
  } else if (data.pages.length === 0) {
    errors.push('pages ما خاصهاش تكون فارغة.');
  }

  if (Array.isArray(data.pages)) {
    data.pages.forEach((page, pageIndex) => {
      if (!page || typeof page !== 'object') {
        errors.push(`Page ${pageIndex + 1}: خاصها تكون Object.`);
        return;
      }
      if (!Array.isArray(page.blocks)) {
        errors.push(`Page ${pageIndex + 1}: blocks خاصها تكون Array.`);
      }
    });
  }
  return errors;
}

function normalizeSheetData(data) {
  return {
    ficheNumber: data.ficheNumber ?? '01',
    tag: textOr(data.tag, 'FICHE VIP'),
    chapter: textOr(data.chapter, 'Chapitre sans titre'),
    subtitle: textOr(data.subtitle),
    cta: textOr(data.cta, DEFAULT_CTA),
    website: textOr(data.website, DEFAULT_WEBSITE),
    cohort: textOr(data.cohort, DEFAULT_COHORT),
    pages: asArray(data.pages).map((page, index) => ({
      ...page,
      pageNumber: page.pageNumber ?? index + 1,
      blocks: asArray(page.blocks),
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*                             REUSABLE COMPONENTS                            */
/* -------------------------------------------------------------------------- */

function BlockTitle({ icon: Icon, title, iconClassName = 'text-amber-500', titleClassName = 'text-slate-900' }) {
  if (!title) return null;
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className={cn('h-5 w-5 shrink-0', iconClassName)} />}
      <h3 className={cn('text-[18px] font-black leading-tight', titleClassName)}>
        {title}
      </h3>
    </div>
  );
}

// 1. TL;DR Block (الزبدة)
function TldrBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border border-blue-200 border-r-[5px] border-r-blue-500 bg-blue-50/90 p-5 shadow-sm">
      <BlockTitle icon={List} title={block.title || 'كيفاش البلان؟'} iconClassName="text-blue-600" titleClassName="text-blue-900" />
      <ul className="flex flex-col gap-2 pl-4">
        {asArray(block.points).map((point, index) => (
          <li key={index} className="flex items-start gap-2 text-[15px] font-bold leading-[1.6] text-slate-800">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <RichText html={point} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// 2. Pro Tip Block (نصيحة للمحترفين)
function ProTipBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-[20px] border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
      <BlockTitle icon={Lightbulb} title={block.title || 'Astuce Pro'} iconClassName="text-amber-600" titleClassName="text-amber-900" />
      <RichText html={block.content} className="text-[15px] font-bold leading-[1.6] text-slate-800" />
    </section>
  );
}

// 3. Mini Case Block (دراسة حالة مصغرة)
function MiniCaseBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border border-slate-300 bg-white p-5 shadow-sm">
      <BlockTitle icon={BriefcaseBusiness} title={block.title || 'Cas Pratique'} iconClassName="text-slate-600" />
      <div className="rounded-xl bg-slate-100 p-4 text-[15px] font-bold leading-[1.6] text-slate-700 border-l-4 border-slate-400">
        <RichText html={block.context} />
      </div>
      {block.question && (
        <div className="text-[15px] font-black text-slate-900">
          <RichText html={block.question} />
        </div>
      )}
    </section>
  );
}

function ScenarioBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border border-emerald-200 border-r-[5px] border-r-emerald-500 bg-emerald-50/90 p-5 shadow-sm">
      <BlockTitle icon={Globe2} title={block.title || 'من الواقع'} iconClassName="text-emerald-600" titleClassName="text-emerald-900" />
      <RichText html={block.content} className="text-[17px] font-bold leading-[1.6] text-slate-800" />
    </section>
  );
}

function DeepExplanationBlock({ block }) {
  const paragraphs = asArray(block.paragraphs);
  return (
    <section className="flex w-full flex-col gap-3 rounded-[20px] border border-slate-200 border-r-[5px] border-r-amber-400 bg-white/95 p-5 shadow-sm">
      <BlockTitle icon={BookOpen} title={block.title || 'شرح مركز'} />
      <div className="flex flex-col gap-2">
        {paragraphs.map((paragraph, index) => (
          <RichText key={index} html={paragraph} className="text-[16px] font-bold leading-[1.6] text-slate-700" />
        ))}
      </div>
    </section>
  );
}

function TermsBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border border-slate-200 bg-white/95 p-5 shadow-sm">
      <BlockTitle icon={GraduationCap} title={block.title || 'المصطلحات المهمة'} />
      <div className="grid grid-cols-2 gap-3">
        {asArray(block.items).map((term, index) => (
          <div key={index} className="grid min-h-[60px] grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-[15px] font-black leading-snug text-slate-800">{term.ar}</span>
            <span dir="ltr" className="max-w-[200px] rounded-lg bg-amber-100 px-2 py-1 text-left text-[14px] font-black leading-snug text-amber-800">
              {term.fr}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FormulaBlock({ block }) {
  return (
    <section className="flex w-full flex-col items-center gap-4 rounded-[20px] border border-slate-800 bg-[#0F172A] p-5 text-center shadow-lg">
      <BlockTitle icon={Calculator} title={block.title || 'Formule'} iconClassName="text-amber-400" titleClassName="text-white" />
      <div dir="ltr" className="w-full rounded-xl bg-white px-5 py-4 shadow-inner">
        <RichText html={block.formula} dir="ltr" className="text-center text-[28px] font-black leading-tight tracking-wide text-slate-950" />
      </div>
      {asArray(block.legend).length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {block.legend.map((item, index) => (
            <div key={index} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[13px] font-bold leading-relaxed text-slate-300">
              <span dir="ltr" className="font-black text-amber-400">{item.sym}</span>
              <span> = {item.desc}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function WorkedExampleBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border border-slate-200 bg-slate-50/95 p-5 shadow-sm">
      <BlockTitle icon={PenTool} title={block.title || 'Exemple corrigé'} iconClassName="text-emerald-600" />
      {block.context && (
        <div dir={block.contextDir || 'ltr'} className="rounded-xl border border-emerald-200 border-l-[4px] border-l-emerald-500 bg-white p-4 text-[15px] font-bold leading-[1.6] text-slate-700">
          {block.context}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {asArray(block.steps).map((step, index) => {
          const stepContent = typeof step === 'string' ? step : step?.content;
          return (
            <div key={index} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[14px] font-black text-emerald-700">
                {index + 1}
              </span>
              <RichText html={stepContent} className="flex-1 text-[15px] font-bold leading-[1.6] text-slate-800" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StepByStepBlock({ block }) {
  const steps = asArray(block.steps);
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border border-sky-200 bg-sky-50/80 p-5 shadow-sm">
      <BlockTitle icon={ListOrdered} title={block.title || 'كيفاش كتدوز العملية؟'} iconClassName="text-sky-600" />
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => {
          const title = typeof step === 'string' ? `Étape ${index + 1}` : textOr(step.title, `Étape ${index + 1}`);
          const content = typeof step === 'string' ? step : textOr(step.content);
          return (
            <div key={index} className="grid grid-cols-[40px_1fr] items-stretch gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-[16px] font-black text-white shadow-sm">
                  {index + 1}
                </div>
                {index < steps.length - 1 && <div className="min-h-4 w-[2px] flex-1 bg-sky-200" />}
              </div>
              <div className="flex flex-col gap-1 rounded-xl border border-sky-200 bg-white px-4 py-3">
                <p className="text-[15px] font-black text-sky-900">{title}</p>
                <RichText html={content} className="text-[15px] font-bold leading-[1.5] text-slate-700" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FrenchSummaryBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-[20px] border border-indigo-200 bg-indigo-50/40 p-5 shadow-sm" dir="ltr">
      <BlockTitle 
        icon={BookOpen} 
        title={block.title || 'Résumé Essentiel'} 
        iconClassName="text-indigo-600" 
        titleClassName="text-indigo-900" 
      />
      <div className="flex flex-col gap-2">
        {asArray(block.paragraphs).map((paragraph, index) => (
          <RichText 
            key={index} 
            html={paragraph} 
            className="text-[14px] font-bold leading-[1.6] text-slate-700 text-left" 
            dir="ltr" 
          />
        ))}
      </div>
    </section>
  );
}

function FullCaseStudyBlock({ block }) {
  const isFr = block.lang === 'fr';
  const direction = isFr ? 'ltr' : 'rtl';
  const textAlign = isFr ? 'text-left' : 'text-right';

  return (
    <section 
      dir={direction}
      className={cn(
        "flex w-full flex-col gap-4 rounded-[22px] border-[3px] border-slate-950 bg-[#FFB800] p-5 shadow-md",
        textAlign
      )}
    >
      <div className={cn("flex items-center gap-2", isFr ? "flex-row" : "flex-row-reverse justify-end")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
          <BriefcaseBusiness className="h-4 w-4 shrink-0" />
        </div>
        <h3 className="text-[17px] font-black leading-tight text-slate-950">
          {block.title || (isFr ? 'Étude de Cas' : 'دراسة حالة')}
        </h3>
      </div>

      {block.context && (
        <div className={cn(
          "rounded-xl bg-white p-4 text-[14px] font-bold leading-[1.6] text-slate-900 border-slate-950 shadow-sm",
          isFr ? "border-l-[5px]" : "border-r-[5px]"
        )}>
          <RichText html={block.context} dir={direction} />
        </div>
      )}

      {asArray(block.questions).length > 0 && (
        <div className="flex flex-col gap-2.5 mt-1">
          <h4 className="text-[15px] font-black text-slate-950">
            {block.questionsTitle || (isFr ? 'Travail à faire :' : 'المطلوب :')}
          </h4>
          <div className="flex flex-col gap-2">
            {block.questions.map((q, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[14px] font-black text-slate-950">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[11px] font-black text-amber-400 mt-0.5">
                  {i + 1}
                </span>
                <RichText html={q} className="flex-1 font-bold text-slate-950" dir={direction} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function BilingualSummaryBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-[20px] border border-indigo-200 bg-indigo-50/30 p-5 shadow-sm">
      <BlockTitle 
        icon={BookOpen} 
        title={block.title || 'الملخص الأكاديمي • Synthèse de Cours'} 
        iconClassName="text-indigo-600" 
        titleClassName="text-indigo-950" 
      />
      
      <div className="grid grid-cols-2 gap-4 mt-1">
        <div dir="ltr" className="flex flex-col gap-2 rounded-xl border border-indigo-100 bg-white p-4 text-left">
          <span className="text-[12px] font-black tracking-wide text-indigo-700 uppercase">Version Académique (FR)</span>
          {asArray(block.frParagraphs).map((p, i) => (
            <RichText key={i} html={p} dir="ltr" className="text-[13px] font-bold leading-[1.6] text-slate-700" />
          ))}
        </div>

        <div dir="rtl" className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 text-right">
          <span className="text-[12px] font-black tracking-wide text-amber-600 uppercase">خلاصة بالدارجة (Compréhension)</span>
          {asArray(block.arParagraphs).map((p, i) => (
            <RichText key={i} html={p} dir="rtl" className="text-[13px] font-bold leading-[1.6] text-slate-700" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonBlock({ block }) {
  const left = block.a || block.left || {};
  const right = block.b || block.right || {};
  const renderSide = (data, type) => {
    const isNegative = type === 'negative';
    return (
      <div className={cn('flex min-h-[200px] flex-col gap-3 rounded-[20px] border-[2px] p-4', isNegative ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50')}>
        <div className="flex items-center gap-2">
          {isNegative ? <XCircle className="h-5 w-5 shrink-0 text-rose-600" /> : <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />}
          <h4 dir={data.dir || 'auto'} className={cn('text-[18px] font-black leading-tight', isNegative ? 'text-rose-800' : 'text-emerald-800')}>
            {data.title}
          </h4>
        </div>
        {data.description && <RichText html={data.description} dir={data.dir || 'auto'} className="text-[15px] font-bold leading-[1.5] text-slate-700" />}
        <div className="flex flex-col gap-1.5">
          {asArray(data.points).map((point, index) => (
            <div key={index} className="flex items-start gap-2 text-[14px] font-bold leading-[1.5] text-slate-700">
              <span className={cn('translate-y-[6px] h-1.5 w-1.5 shrink-0 rounded-full', isNegative ? 'bg-rose-500' : 'bg-emerald-500')} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border border-slate-200 bg-white/95 p-5 shadow-sm">
      <BlockTitle icon={Scale} title={block.title || 'شنو الفرق؟'} />
      <div className="relative grid grid-cols-2 gap-4">
        {renderSide(left, 'negative')}
        {renderSide(right, 'positive')}
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-slate-900 text-[14px] font-black text-amber-400 shadow-lg">
          VS
        </div>
      </div>
    </section>
  );
}

function TrapBlock({ block }) {
  return (
    <section className="relative flex w-full flex-col gap-2 rounded-[20px] border-[2px] border-rose-300 bg-[#FFF1F2] p-5 shadow-sm">
      <div className="absolute -top-3 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
        <AlertOctagon className="h-5 w-5" />
      </div>
      <BlockTitle icon={Target} title={block.title || "Piège d'examen"} iconClassName="text-rose-600" titleClassName="text-rose-800" />
      <RichText html={block.content} className="text-[15px] font-bold leading-[1.6] text-rose-950" />
    </section>
  );
}

function QuizBlock({ block }) {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  return (
    <section className="relative flex w-full flex-col gap-4 overflow-hidden rounded-[20px] border border-indigo-200 bg-indigo-50/95 p-5 shadow-sm">
      <CircleHelp className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 text-indigo-900 opacity-[0.04]" />
      <BlockTitle icon={CircleHelp} title={block.title || 'Challenge'} iconClassName="text-indigo-600" titleClassName="text-indigo-950" />
      <RichText html={block.question} className="relative z-10 text-[17px] font-black leading-[1.6] text-indigo-950" />
      <div className="relative z-10 grid grid-cols-2 gap-2.5">
        {asArray(block.options).map((option, index) => (
          <div key={index} className="flex min-h-[50px] items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-indigo-300 text-[12px] font-black text-indigo-700">
              {letters[index] || index + 1}
            </span>
            <span dir="auto" className="text-[14px] font-black leading-snug text-slate-700">
              {option}
            </span>
          </div>
        ))}
      </div>
      {block.cliffhanger && (
        <div className="relative z-10 rounded-lg bg-indigo-600 px-3 py-2 text-center text-[14px] font-black text-white">
          {block.cliffhanger}
        </div>
      )}
    </section>
  );
}

// البلوك الجديد: TableBlock
function TableBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border border-slate-200 bg-white/95 p-5 shadow-sm">
      <BlockTitle icon={List} title={block.title || 'Tableau'} />
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-center">
          {block.headers && block.headers.length > 0 && (
            <thead className="bg-slate-900 text-white">
              <tr>
                {asArray(block.headers).map((header, i) => (
                  <th key={i} className="border-x border-slate-700 p-3 text-[15px] font-black align-middle last:border-l-0 first:border-r-0">
                    <RichText html={header} className="inline-block w-full text-center" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {asArray(block.rows).map((row, i) => (
              <tr key={i} className="border-b border-slate-200 last:border-0 even:bg-slate-50">
                {asArray(row).map((cell, j) => (
                  <td key={j} className="border-x border-slate-200 p-3 text-[14px] font-bold text-slate-700 align-middle last:border-l-0 first:border-r-0">
                    <RichText html={cell} className="inline-block w-full text-center" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DYNAMIC ENGINE                                */
/* -------------------------------------------------------------------------- */

function SheetBlock({ block, index }) {
  if (!block?.type) return null;
  switch (block.type) {
    case 'tldr_block': return <TldrBlock key={index} block={block} />;
    case 'pro_tip_block': return <ProTipBlock key={index} block={block} />;
    case 'mini_case_block': return <MiniCaseBlock key={index} block={block} />;
    case 'real_world_scenario': return <ScenarioBlock key={index} block={block} />;
    case 'deep_explanation': return <DeepExplanationBlock key={index} block={block} />;
    case 'terms': return <TermsBlock key={index} block={block} />;
    case 'visual_formula': return <FormulaBlock key={index} block={block} />;
    case 'worked_example': return <WorkedExampleBlock key={index} block={block} />;
    case 'step_by_step': return <StepByStepBlock key={index} block={block} />;
    case 'comparison_vs': return <ComparisonBlock key={index} block={block} />;
    case 'trap': return <TrapBlock key={index} block={block} />;
    case 'mini_quiz_cliffhanger': return <QuizBlock key={index} block={block} />;
    case 'french_summary': return <FrenchSummaryBlock key={index} block={block} />;
    case 'full_case_study': return <FullCaseStudyBlock key={index} block={block} />;
    case 'bilingual_summary': return <BilingualSummaryBlock key={index} block={block} />;
    case 'table_block': return <TableBlock key={index} block={block} />;
    default:
      return (
        <div key={index} className="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-[14px] font-bold text-slate-500">
          Block غير معروف: <span dir="ltr">{block.type}</span>
        </div>
      );
  }
}

/* -------------------------------------------------------------------------- */
/*                                SHEET PAGE                                  */
/* -------------------------------------------------------------------------- */

function SheetPage({ sheetData, page, pageIndex, totalPages }) {
  return (
    <article
      className="export-page relative flex shrink-0 flex-col overflow-hidden shadow-2xl"
      data-page-index={pageIndex}
      style={{
        width: `${PAGE_WIDTH}px`,
        minHeight: `${PAGE_MIN_HEIGHT}px`,
        padding: '54px 54px 48px',
        backgroundColor: BRAND.paper,
        backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        fontFamily: "'Tajawal', sans-serif",
      }}
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <span dir="ltr" className="whitespace-nowrap text-[170px] font-black text-slate-950 opacity-[0.02]" style={{ transform: 'rotate(-45deg)' }}>
          RR GESTION
        </span>
      </div>

      <header className="relative z-10 flex shrink-0 flex-col gap-3 rounded-[20px] border-b-[4px] border-slate-900 bg-[#FBFBF7]/95 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-lg bg-[#FFB800] px-3 py-1.5 text-[13px] font-black text-slate-950 shadow-sm">
              <Zap className="h-4 w-4" />
              {sheetData.tag}
            </div>
            <div dir="ltr" className="rounded-lg bg-slate-900 px-3 py-1.5 text-[13px] font-black tracking-wide text-amber-400">
              FICHE #{sheetData.ficheNumber}
            </div>
          </div>
          <div dir="ltr" className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-black text-slate-700">
            P. {pageIndex + 1}/{totalPages}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-[26px] font-black leading-[1.2] tracking-tight text-slate-950">
            {page.title || sheetData.chapter}
          </h1>
          {(page.subtitle || sheetData.subtitle) && (
            <p className="text-[14px] font-bold leading-relaxed text-slate-500">
              {page.subtitle || sheetData.subtitle}
            </p>
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col justify-start gap-4 py-5">
        {page.blocks.map((block, index) => (
          <SheetBlock key={`${pageIndex}-${index}-${block.type}`} block={block} index={index} />
        ))}
      </main>

      <footer className="relative z-10 flex shrink-0 items-center justify-between gap-4 rounded-[20px] border-t-[4px] border-slate-900 bg-[#FBFBF7]/90 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[15px] font-black leading-snug text-slate-900">
              {sheetData.cta}
            </p>
            <p dir="ltr" className="text-left text-[13px] font-black text-amber-600">
              → {sheetData.website}
            </p>
          </div>
        </div>
        <div dir="ltr" className="rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-black tracking-widest text-amber-400">
          {sheetData.cohort}
        </div>
      </footer>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                            MAIN SHEET MAKER                                */
/* -------------------------------------------------------------------------- */

export default function SheetMakerPro() {
  const containerRef = useRef(null);
  const [jsonInput, setJsonInput] = useState('');
  const [sheetData, setSheetData] = useState(null);
  const [jsonError, setJsonError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const totalPages = sheetData?.pages?.length || 0;

  const exportLabel = useMemo(() => {
    if (!isExporting) return 'تحميل جميع الصفحات (.zip)';
    return `جاري التصدير ${exportProgress}/${totalPages}`;
  }, [isExporting, exportProgress, totalPages]);

  const handleGenerate = () => {
    setJsonError('');
    setValidationErrors([]);
    try {
      const parsed = JSON.parse(jsonInput);
      const errors = validateSheetData(parsed);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setSheetData(null);
        return;
      }
      const normalized = normalizeSheetData(parsed);
      setSheetData(normalized);
      window.requestAnimationFrame(() => {
        document.getElementById('sheet-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (error) {
      console.error(error);
      setJsonError(`JSON غير صالح: ${error.message}`);
      setSheetData(null);
    }
  };

  const clearAll = () => {
    setJsonInput('');
    setSheetData(null);
    setJsonError('');
    setValidationErrors([]);
    setExportProgress(0);
  };

  const exportAllAsZip = async () => {
    if (!containerRef.current || !sheetData?.pages?.length || isExporting) return;
    const pages = containerRef.current.querySelectorAll('.export-page');
    if (!pages.length) return;
    setIsExporting(true);
    setExportProgress(0);
    const zip = new JSZip();

    try {
      if (document.fonts?.ready) await document.fonts.ready;
      for (let index = 0; index < pages.length; index += 1) {
        const pageNode = pages[index];
        setExportProgress(index + 1);
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const dataUrl = await toPng(pageNode, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: BRAND.paper,
          skipFonts: false,
          style: { transform: 'scale(1)', transformOrigin: 'top left' },
        });
        const base64Data = dataUrl.split(',')[1];
        const cleanTitle = slugify(sheetData.chapter);
        const pageNumber = String(index + 1).padStart(2, '0');

        zip.file(
        `${sheetData.ficheNumber}_${cleanTitle}_P${pageNumber}.png`,
        base64Data,
        { base64: true }
        );
      }
      const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      const cleanTitle = slugify(sheetData.chapter);

        saveAs(
        content,
        `Fiche_${sheetData.ficheNumber}_${cleanTitle}.zip`
        );
    } catch (error) {
      console.error('SheetMakerPro export error:', error);
      setJsonError('وقع مشكل أثناء تصدير الصور. شوف Console للمزيد من التفاصيل.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F1F3F5] px-4 py-7 font-sans text-slate-900 md:px-8" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <section className="mx-auto flex max-w-6xl flex-col gap-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-amber-400">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">SheetMakerPro</h2>
              <p className="text-sm font-bold text-slate-500">RR GESTION • Internal Lead Magnet Generator</p>
            </div>
          </div>
          <button type="button" onClick={exportAllAsZip} disabled={!sheetData || isExporting} className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-6 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40">
            {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            {exportLabel}
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                <FileJson className="h-5 w-5 text-amber-500" />
                JSON Lesson Data
              </label>
              <span dir="ltr" className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-500">pages[] → blocks[]</span>
            </div>
            <textarea value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} placeholder="Paste SheetMakerPro JSON here..." spellCheck={false} dir="ltr" className="h-[330px] w-full resize-y rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 font-mono text-sm leading-relaxed text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white" />
          </div>

          <aside className="flex flex-col justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-amber-500" />
              <p className="font-black">Output</p>
            </div>
            <div className="flex flex-col gap-2 text-sm font-bold text-slate-600">
              <p>Page width: <span dir="ltr">1080px</span></p>
              <p>Min height: <span dir="ltr">1350px</span></p>
              <p>Export: <span dir="ltr">PNG ×2</span></p>
              <p>Ratio: <span dir="ltr">4:5</span></p>
            </div>
            <button type="button" onClick={handleGenerate} disabled={!jsonInput.trim()} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Generate Preview
            </button>
            <button type="button" onClick={clearAll} className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100">
              <RefreshCcw className="h-4 w-4" />
              Clear
            </button>
          </aside>
        </div>

        {jsonError && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold leading-relaxed text-rose-700">{jsonError}</div>}
        {validationErrors.length > 0 && (
          <div className="flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-black text-amber-900">JSON structure فيه مشاكل:</p>
            {validationErrors.map((error, index) => <p key={index} className="text-sm font-bold text-amber-800">• {error}</p>)}
          </div>
        )}
      </section>

      {sheetData && (
        <section id="sheet-preview" className="mx-auto flex max-w-full flex-col gap-8 py-12">
          <div className="mx-auto flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <BriefcaseBusiness className="h-5 w-5 text-amber-500" />
            <p className="font-black">Preview</p>
            <span dir="ltr" className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">{totalPages} pages</span>
          </div>
          <div ref={containerRef} className="flex flex-col items-center gap-10 overflow-x-auto pb-12">
            {sheetData.pages.map((page, pageIndex) => (
              <SheetPage key={`${sheetData.ficheNumber}-${pageIndex}`} sheetData={sheetData} page={page} pageIndex={pageIndex} totalPages={totalPages} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}