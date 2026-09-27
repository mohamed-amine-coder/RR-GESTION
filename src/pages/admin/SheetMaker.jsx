import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
  AlertOctagon,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CircleHelp,
  Download,
  FileJson,
  Layers3,
  Lightbulb,
  ListOrdered,
  Loader2,
  LockKeyhole,
  PenTool,
  RefreshCcw,
  Sparkles,
  Target,
  Trophy,
  Zap,
  List,
  Crosshair,
  Languages,
  ArrowLeftRight,
  MessageCircle,
  Users
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                               CONFIGURATION                                */
/* -------------------------------------------------------------------------- */

const PAGE_WIDTH = 1080;
const PAGE_HEIGHT = 1350;

const BRAND = {
  amber: '#FFB800',
  dark: '#0F172A',
  paper: '#FBFBF7',
};

const DEFAULT_CTA = 'استعد للامتحان مع الشرح المفصل فالمنصة';
const DEFAULT_WEBSITE = '🔗 rrgestion.vercel.app';
const DEFAULT_COHORT = 'gestion des entreprises';

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
    .replace(/\s+/g, '_')           
    .replace(/[^\w\u0600-\u06FF-]/g, '') 
    .replace(/\_\_+/g, '_');         
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
  return errors;
}

function normalizeSheetData(data) {
  return {
    ficheNumber: data.ficheNumber ?? '01',
    tag: textOr(data.tag, 'EXERCICES VIP'),
    chapter: textOr(data.chapter, 'Série d\'exercices'),
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
/*                        HIGH-VALUE VIP COMPONENTS                           */
/* -------------------------------------------------------------------------- */

function BlockTitle({ icon: Icon, title, iconClassName = '', titleClassName = '' }) {
  if (!title) return null;
  return (
    <div className="flex items-center gap-2.5 mb-1">
      {Icon && <Icon className={cn('h-6 w-6 shrink-0', iconClassName)} />}
      <h3 className={cn('text-[18px] font-black leading-tight tracking-wide', titleClassName)}>
        {title}
      </h3>
    </div>
  );
}

function TranslationBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
      <BlockTitle icon={Languages} title={block.title || 'مصطلحات مهمة'} iconClassName="text-slate-500" titleClassName="text-slate-900" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
        {asArray(block.terms).map((term, index) => (
          <div key={index} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm hover:border-slate-300 transition">
            <span dir="rtl" className="text-[16px] font-black text-slate-800 flex-1 text-right">
              {term.ar}
            </span>
            <ArrowLeftRight className="w-4 h-4 text-slate-400 mx-3 shrink-0" />
            <span dir="ltr" className="text-[16px] font-bold text-slate-600 flex-1 text-left">
              {term.fr}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// 1. بلوك فخ الامتحان (القيمة المضافة الأكبر - أحمر)
function ExamTrapBlock({ block }) {
  return (
    <section className="relative flex w-full flex-col gap-2 rounded-[20px] border-[3px] border-rose-300 bg-[#FFF1F2] p-6 shadow-sm">
      <div className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg rotate-12">
        <AlertOctagon className="h-6 w-6" />
      </div>
      <BlockTitle icon={Target} title={block.title || "رد البال نهار الامتحان! ⚠️"} iconClassName="text-rose-600" titleClassName="text-rose-800" />
      <RichText html={block.content} className="text-[17px] font-black leading-[1.7] text-rose-950 mt-2" />
    </section>
  );
}

// 2. بلوك المنهجية / خطوات الحل (أزرق)
function MethodologyBlock({ block }) {
  const steps = asArray(block.steps);
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border-[3px] border-sky-200 bg-sky-50/80 p-6 shadow-sm">
      <BlockTitle icon={ListOrdered} title={block.title || 'كيفاش تجاوب خطوة بخطوة؟'} iconClassName="text-sky-600" titleClassName="text-sky-900" />
      <div className="flex flex-col gap-3 mt-2">
        {steps.map((step, index) => {
          const content = typeof step === 'string' ? step : textOr(step.content);
          return (
            <div key={index} className="grid grid-cols-[44px_1fr] items-stretch gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-[18px] font-black text-white shadow-sm border-2 border-sky-200">
                  {index + 1}
                </div>
                {index < steps.length - 1 && <div className="min-h-[20px] w-[3px] flex-1 bg-sky-200 mt-2 rounded-full" />}
              </div>
              <div className="flex flex-col justify-center rounded-xl border-2 border-sky-100 bg-white px-5 py-3 shadow-sm">
                <RichText html={content} className="text-[16px] font-bold leading-[1.6] text-slate-800" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 3. القاعدة الذهبية (أصفر/برتقالي)
function RuleReminderBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-[20px] border-[3px] border-amber-300 bg-amber-50 p-6 shadow-sm">
      <BlockTitle icon={Lightbulb} title={block.title || 'القاعدة الذهبية 💡'} iconClassName="text-amber-600" titleClassName="text-amber-900" />
      <div className="bg-white rounded-xl p-4 border border-amber-200 mt-1">
        <RichText html={block.content} className="text-[17px] font-black leading-[1.8] text-slate-800 text-center" />
      </div>
    </section>
  );
}

// 4. بلوك التمرين التطبيقي (أبيض نقي مع تصميم قوي)
function ExerciseQuestionBlock({ block }) {
  return (
    <section className="relative flex w-full flex-col gap-4 rounded-[20px] border-2 border-slate-300 bg-white p-7 shadow-md">
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-2">
         <div className="flex items-center gap-3">
           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-amber-400 font-black text-lg shadow-sm">
             {block.number || 'Q'}
           </div>
           <h3 className="text-[20px] font-black text-slate-900">{block.title || 'تمرين تطبيقي'}</h3>
         </div>
         <div className="bg-slate-100 text-slate-500 font-bold text-[12px] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
           <PenTool className="w-4 h-4" /> à vous de jouer
         </div>
      </div>
      <RichText html={block.question} className="text-[17px] font-bold leading-[1.8] text-slate-800" />
      
      {/* منطقة الإجابة الوهمية باش تبان ورقة ديال الخدمة */}
      {block.showDraftArea && (
        <div className="mt-4 w-full h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-center">
          <span className="text-slate-400 font-bold text-[14px]">Espace brouillon...</span>
        </div>
      )}
    </section>
  );
}

// 5. QCM (أخضر زمردي للتمارين التفاعلية)
function QuizBlock({ block }) {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  return (
    <section className="flex w-full flex-col gap-5 rounded-[20px] border-[3px] border-emerald-200 bg-emerald-50/60 p-6 shadow-sm">
      <BlockTitle icon={Crosshair} title={block.title || 'اختبر راسك (QCM)'} iconClassName="text-emerald-600" titleClassName="text-emerald-950" />
      <RichText html={block.question} className="text-[18px] font-black leading-[1.6] text-emerald-950 px-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {asArray(block.options).map((option, index) => (
          <div key={index} className="flex min-h-[56px] items-center gap-4 rounded-xl border-2 border-emerald-200 bg-white px-4 py-3 shadow-sm hover:border-emerald-400 transition">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-300 text-[14px] font-black text-emerald-700">
              {letters[index] || index + 1}
            </span>
            <span dir="auto" className="text-[16px] font-bold leading-snug text-slate-800">
              {option}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// 6. الجداول
function TableBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border-2 border-slate-200 bg-white p-6 shadow-sm">
      <BlockTitle icon={List} title={block.title || 'الجدول الوصفي'} />
      <div className="w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white">
        <table className="w-full border-collapse text-center">
          {block.headers && block.headers.length > 0 && (
            <thead className="bg-slate-900 text-white">
              <tr>
                {asArray(block.headers).map((header, i) => (
                  <th key={i} className="border-x border-slate-700 p-4 text-[16px] font-black align-middle last:border-l-0 first:border-r-0">
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
                  <td key={j} className="border-x border-slate-200 p-4 text-[16px] font-bold text-slate-800 align-middle last:border-l-0 first:border-r-0">
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

function FillInBlankBlock({ block }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] border-[3px] border-indigo-200 bg-indigo-50/60 p-6 shadow-sm">
      <BlockTitle icon={PenTool} title={block.title || 'أتمم الفراغ'} iconClassName="text-indigo-600" titleClassName="text-indigo-950" />
      <div className="text-[18px] font-bold leading-[2.2] text-slate-800 bg-white rounded-xl p-5 border-2 border-indigo-100 shadow-sm">
        <RichText html={block.content} />
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
    case 'rule_reminder': return <RuleReminderBlock key={index} block={block} />;
    case 'methodology': return <MethodologyBlock key={index} block={block} />;
    case 'exam_trap': return <ExamTrapBlock key={index} block={block} />;
    case 'exercise_question': return <ExerciseQuestionBlock key={index} block={block} />;
    case 'table_block': return <TableBlock key={index} block={block} />;
    case 'quiz_block': return <QuizBlock key={index} block={block} />;
    case 'fill_in_blank': return <FillInBlankBlock key={index} block={block} />;
    case 'translation_block': return <TranslationBlock key={index} block={block} />; // هادا هو السطر الجديد
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
        height: `${PAGE_HEIGHT}px`,
        padding: '50px', // نقصت شوية البادينغ باش يكفينا الفوتر الجديد
        backgroundColor: BRAND.paper,
        backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px)',
        backgroundSize: '30px 30px',
        fontFamily: "'Tajawal', sans-serif",
      }}
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <span dir="ltr" className="whitespace-nowrap text-[180px] font-black text-slate-900 opacity-[0.02] tracking-tighter" style={{ transform: 'rotate(-40deg)' }}>
          RR GESTION
        </span>
      </div>

      <header className="relative z-10 flex shrink-0 flex-col gap-3 rounded-[20px] border-b-[5px] border-slate-900 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-4 py-2 text-[14px] font-black text-slate-950 shadow-sm border border-amber-400">
              <Zap className="h-4 w-4" />
              {sheetData.tag}
            </div>
            <div dir="ltr" className="rounded-xl bg-slate-900 px-4 py-2 text-[14px] font-black tracking-widest text-amber-400 shadow-sm">
              EXERCICE #{sheetData.ficheNumber}
            </div>
          </div>
          <div dir="ltr" className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2 text-[14px] font-black text-slate-700">
            PAGE {pageIndex + 1}/{totalPages}
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <h1 className="text-[28px] font-black leading-[1.2] tracking-tight text-slate-950">
            {page.title || sheetData.chapter}
          </h1>
          {(page.subtitle || sheetData.subtitle) && (
            <p className="text-[16px] font-bold leading-relaxed text-slate-500">
              {page.subtitle || sheetData.subtitle}
            </p>
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col justify-center gap-5 py-5">
        {page.blocks.map((block, index) => (
          <SheetBlock key={`${pageIndex}-${index}-${block.type}`} block={block} index={index} />
        ))}
      </main>

      {/* الفوتر الجديد المزدوج (التسويقي + الروابط) */}
      <footer className="relative z-10 flex flex-col shrink-0 gap-3 mt-auto">
        
        {/* WhatsApp Promo Banner */}
        <div className="flex items-center gap-4 rounded-[20px] bg-[#ECFDF5] border-[3px] border-[#A7F3D0] p-5 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#10B981] text-white shadow-md border-2 border-[#059669]">
            <MessageCircle className="h-7 w-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[17px] font-black text-[#065F46]">
              💬 بغيتي التصحيح وتراجع مع طلبة بحالك؟
            </p>
            <p className="text-[14px] font-bold text-[#047857] leading-[1.6]">
              المنصة دارت ليك <b className="font-black">مجموعات واتساب VIP (من 5 لـ 8 ناس)</b>. جروبات 100% معزولين (بنات بوحدهم / ولاد بوحدهم) باش تقراو على راحتكم. <br/> 
              <span className="bg-[#10B981] text-white px-2 py-0.5 rounded-md text-[12px] font-black mx-1">متاح للجميع (عضو مجاني أو مشترك)</span> 
              دخل دابا للمنصة والتاحق بينا! 👇
            </p>
            <p dir="ltr" className="text-left text-[15px] font-black text-amber-600">
                → {sheetData.website}
              </p>
          </div>
        </div>

        {/* Standard Bottom Bar */}
        {/* <div className="flex items-center justify-between gap-4 rounded-[20px] border-t-[5px] border-slate-900 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 border-2 border-amber-500">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[16px] font-black leading-snug text-slate-900">
                {sheetData.cta}
              </p>
              <p dir="ltr" className="text-left text-[15px] font-black text-amber-600">
                → {sheetData.website}
              </p>
            </div>
          </div>
          <div dir="ltr" className="rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] font-black tracking-widest text-amber-400">
            {sheetData.cohort}
          </div>
        </div> */}

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
    if (!isExporting) return 'تحميل التمارين (صور .zip)';
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
        `${sheetData.ficheNumber}_${cleanTitle}_EX${pageNumber}.png`,
        base64Data,
        { base64: true }
        );
      }
      const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      const cleanTitle = slugify(sheetData.chapter);

        saveAs(
        content,
        `VIP_Exercices_${sheetData.ficheNumber}_${cleanTitle}.zip`
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
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">VIP Exercises Maker</h2>
              <p className="text-sm font-bold text-slate-500">منشئ التمارين الاحترافية الموجهة للبيع</p>
            </div>
          </div>
          <button type="button" onClick={exportAllAsZip} disabled={!sheetData || isExporting} className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-6 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40">
            {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            {exportLabel}
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-3">
            <textarea value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} placeholder="Collez le JSON ici..." spellCheck={false} dir="ltr" className="h-[330px] w-full resize-y rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 font-mono text-sm leading-relaxed text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white" />
          </div>

          <aside className="flex flex-col justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <button type="button" onClick={handleGenerate} disabled={!jsonInput.trim()} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
              <Sparkles className="h-5 w-5 text-amber-400" />
              معاينة التمارين
            </button>
            <button type="button" onClick={clearAll} className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100">
              <RefreshCcw className="h-4 w-4" />
              مسح
            </button>
          </aside>
        </div>
      </section>

      {sheetData && (
        <section id="sheet-preview" className="mx-auto flex max-w-full flex-col gap-8 py-12">
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
