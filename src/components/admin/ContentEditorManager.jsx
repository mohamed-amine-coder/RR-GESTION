import { PlusCircle, Save, Trash2 } from 'lucide-react';

export default function ContentEditorManager({
  modules,
  editModuleId,
  setEditModuleId,
  editorChapters,
  editChapterId,
  setEditChapterId,
  editorSlides,
  selectedSlide,
  setSelectedSlide,
  jsonTextarea,
  setJsonTextarea,
  saveSlideJson,
  isSavingJson,
  handleDeleteChapter,
  handleDeleteSlide,
  handleAddEmptySlide,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1.5">اختار الموديل</label>
          <select
            value={editModuleId}
            onChange={e => setEditModuleId(e.target.value)}
            className="w-full p-3.5 border-2 border-slate-200 rounded-2xl font-bold bg-slate-50 outline-none focus:border-slate-900"
          >
            <option value="">-- اختار الموديل --</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title} ({m.semestre})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-1.5">اختار الفصل</label>
          <div className="flex gap-2">
            <select
              value={editChapterId}
              onChange={e => setEditChapterId(e.target.value)}
              disabled={!editModuleId}
              className="w-full p-3.5 border-2 border-slate-200 rounded-2xl font-bold bg-slate-50 outline-none focus:border-slate-900"
            >
              <option value="">-- اختار الفصل --</option>
              {editorChapters.map(c => <option key={c.id} value={c.id}>{c.order_index}. {c.title_ar}</option>)}
            </select>

            <button
              type="button"
              title="Delete Chapter and all its slides"
              onClick={() => handleDeleteChapter(editChapterId)}
              disabled={!editChapterId || isSavingJson}
              className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Delete selected chapter"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-black text-slate-500">قائمة السلايدات</div>
            <button
              type="button"
              onClick={handleAddEmptySlide}
              disabled={!editChapterId || isSavingJson}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-black text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              Add slide
            </button>
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {editorSlides.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSlide(s);
                  try {
                    setJsonTextarea(JSON.stringify(s.content || {}, null, 2));
                  } catch (e) {
                    setJsonTextarea('');
                  }
                }}
                className={`w-full text-left p-3 bg-white border ${selectedSlide?.id === s.id ? 'border-amber-400' : 'border-slate-200'} rounded-xl text-xs flex items-center justify-between`}
              >
                <span className="font-mono text-[11px] text-slate-400">#{s.order_index}</span>
                <span className="font-black text-slate-700">{(s.content && s.content.type) || 'unknown'}</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{s.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col">
        {selectedSlide ? (
          <>
            <label className="block text-xs font-black text-slate-700 mb-1.5">تحرير JSON للسلايد #{selectedSlide.order_index}</label>
            <textarea
              value={jsonTextarea}
              onChange={e => setJsonTextarea(e.target.value)}
              className="w-full h-96 p-4 border-2 border-slate-200 rounded-2xl font-mono text-xs bg-white outline-none focus:border-slate-900"
              dir="ltr"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={saveSlideJson}
                disabled={isSavingJson}
                className="py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 flex-1"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingJson ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteSlide(selectedSlide.id)}
                disabled={isSavingJson}
                className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Delete selected slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-bold text-xs gap-2">
            <span>اختار سلايد من اليسار لعرض وتعديل الـ JSON</span>
          </div>
        )}
      </div>
    </div>
  );
}
