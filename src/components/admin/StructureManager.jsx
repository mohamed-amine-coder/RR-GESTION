import { FolderPlus, Layers, PlusCircle } from 'lucide-react';

export default function StructureManager({
  newMod,
  setNewMod,
  handleAddModule,
  newChap,
  setNewChap,
  handleAddChapter,
  modules,
  loadingAction,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
          <FolderPlus className="text-amber-500" /> زيد موديل جديد
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">رمز الموديل (ID)</label>
            <input type="text" placeholder="ex: mngt-s1" value={newMod.id} onChange={e => setNewMod({ ...newMod, id: e.target.value })} className="w-full p-3 border rounded-xl font-bold outline-none" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">السمستر</label>
            <select value={newMod.semestre} onChange={e => setNewMod({ ...newMod, semestre: e.target.value })} className="w-full p-3 border rounded-xl font-bold outline-none">
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
              <option value="S4">S4</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">عنوان الموديل</label>
          <input type="text" placeholder="L'entreprise & son environnement" value={newMod.title} onChange={e => setNewMod({ ...newMod, title: e.target.value })} className="w-full p-3 border rounded-xl font-bold outline-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">الثمن (درهم)</label>
          <input type="number" placeholder="0 = فابور" value={newMod.price} onChange={e => setNewMod({ ...newMod, price: e.target.value })} className="w-full p-3 border rounded-xl font-black text-emerald-600 outline-none" dir="ltr" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">وصف الموديل</label>
          <textarea value={newMod.description} onChange={e => setNewMod({ ...newMod, description: e.target.value })} className="w-full p-3 border rounded-xl font-bold outline-none h-24" />
        </div>

        <button onClick={handleAddModule} disabled={loadingAction} className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-xl transition flex items-center justify-center gap-2">
          <PlusCircle className="w-5 h-5" /> حفظ الموديل
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="text-sky-500" /> زيد فصل يدوي
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">اختار الموديل</label>
          <select value={newChap.module_id} onChange={e => setNewChap({ ...newChap, module_id: e.target.value })} className="w-full p-3 border rounded-xl font-bold outline-none">
            <option value="">-- اختار الموديل --</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">عنوان الفصل (بالعربية)</label>
          <input type="text" placeholder="مقدمة في علوم التسيير" value={newChap.title_ar} onChange={e => setNewChap({ ...newChap, title_ar: e.target.value })} className="w-full p-3 border rounded-xl font-bold outline-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">عنوان الفصل (بالفرنسية)</label>
          <input type="text" placeholder="Introduction au Management" value={newChap.title_fr} onChange={e => setNewChap({ ...newChap, title_fr: e.target.value })} className="w-full p-3 border rounded-xl font-bold outline-none" dir="ltr" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">شارة (Badge)</label>
            <input type="text" placeholder="درس مهم" value={newChap.badge} onChange={e => setNewChap({ ...newChap, badge: e.target.value })} className="w-full p-3 border rounded-xl font-bold outline-none" />
          </div>
          <div className="flex items-center mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newChap.is_free} onChange={e => setNewChap({ ...newChap, is_free: e.target.checked })} className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500" />
              <span className="font-black text-slate-700">هاد الفصل فابور؟</span>
            </label>
          </div>
        </div>

        <button onClick={handleAddChapter} disabled={loadingAction} className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-xl transition flex items-center justify-center gap-2">
          <PlusCircle className="w-5 h-5" /> حفظ الفصل
        </button>
      </div>
    </div>
  );
}
