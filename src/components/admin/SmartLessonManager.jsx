import { Layers, Save, Zap } from 'lucide-react';

export default function SmartLessonManager({
  targetModuleId,
  setTargetModuleId,
  modules,
  smartJsonInput,
  setSmartJsonInput,
  handleSmartPreview,
  smartParsedData,
  handleSaveSmartLesson,
  loadingAction,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1.5">اختار الموديل المستهدف 🎯</label>
          <select
            value={targetModuleId}
            onChange={e => setTargetModuleId(e.target.value)}
            className="w-full p-3.5 border-2 border-slate-200 rounded-2xl font-bold bg-slate-50 outline-none focus:border-slate-900"
          >
            <option value="">-- اختار الموديل --</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title} ({m.semestre})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-1.5">لصق كود الـ JSON الكامل للفصل هنا 📋</label>
          <textarea
            value={smartJsonInput}
            onChange={e => setSmartJsonInput(e.target.value)}
            placeholder='{"title_ar": "...", "title_fr": "...", "badge": "...", "slides": [...]} '
            className="w-full h-80 p-4 border-2 border-slate-200 rounded-2xl font-mono text-xs bg-slate-50 outline-none focus:border-slate-900"
            dir="ltr"
          />
        </div>

        <button
          onClick={handleSmartPreview}
          className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>معاينة محتوى الفصل والسلايدات</span>
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col h-[520px]">
        <h3 className="font-black text-base text-slate-900 mb-3 shrink-0 flex items-center justify-between">
          <span>معاينة الفصل:</span>
          {smartParsedData && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-black">
              جاهز للنشر ✨ ({smartParsedData.slides?.length || 0} سلايد)
            </span>
          )}
        </h3>

        {smartParsedData ? (
          <div className="space-y-4 mb-4 flex-1 overflow-y-auto pr-1">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
              <div className="font-black text-slate-900 text-base">{smartParsedData.title_ar}</div>
              <div className="text-xs font-mono text-slate-500" dir="ltr">{smartParsedData.title_fr}</div>
              <div className="flex gap-2 pt-2">
                {smartParsedData.badge && (
                  <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg">
                    {smartParsedData.badge}
                  </span>
                )}
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${smartParsedData.is_free ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {smartParsedData.is_free ? 'فصل فابور 🟢' : 'فصل مدفوع 🔒'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-500">تفاصيل السلايدات:</div>
              {smartParsedData.slides.map((s, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400">#{idx + 1}</span>
                  <span className="font-black text-slate-700">{s.title || s.tag || s.question || s.type}</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">{s.type}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-bold text-xs gap-2">
            <Zap className="w-8 h-8 stroke-[1.5]" />
            <span>لصق كود الـ JSON واضغط على المعاينة لتأكيد الفصل.</span>
          </div>
        )}

        <button
          onClick={handleSaveSmartLesson}
          disabled={loadingAction || !smartParsedData}
          className="w-full py-4 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 text-white font-black rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md"
        >
          <Save className="w-5 h-5 text-amber-400" />
          <span>{loadingAction ? 'جاري الحفظ في القاعدة...' : 'حفظ ونشر الفصل مباشرة 🚀'}</span>
        </button>
      </div>
    </div>
  );
}
