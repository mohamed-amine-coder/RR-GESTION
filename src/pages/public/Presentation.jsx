import { useState, useRef, useLayoutEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Zap,
  AlertTriangle,
  KeyRound,
  Lightbulb,
  ArrowLeftRight,
  Download,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
  Archive,
  Loader2,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Table2,
  ListTree,
  ThumbsUp,
  ThumbsDown,
  Quote,
  Target,
  Milestone
} from 'lucide-react';
import mrRrImg from '../../assets/mr-rr.png';
import msRrImg from '../../assets/ms-rr.png';

// ============ Design tokens (light / educational theme) ============
const INK = '#211B12';
const BODY = '#4B4436';
const CREAM = '#FBF6EA';
const CARD = '#FFFFFF';
const HAIRLINE = '#E7DFCB';
const AMBER = '#C97A19';
const AMBER_SOFT = '#F5A623';

export default function InstaPostMaker() {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isExportingSingle, setIsExportingSingle] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [scale, setScale] = useState(0.5);

  const printRef = useRef(null);
  const frameWrapperRef = useRef(null);

  useLayoutEffect(() => {
    const el = frameWrapperRef.current;
    if (!el) return;

    const computeScale = () => {
      const PADDING = 32;
      const availableW = el.clientWidth - PADDING;
      const availableH = el.clientHeight - PADDING;
      const next = Math.max(Math.min(availableW / 1080, availableH / 1080), 0.1);
      setScale(next);
    };

    computeScale();
    const ro = new ResizeObserver(computeScale);
    ro.observe(el);
    window.addEventListener('resize', computeScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeScale);
    };
  }, []);

  const handleParseJSON = () => {
    try {
      const cleanInput = jsonInput.trim();
      const parsed = JSON.parse(cleanInput);
      if (!parsed.slides || !Array.isArray(parsed.slides)) {
        alert('الـ JSON مابيهش مصفوفة slides!');
        return;
      }

      const finalSlides = [
        ...parsed.slides,
        {
          type: 'promo_cta',
          title: 'بغيتي تفهم الموديل كامل بهاد السهولة؟',
          sub: 'منصة RR GESTION كتوجدك لـ EFM و EFF بلا ضياع الوقت!',
          features: [
            'ملخصات تفاعلية بالدارجة وبطريقة مبسطة',
            'مصطلحات واختبارات تطبيقية نهار الامتحان',
            'جميع مواد تسيير المقاولات (TSGE) فبلاصت وحدة'
          ]
        }
      ];

      setParsedData({ ...parsed, slides: finalSlides });
      setSelectedSlideIndex(0);
    } catch (error) {
      console.error('JSON Error:', error);
      alert('كاين خطأ فتركيبة الـ JSON. تأكد من الأقواس والفواصل.');
    }
  };

  const exportSingleImage = async () => {
    if (!printRef.current) return;
    setIsExportingSingle(true);

    try {
      const dataUrl = await toPng(printRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true
      });

      const link = document.createElement('a');
      const num = String(selectedSlideIndex + 1).padStart(2, '0');
      link.download = `RR_${parsedData?.badge || 'post'}_slide_${num}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('وقع خطأ فاستخراج الصورة');
    } finally {
      setIsExportingSingle(false);
    }
  };

  const exportAllAsZip = async () => {
    if (!parsedData?.slides?.length || !printRef.current) return;
    setIsExportingAll(true);
    setExportProgress(0);

    const zip = new JSZip();
    const originalIndex = selectedSlideIndex;

    try {
      for (let i = 0; i < parsedData.slides.length; i++) {
        setSelectedSlideIndex(i);
        setExportProgress(i + 1);

        await new Promise((resolve) => setTimeout(resolve, 200));

        const dataUrl = await toPng(printRef.current, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true
        });

        const base64Data = dataUrl.split(',')[1];
        const num = String(i + 1).padStart(2, '0');
        zip.file(`slide_${num}.png`, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `RR_POST_${parsedData?.title_fr || 'carousel'}.zip`);
    } catch (err) {
      console.error(err);
      alert('وقع مشكل أثناء توليد ملف الـ Zip');
    } finally {
      setSelectedSlideIndex(originalIndex);
      setIsExportingAll(false);
      setExportProgress(0);
    }
  };

  // ============ Slide content ============
  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center gap-8 max-w-3xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-black"
              style={{ background: 'rgba(201,122,25,0.10)', color: AMBER }}
            >
              <Sparkles className="w-5 h-5" />
              <span>{slide.tag || 'مقدمة الدرس'}</span>
            </div>
            <h2 className="text-5xl font-black leading-snug" style={{ color: INK }}>
              {parsedData?.title_ar}
            </h2>
            <p className="text-2xl font-bold leading-relaxed max-w-2xl" style={{ color: BODY }}>
              {slide.contentAr}
            </p>
          </div>
        );

      case 'concept':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center gap-7 max-w-3xl mx-auto">
            <Lightbulb className="w-11 h-11" style={{ color: AMBER }} />
            <h2 className="text-4xl font-black leading-snug" style={{ color: INK }}>
              {slide.title}
            </h2>
            <p className="text-2xl font-bold leading-relaxed" style={{ color: BODY }}>
              {slide.desc}
            </p>
            {slide.badges && (
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                {slide.badges.map((b, i) => (
                  <span
                    key={i}
                    className="text-lg font-black px-5 py-2 rounded-xl"
                    style={{ background: AMBER_SOFT, color: INK }}
                    dir="ltr"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case 'dictionary':
        return (
          <div className="flex flex-col justify-center h-full gap-7 max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-center gap-3" style={{ color: AMBER }}>
              <KeyRound className="w-9 h-9" />
              <h2 className="text-4xl font-black" style={{ color: INK }}>{slide.tag || 'مصطلحات أساسية'}</h2>
            </div>
            <div
              className="flex flex-col w-full rounded-[1.75rem] overflow-hidden"
              style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
            >
              {slide.terms.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-7 py-5"
                  style={{ borderBottom: idx < slide.terms.length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}
                >
                  <span className="text-2xl font-black flex-1 text-right" style={{ color: AMBER }}>{t.ar}</span>
                  <ArrowLeftRight className="w-6 h-6 mx-6 shrink-0" style={{ color: '#B8AD8F' }} />
                  <span className="text-2xl font-black flex-1 text-left" style={{ color: INK }} dir="ltr">{t.fr}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'trap':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center gap-7 max-w-3xl mx-auto">
            <AlertTriangle className="w-12 h-12" style={{ color: '#C4463A' }} />
            <h2 className="text-4xl font-black" style={{ color: '#C4463A' }}>
              {slide.tag || 'رد البال نهار الامتحان!'}
            </h2>
            <div
              className="p-8 rounded-[1.75rem]"
              style={{ background: '#FDF1EF', border: '1px solid #F3D3CE' }}
            >
              <p className="text-2xl font-bold leading-relaxed" style={{ color: INK }}>
                {slide.text}
              </p>
            </div>
          </div>
        );

      // ================= NEW SLIDE: PROCESS (مراحل/خطوات) =================
      case 'process':
        return (
          <div className="flex flex-col justify-center h-full gap-8 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-2" style={{ color: AMBER }}>
              <Milestone className="w-10 h-10" />
              <h2 className="text-4xl font-black" style={{ color: INK }}>{slide.title}</h2>
            </div>
            <div className="flex flex-col gap-5 relative">
              {/* الخط العمودي للربط بين المراحل */}
              <div className="absolute top-0 bottom-0 right-7 w-1.5 rounded-full" style={{ background: HAIRLINE }} />
              
              {slide.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-6 relative z-10">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black shrink-0 shadow-sm" 
                    style={{ background: AMBER_SOFT, color: INK, border: `6px solid ${CREAM}` }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 p-6 rounded-[1.5rem]" style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}>
                    <h3 className="text-2xl font-black mb-2" style={{ color: INK }}>{step.title}</h3>
                    <p className="text-xl font-bold leading-relaxed" style={{ color: BODY }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ================= NEW SLIDE: PROS & CONS (إيجابيات وسلبيات) =================
      case 'pros_cons':
        return (
          <div className="flex flex-col justify-center h-full gap-8 max-w-[850px] mx-auto w-full">
            <h2 className="text-4xl font-black text-center" style={{ color: INK }}>{slide.title}</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* المزايا */}
              <div className="p-7 rounded-[1.75rem]" style={{ background: '#EEF7F1', border: '1px solid #BFE1CC' }}>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-sm text-[#276A45]">
                    <ThumbsUp className="w-8 h-8" />
                  </div>
                </div>
                <ul className="space-y-4 text-xl font-bold text-[#1F5437]">
                  {slide.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-[#276A45]" />
                      <span dir="auto" className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* العيوب */}
              <div className="p-7 rounded-[1.75rem]" style={{ background: '#FDF1EF', border: '1px solid #F3D3CE' }}>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-sm text-[#C4463A]">
                    <ThumbsDown className="w-8 h-8" />
                  </div>
                </div>
                <ul className="space-y-4 text-xl font-bold text-[#9D382E]">
                  {slide.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-[#C4463A]" />
                      <span dir="auto" className="leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      // ================= NEW SLIDE: BIG NUMBER (رقم مهم) =================
      case 'big_number':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 max-w-3xl mx-auto w-full">
            {slide.tag && (
              <span className="text-xl font-black px-6 py-2.5 rounded-full mb-4" style={{ background: 'rgba(201,122,25,0.1)', color: AMBER }}>
                {slide.tag}
              </span>
            )}
            <h2 
              className="font-black" 
              style={{ 
                fontSize: '8rem', 
                lineHeight: '1.1', 
                color: AMBER, 
                textShadow: '0px 10px 20px rgba(201,122,25,0.15)' 
              }} 
              dir="ltr"
            >
              {slide.number}
            </h2>
            <h3 className="text-4xl font-black mt-2 leading-snug" style={{ color: INK }}>{slide.title}</h3>
            {slide.desc && (
              <p className="text-2xl font-bold mt-4 leading-relaxed max-w-2xl" style={{ color: BODY }}>
                {slide.desc}
              </p>
            )}
          </div>
        );

      // ================= NEW SLIDE: QUOTE (قاعدة / مقولة) =================
      case 'quote':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center gap-8 max-w-3xl mx-auto w-full">
            <Quote className="w-24 h-24" style={{ color: AMBER, opacity: 0.3 }} />
            <p className="text-4xl font-black leading-snug" style={{ color: INK }}>
              "{slide.text}"
            </p>
            <div className="w-20 h-2 rounded-full mt-2" style={{ background: AMBER_SOFT }} />
            {slide.author && (
              <span className="text-2xl font-bold" style={{ color: '#8A8064' }}>
                — {slide.author}
              </span>
            )}
          </div>
        );

      // ================= NEW SLIDE: LIST / TYPES (أنواع / أقسام) =================
      case 'list':
        return (
          <div className="flex flex-col justify-center h-full gap-7 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-2" style={{ color: AMBER }}>
              <ListTree className="w-10 h-10" />
              <h2 className="text-4xl font-black" style={{ color: INK }}>{slide.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {slide.items.map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-6 rounded-[1.5rem]" style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(201,122,25,0.1)', color: AMBER }}>
                    <Target className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col">
                    {item.title && <h3 className="text-2xl font-black" style={{ color: INK }}>{item.title}</h3>}
                    {item.desc && <p className="text-xl font-bold mt-1.5 leading-relaxed" style={{ color: BODY }}>{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="flex flex-col justify-center h-full max-w-3xl mx-auto w-full">
            <div className="grid grid-cols-2 gap-6 relative">
              <div
                className="p-7 rounded-[1.75rem]"
                style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
              >
                <h3 className="text-2xl font-black text-center mb-6 pb-4" style={{ color: INK, borderBottom: `1px solid ${HAIRLINE}` }}>
                  {slide.left.title}
                </h3>
                <ul className="space-y-4 text-xl font-bold" style={{ color: BODY }}>
                  {slide.left.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#C4463A' }} />
                      <span dir="auto" className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="p-7 rounded-[1.75rem]"
                style={{ background: '#FEF8EC', border: `1px solid ${AMBER_SOFT}55` }}
              >
                <h3 className="text-2xl font-black text-center mb-6 pb-4" style={{ color: AMBER, borderBottom: `1px solid ${AMBER_SOFT}55` }}>
                  {slide.right.title}
                </h3>
                <ul className="space-y-4 text-xl font-bold" style={{ color: BODY }}>
                  {slide.right.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#3D8A5F' }} />
                      <span dir="auto" className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-black w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                style={{ background: CREAM, border: `2px solid ${AMBER_SOFT}`, color: AMBER }}
              >
                VS
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="flex flex-col justify-center h-full gap-6 max-w-3xl mx-auto w-full text-center">
            <div className="flex items-center justify-center gap-2" style={{ color: AMBER }}>
              <HelpCircle className="w-8 h-8" />
              <span className="text-lg font-black">سؤال اختبر بيه راسك</span>
            </div>
            <h2 className="text-3xl font-black leading-snug" style={{ color: INK }}>
              {slide.question}
            </h2>
            <div className="space-y-3 pt-2">
              {slide.options.map((opt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl text-xl font-bold flex items-center justify-between"
                  style={
                    i === slide.correct
                      ? { background: '#EEF7F1', border: '1px solid #BFE1CC', color: '#276A45' }
                      : { background: CARD, border: `1px solid ${HAIRLINE}`, color: BODY }
                  }
                >
                  <span>{opt}</span>
                  {i === slide.correct && (
                    <span className="text-xs px-3 py-1 rounded-lg font-black" style={{ background: '#3D8A5F', color: '#fff' }}>
                      الصحيحة
                    </span>
                  )}
                </div>
              ))}
            </div>
            {slide.explanation && (
              <p className="text-lg font-bold pt-2 leading-relaxed" style={{ color: BODY }}>
                💡 {slide.explanation}
              </p>
            )}
          </div>
        );

      case 'exercise':
        return (
          <div className="flex flex-col justify-center h-full gap-7 max-w-3xl mx-auto w-full">
            <div className="flex flex-col gap-3">
              <span className="text-lg font-black" style={{ color: AMBER }}>
                {slide.tag || 'السؤال'}
              </span>
              <p className="text-2xl font-black leading-relaxed" style={{ color: INK }}>
                {slide.question}
              </p>
            </div>

            {slide.answer && (
              <div
                className="p-7 rounded-[1.75rem]"
                style={{ background: '#EEF7F1', border: '1px solid #BFE1CC' }}
              >
                <span className="text-sm font-black" style={{ color: '#276A45' }}>الجواب</span>
                <p className="text-xl font-bold leading-relaxed mt-2" style={{ color: INK }}>
                  {slide.answer}
                </p>
              </div>
            )}

            {slide.steps && (
              <div className="flex flex-col gap-4 text-right">
                {slide.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base font-black"
                      style={{ background: AMBER_SOFT, color: INK }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xl font-bold leading-relaxed pt-0.5" style={{ color: BODY }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'table': {
        const headers = slide.headers || [];
        const rows = slide.rows || [];
        const rowCount = rows.length;
        const colCount = headers.length;

        let cellText = 'text-xl';
        let headText = 'text-lg';
        let cellPad = 'px-5 py-4';
        if (rowCount > 9 || colCount > 5) {
          cellText = 'text-sm';
          headText = 'text-sm';
          cellPad = 'px-3 py-2';
        } else if (rowCount > 6 || colCount > 4) {
          cellText = 'text-base';
          headText = 'text-base';
          cellPad = 'px-4 py-2.5';
        } else if (rowCount > 4) {
          cellText = 'text-lg';
          headText = 'text-base';
          cellPad = 'px-5 py-3';
        }

        return (
          <div className="flex flex-col justify-center h-full gap-6 max-w-3xl mx-auto w-full">
            {(slide.tag || slide.title) && (
              <div className="flex items-center justify-center gap-3" style={{ color: AMBER }}>
                <Table2 className="w-8 h-8" />
                <h2 className="text-3xl font-black" style={{ color: INK }}>
                  {slide.tag || slide.title}
                </h2>
              </div>
            )}

            <div
              className="w-full rounded-[1.5rem] overflow-hidden"
              style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
            >
              <table className="w-full border-collapse" dir="auto">
                {headers.length > 0 && (
                  <thead>
                    <tr style={{ background: AMBER_SOFT }}>
                      {headers.map((h, i) => (
                        <th
                          key={i}
                          className={`${headText} font-black text-center ${cellPad}`}
                          style={{ color: INK }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? CARD : '#FCF8EE' }}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`${cellText} font-bold text-center ${cellPad}`}
                          style={{
                            color: ci === 0 ? INK : BODY,
                            borderTop: `1px solid ${HAIRLINE}`
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {slide.note && (
              <p className="text-base font-bold text-center leading-relaxed" style={{ color: '#8A8064' }}>
                {slide.note}
              </p>
            )}
          </div>
        );
      }

      case 'promo_cta':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center gap-7 max-w-3xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-black"
              style={{ background: '#EEF7F1', color: '#276A45' }}
            >
              <GraduationCap className="w-6 h-6" />
              <span>مرافقة شاملة لطلبة OFPPT</span>
            </div>

            <h2 className="text-4xl font-black leading-snug" style={{ color: INK }}>
              {slide.title}
            </h2>

            <p className="text-xl font-bold max-w-xl" style={{ color: BODY }}>
              {slide.sub}
            </p>

            <div className="w-full space-y-3 pt-2 text-right">
              {slide.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: AMBER }} />
                  <span className="text-xl font-bold" style={{ color: INK }}>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-center gap-3">
              <div
                className="px-8 py-3.5 rounded-2xl font-black text-xl shadow-md flex items-center gap-3"
                style={{ background: AMBER_SOFT, color: INK }}
              >
                <span>دخل دابا وابدا التعلم</span>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-2xl font-bold" style={{ color: BODY }}>
            شريحة من نوع {slide.type}
          </div>
        );
    }
  };

  const currentSlide = parsedData?.slides[selectedSlideIndex];
  const totalSlides = parsedData?.slides?.length || 0;
  const isMsTurn = selectedSlideIndex % 2 !== 0 && currentSlide?.type !== 'promo_cta';

  return (
    <div className="min-h-screen bg-[#FBFBF7] p-6 select-none" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= CONTROLS ================= */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <ImageIcon className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">Instagram Post Maker</h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700">كود JSON:</label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-36 p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-mono text-xs outline-none focus:border-slate-900"
              dir="ltr"
              placeholder='{"title_ar": "...", "slides": [...]}'
            />
            <button
              onClick={handleParseJSON}
              className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-black rounded-xl transition text-sm cursor-pointer"
            >
              قراءة الـ JSON وإضافة سلايد الـ Promo
            </button>
          </div>

          {parsedData && (
            <div className="flex-1 overflow-y-auto max-h-80 space-y-2 pr-1">
              <h3 className="text-xs font-black text-slate-500 mb-2">السلايدات ({totalSlides}):</h3>
              {parsedData.slides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSlideIndex(idx)}
                  className={`w-full p-2.5 flex items-center justify-between rounded-xl border-2 transition text-right cursor-pointer ${
                    selectedSlideIndex === idx
                      ? 'border-amber-400 bg-amber-50 text-amber-950 font-black'
                      : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white font-bold'
                  }`}
                >
                  <span className="text-xs truncate max-w-[200px]">
                    #{idx + 1} {slide.title || slide.tag || slide.type}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded text-white ${
                    slide.type === 'promo_cta' ? 'bg-emerald-600 font-black' : 'bg-slate-900'
                  }`}>
                    {slide.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= PREVIEW & EXPORT ================= */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-4">
            <span className="text-xs font-black text-slate-500">
              معاينة المربع (1080 × 1080)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={exportAllAsZip}
                disabled={!parsedData || isExportingAll || isExportingSingle}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition shadow-sm flex items-center gap-2 disabled:opacity-50 text-xs cursor-pointer"
              >
                {isExportingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>توليد ({exportProgress}/{totalSlides})...</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4 text-amber-400" />
                    <span>تحميل الكل (Zip)</span>
                  </>
                )}
              </button>

              <button
                onClick={exportSingleImage}
                disabled={!parsedData || isExportingSingle || isExportingAll}
                className="px-5 py-2.5 bg-[#FFB800] hover:bg-amber-400 text-slate-950 font-black rounded-xl transition shadow-md shadow-amber-200 flex items-center gap-2 disabled:opacity-50 text-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingSingle ? 'جاري التحميل...' : 'تحميل السلايد الحالي'}</span>
              </button>
            </div>
          </div>

          <div
            ref={frameWrapperRef}
            className="w-full overflow-hidden bg-slate-100 rounded-3xl border border-slate-200 flex justify-center items-center h-[70vh] min-h-[480px]"
          >
            {currentSlide ? (
              <div
                className="shrink-0"
                style={{
                  width: 1080,
                  height: 1080,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center'
                }}
              >
              <div
                ref={printRef}
                className="w-[1080px] h-[1080px] relative overflow-hidden flex flex-col justify-between font-[family-name:var(--font-tajawal)] p-16"
                style={{ background: CREAM }}
              >
                <header className="flex justify-between items-center shrink-0 z-10 pb-7" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: AMBER_SOFT, color: INK }}>
                      <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-2xl tracking-tight leading-none" style={{ color: INK }}>
                        RR <span style={{ color: AMBER }}>GESTION</span>
                      </span>
                      <span className="text-sm font-bold mt-1" style={{ color: '#8A8064' }}>
                        منصة تفعالية لتبسيط شعبة تسيير المقاولات
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="px-4 py-2 rounded-xl text-lg font-black font-mono"
                      style={{ background: 'rgba(201,122,25,0.08)', color: AMBER }}
                      dir="ltr"
                    >
                      {String(selectedSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                    </div>
                    <div className="px-5 py-2 rounded-xl text-lg font-black" style={{ background: CARD, border: `1px solid ${HAIRLINE}`, color: AMBER }}>
                      {parsedData?.badge || 'TSGE'}
                    </div>
                  </div>
                </header>

                <main className="flex-1 flex flex-col justify-center py-8 z-10">
                  {renderSlideContent(currentSlide)}
                </main>

                <footer className="flex items-center justify-between shrink-0 z-10 pt-7" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                  <div className="px-6 py-2.5 rounded-xl" style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}>
                    <p className="font-bold text-lg tracking-wider" style={{ color: '#8A8064' }} dir="ltr">
                      🔗 rrgestion.vercel.app
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg" style={{ color: '#8A8064' }}>تسيير المقاولات</span>
                    {currentSlide.type === 'promo_cta' ? (
                      <div className="flex -space-x-4">
                        <img
                          src={mrRrImg}
                          alt="Mr RR"
                          className="w-16 h-16 object-cover rounded-xl shadow-sm bg-white z-10"
                          style={{ border: `2px solid ${AMBER_SOFT}` }}
                        />
                        <img
                          src={msRrImg}
                          alt="Ms RR"
                          className="w-16 h-16 object-cover rounded-xl shadow-sm bg-white"
                          style={{ border: '2px solid #E8A9A0' }}
                        />
                      </div>
                    ) : isMsTurn ? (
                      <img
                        src={msRrImg}
                        alt="Ms RR"
                        className="w-16 h-16 object-cover rounded-xl shadow-sm bg-white"
                        style={{ border: '2px solid #E8A9A0' }}
                      />
                    ) : (
                      <img
                        src={mrRrImg}
                        alt="Mr RR"
                        className="w-16 h-16 object-cover rounded-xl shadow-sm bg-white"
                        style={{ border: `2px solid ${AMBER_SOFT}` }}
                      />
                    )}
                  </div>
                </footer>
              </div>
              </div>
            ) : (
              <div className="text-slate-400 font-bold text-sm">حط كود الـ JSON باش تبان المعاينة هنا</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
