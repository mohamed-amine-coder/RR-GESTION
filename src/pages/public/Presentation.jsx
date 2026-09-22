import { useState, useRef } from 'react';
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
  GraduationCap
} from 'lucide-react';
import mrRrImg from '../../assets/mr-rr.png';
import msRrImg from '../../assets/ms-rr.png';

export default function InstaPostMaker() {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isExportingSingle, setIsExportingSingle] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const printRef = useRef(null);

  const handleParseJSON = () => {
    try {
      const cleanInput = jsonInput.trim();
      const parsed = JSON.parse(cleanInput);
      if (!parsed.slides || !Array.isArray(parsed.slides)) {
        alert('الـ JSON مابيهش مصفوفة slides!');
        return;
      }

      // إضافة سلايد تسويقي ختامي تلقائياً
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

  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-7 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-amber-400/10 text-amber-400 rounded-full text-lg font-black border border-amber-400/30">
              <Sparkles className="w-5 h-5" />
              <span>{slide.tag || 'مقدمة الدرس'}</span>
            </div>
            <h2 className="text-4xl font-black text-white leading-snug">
              {parsedData?.title_ar}
            </h2>
            <div className="relative bg-slate-900/80 backdrop-blur-md p-9 rounded-[2.5rem] border border-slate-800 shadow-2xl">
              <p className="text-2xl font-bold text-slate-300 leading-relaxed">
                {slide.contentAr}
              </p>
            </div>
          </div>
        );

      case 'concept':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-3xl mx-auto">
            <div className="p-4 bg-amber-400/10 rounded-2xl border border-amber-400/30">
              <Lightbulb className="w-12 h-12 text-amber-400" />
            </div>
            <h2 className="text-4xl font-black text-white leading-snug">
              {slide.title}
            </h2>
            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-800 shadow-xl">
              <p className="text-2xl font-bold text-slate-300 leading-relaxed">
                {slide.desc}
              </p>
            </div>
            {slide.badges && (
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                {slide.badges.map((b, i) => (
                  <span key={i} className="text-lg font-black bg-gradient-to-r from-amber-400 to-[#FFB800] text-slate-950 px-5 py-2 rounded-xl shadow-md" dir="ltr">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case 'dictionary':
        return (
          <div className="flex flex-col justify-center h-full space-y-8 max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-center gap-3 text-amber-400">
              <KeyRound className="w-9 h-9" />
              <h2 className="text-4xl font-black text-white">{slide.tag || 'مصطلحات أساسية'}</h2>
            </div>
            <div className="flex flex-col gap-4 w-full">
              {slide.terms.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <span className="text-2xl font-black text-amber-400 flex-1 text-right">{t.ar}</span>
                  <ArrowLeftRight className="w-6 h-6 text-slate-500 mx-6 shrink-0" />
                  <span className="text-2xl font-black text-white flex-1 text-left" dir="ltr">{t.fr}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'trap':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-3xl mx-auto">
            <div className="p-5 bg-rose-500/10 rounded-full border-2 border-rose-500/30">
              <AlertTriangle className="w-14 h-14 text-rose-500" />
            </div>
            <h2 className="text-4xl font-black text-rose-400">
              {slide.tag || 'رد البال نهار الامتحان!'}
            </h2>
            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-[2rem] border border-rose-500/20 shadow-2xl">
              <p className="text-2xl font-bold text-slate-200 leading-relaxed">
                {slide.text}
              </p>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="flex flex-col justify-center h-full max-w-3xl mx-auto w-full">
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="p-7 rounded-[2rem] border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl">
                <h3 className="text-2xl font-black text-white text-center mb-6 pb-4 border-b border-slate-800">
                  {slide.left.title}
                </h3>
                <ul className="space-y-4 text-xl font-bold text-slate-300">
                  {slide.left.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                      <span dir="auto">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-7 rounded-[2rem] border border-amber-500/30 bg-amber-500/5 backdrop-blur-md shadow-xl">
                <h3 className="text-2xl font-black text-amber-400 text-center mb-6 pb-4 border-b border-amber-500/20">
                  {slide.right.title}
                </h3>
                <ul className="space-y-4 text-xl font-bold text-slate-300">
                  {slide.right.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                      <span dir="auto">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B132B] border-2 border-amber-400 text-amber-400 text-xl font-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-10">
                VS
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="flex flex-col justify-center h-full space-y-6 max-w-3xl mx-auto w-full text-center">
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <HelpCircle className="w-8 h-8" />
              <span className="text-lg font-black uppercase tracking-wider">سؤال اختبر بيه راسك</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-snug">
              {slide.question}
            </h2>
            <div className="space-y-3 pt-2">
              {slide.options.map((opt, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border text-xl font-bold flex items-center justify-between shadow-md ${
                    i === slide.correct
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <span>{opt}</span>
                  {i === slide.correct && (
                    <span className="text-xs bg-emerald-500 text-slate-950 px-3 py-1 rounded-lg font-black">الصحيحة</span>
                  )}
                </div>
              ))}
            </div>
            {slide.explanation && (
              <p className="text-lg font-bold text-slate-400 pt-2 leading-relaxed">
                💡 {slide.explanation}
              </p>
            )}
          </div>
        );

      case 'promo_cta':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-lg font-black">
              <GraduationCap className="w-6 h-6" />
              <span>مرافقة شاملة لطلبة OFPPT</span>
            </div>
            
            <h2 className="text-4xl font-black text-white leading-snug">
              {slide.title}
            </h2>
            
            <p className="text-xl font-bold text-slate-400 max-w-xl">
              {slide.sub}
            </p>

            <div className="w-full space-y-3.5 pt-2 text-right">
              {slide.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
                  <span className="text-xl font-bold text-slate-200">{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <div className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-[#FFB800] text-slate-950 rounded-2xl font-black text-xl shadow-xl flex items-center gap-3">
                <span>دخل دابا وابدا التعلم</span>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-2xl font-bold">
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

          {/* Scaled Preview Frame */}
          <div className="w-full overflow-hidden bg-slate-100 rounded-3xl border border-slate-200 flex justify-center items-center h-[620px]">
            {currentSlide ? (
              <div
                ref={printRef}
                className="shrink-0 bg-[#0B132B] w-[1080px] h-[1080px] relative overflow-hidden flex flex-col justify-between font-[family-name:var(--font-tajawal)] p-14"
                style={{
                  transform: 'scale(0.52)',
                  transformOrigin: 'center'
                }}
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[110px] pointer-events-none" />

                {/* Top Header */}
                <header className="flex justify-between items-center shrink-0 z-10 border-b border-slate-800/80 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFB800] flex items-center justify-center text-slate-950 shadow-md">
                      <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <span className="font-black text-2xl tracking-tight text-white">
                      RR <span className="text-[#FFB800]">GESTION</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-amber-400/10 border border-amber-400/30 px-4 py-2 rounded-xl text-amber-400 text-lg font-black font-mono" dir="ltr">
                      {String(selectedSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                    </div>
                    <div className="bg-slate-800 border border-slate-700 px-5 py-2 rounded-xl text-amber-400 text-lg font-black">
                      {parsedData?.badge || 'TSGE'}
                    </div>
                  </div>
                </header>

                {/* Center Content */}
                <main className="flex-1 flex flex-col justify-center py-8 z-10">
                  {renderSlideContent(currentSlide)}
                </main>

                {/* Bottom Footer مع التناوب بين Mr. RR و Ms. RR */}
                <footer className="flex items-center justify-between shrink-0 z-10 border-t border-slate-800/80 pt-6">
                  <div className="bg-slate-900/80 border border-slate-800 px-6 py-2.5 rounded-xl">
                    <p className="text-slate-400 font-bold text-lg tracking-wider" dir="ltr">
                      🔗 rrgestion.vercel.app
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold text-lg">تسيير المقاولات</span>
                    {currentSlide.type === 'promo_cta' ? (
                      <div className="flex -space-x-4">
                        <img
                          src={mrRrImg}
                          alt="Mr RR"
                          className="w-16 h-16 object-cover rounded-xl border-2 border-amber-400 shadow-md bg-white z-10"
                        />
                        <img
                          src={msRrImg}
                          alt="Ms RR"
                          className="w-16 h-16 object-cover rounded-xl border-2 border-rose-400 shadow-md bg-white"
                        />
                      </div>
                    ) : isMsTurn ? (
                      <img
                        src={msRrImg}
                        alt="Ms RR"
                        className="w-16 h-16 object-cover rounded-xl border-2 border-rose-400 shadow-md bg-white"
                      />
                    ) : (
                      <img
                        src={mrRrImg}
                        alt="Mr RR"
                        className="w-16 h-16 object-cover rounded-xl border-2 border-amber-400 shadow-md bg-white"
                      />
                    )}
                  </div>
                </footer>
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