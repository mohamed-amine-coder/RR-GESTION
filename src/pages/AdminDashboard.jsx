import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Layers, Users, Save, Search, CheckCircle2, FolderPlus, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('structure'); // 'structure' | 'lessons' | 'access'
  
  // Data States
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  
  // Tab 1: Structure (Modules & Chapters) States
  const [newMod, setNewMod] = useState({ id: '', title: '', description: '', semestre: 'S1', price: 0 });
  const [newChap, setNewChap] = useState({ module_id: '', title_ar: '', title_fr: '', badge: '', is_free: false });
  const [loadingAction, setLoadingAction] = useState(false);

  // Tab 2: Lessons States
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [parsedSlides, setParsedSlides] = useState([]);

  // Tab 3: Access States
  const [searchTerm, setSearchTerm] = useState('');
  const [accessModule, setAccessModule] = useState('');

  useEffect(() => {
    fetchModules();
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (selectedModule) fetchChapters(selectedModule);
    else setChapters([]);
  }, [selectedModule]);

  const fetchModules = async () => {
    const { data } = await supabase.from('modules').select('*').order('order_index');
    if (data) setModules(data);
  };

  const fetchChapters = async (moduleId) => {
    const { data } = await supabase.from('chapters').select('*').eq('module_id', moduleId).order('order_index');
    if (data) setChapters(data);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setProfiles(data);
  };

  // --- ACTIONS: Structure ---
  const handleAddModule = async () => {
    if (!newMod.id || !newMod.title) return alert('المرجو إدخال رمز وعنوان الموديل!');
    setLoadingAction(true);
    
    // نجيبو اخر order_index باش يجي هو اللخر
    const order_index = modules.length + 1;
    
    const { error } = await supabase.from('modules').insert([{ ...newMod, order_index }]);
    setLoadingAction(false);
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('تزاد الموديل بنجاح!');
      setNewMod({ id: '', title: '', description: '', semestre: 'S1', price: 0 });
      fetchModules();
    }
  };

  const handleAddChapter = async () => {
    if (!newChap.module_id || !newChap.title_ar || !newChap.title_fr) return alert('المرجو ملء المعلومات الأساسية للفصل!');
    setLoadingAction(true);
    
    // نجيبو عدد الفصول ديال هاد الموديل باش نعطيو للجديد order_index
    const { count } = await supabase.from('chapters').select('*', { count: 'exact' }).eq('module_id', newChap.module_id);
    const order_index = (count || 0) + 1;

    const { error } = await supabase.from('chapters').insert([{ ...newChap, order_index }]);
    setLoadingAction(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('تزاد الفصل بنجاح!');
      setNewChap({ module_id: '', title_ar: '', title_fr: '', badge: '', is_free: false });
      if (selectedModule === newChap.module_id) fetchChapters(selectedModule); // refresh if needed
    }
  };

  // --- ACTIONS: Lessons ---
  const handlePreview = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedSlides(Array.isArray(parsed) ? parsed : [parsed]);
    } catch (err) {
      alert('Erreur f JSON, t2akd men l formatag!');
    }
  };

  const handleSaveSlides = async () => {
    if (!selectedChapter || parsedSlides.length === 0) return alert('Khtar lfasl w dir preview l JSON 9bel!');
    setLoadingAction(true);
    
    const slidesToInsert = parsedSlides.map((slide, index) => ({
      chapter_id: selectedChapter,
      type: slide.type,
      content: slide,
      order_index: index + 1
    }));

    await supabase.from('slides').delete().eq('chapter_id', selectedChapter);
    const { error } = await supabase.from('slides').insert(slidesToInsert);
    
    setLoadingAction(false);
    if (error) alert('Error: ' + error.message);
    else alert('Tsayvaw sildes b naja7!');
  };

  // --- ACTIONS: Access ---
  const grantAccess = async (userId) => {
    if (!accessModule) return alert('Khtar lmodule lwel men lfo9!');
    const { error } = await supabase.from('user_access').insert([{ user_id: userId, module_id: accessModule, status: 'active' }]);
    
    if (error && error.code === '23505') alert('Had ttalib dija mfa3el 3ndo had lmodule!');
    else if (error) alert('Error: ' + error.message);
    else alert('Tf3al lmodule l had talib b naja7!');
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBFBF7] p-4 md:p-8 select-none" dir="rtl">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4">
          <div className="flex overflow-x-auto">
            <button onClick={() => setActiveTab('structure')} className={`min-w-[150px] py-4 font-black flex items-center justify-center gap-2 ${activeTab === 'structure' ? 'border-b-2 border-[#0F172A] text-slate-900' : 'text-slate-500'}`}>
              <FolderPlus className="w-5 h-5" /> إضافة الموديلات للفصول
            </button>
            <button onClick={() => setActiveTab('lessons')} className={`min-w-[150px] py-4 font-black flex items-center justify-center gap-2 ${activeTab === 'lessons' ? 'border-b-2 border-[#0F172A] text-slate-900' : 'text-slate-500'}`}>
              <Layers className="w-5 h-5" /> إضافة الدروس (JSON)
            </button>
            <button onClick={() => setActiveTab('access')} className={`min-w-[150px] py-4 font-black flex items-center justify-center gap-2 ${activeTab === 'access' ? 'border-b-2 border-[#0F172A] text-slate-900' : 'text-slate-500'}`}>
              <Users className="w-5 h-5" /> إدارة الاشتراكات
            </button>
          </div>

          {/* زر التحويل لصفحة الوايت ليست */}
          <Link
            to="/admin/waitlist"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shrink-0 transition"
          >
            <Users className="w-4 h-4" />
            <span>لائحة الانتظار 📋</span>
          </Link>
        </div>

        <div className="p-6 md:p-8">
          
          {/* ================= TAB 1: STRUCTURE ================= */}
          {activeTab === 'structure' && (
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* فورم إضافة موديل */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                  <FolderPlus className="text-amber-500" /> زيد موديل جديد
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">رمز الموديل (ID) بـ لفرونسي بلا إسباس</label>
                    <input type="text" placeholder="ex: mngt-s1" value={newMod.id} onChange={e => setNewMod({...newMod, id: e.target.value})} className="w-full p-3 border rounded-xl font-bold outline-none" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">السمستر</label>
                    <select value={newMod.semestre} onChange={e => setNewMod({...newMod, semestre: e.target.value})} className="w-full p-3 border rounded-xl font-bold outline-none">
                      <option value="S1">S1</option><option value="S2">S2</option>
                      <option value="S3">S3</option><option value="S4">S4</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">عنوان الموديل</label>
                  <input type="text" placeholder="L'entreprise & son environnement" value={newMod.title} onChange={e => setNewMod({...newMod, title: e.target.value})} className="w-full p-3 border rounded-xl font-bold outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">الثمن (درهم)</label>
                  <input type="number" placeholder="0 = فابور" value={newMod.price} onChange={e => setNewMod({...newMod, price: e.target.value})} className="w-full p-3 border rounded-xl font-black text-emerald-600 outline-none" dir="ltr" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">وصف الموديل</label>
                  <textarea value={newMod.description} onChange={e => setNewMod({...newMod, description: e.target.value})} className="w-full p-3 border rounded-xl font-bold outline-none h-24" />
                </div>

                <button onClick={handleAddModule} disabled={loadingAction} className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-xl transition flex items-center justify-center gap-2">
                  <PlusCircle className="w-5 h-5" /> حفظ الموديل
                </button>
              </div>

              {/* فورم إضافة فصل */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="text-sky-500" /> زيد فصل جديد
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">اختار الموديل لي تابع ليه</label>
                  <select value={newChap.module_id} onChange={e => setNewChap({...newChap, module_id: e.target.value})} className="w-full p-3 border rounded-xl font-bold outline-none">
                    <option value="">-- اختار الموديل --</option>
                    {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">عنوان الفصل (بالعربية)</label>
                  <input type="text" placeholder="مقدمة في علوم التسيير" value={newChap.title_ar} onChange={e => setNewChap({...newChap, title_ar: e.target.value})} className="w-full p-3 border rounded-xl font-bold outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">عنوان الفصل (بالفرنسية)</label>
                  <input type="text" placeholder="Introduction au Management" value={newChap.title_fr} onChange={e => setNewChap({...newChap, title_fr: e.target.value})} className="w-full p-3 border rounded-xl font-bold outline-none" dir="ltr" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">شارة (Badge) - اختياري</label>
                    <input type="text" placeholder="درس مهم" value={newChap.badge} onChange={e => setNewChap({...newChap, badge: e.target.value})} className="w-full p-3 border rounded-xl font-bold outline-none" />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newChap.is_free} onChange={e => setNewChap({...newChap, is_free: e.target.checked})} className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500" />
                      <span className="font-black text-slate-700">هاد الفصل فابور؟</span>
                    </label>
                  </div>
                </div>

                <button onClick={handleAddChapter} disabled={loadingAction} className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-xl transition flex items-center justify-center gap-2">
                  <PlusCircle className="w-5 h-5" /> حفظ الفصل
                </button>
              </div>

            </div>
          )}

          {/* ================= TAB 2: LESSONS ================= */}
          {activeTab === 'lessons' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Jiha dyal idakhal (Form) */}
              <div className="space-y-4">
                <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)} className="w-full p-3 border rounded-xl font-bold bg-slate-50 outline-none">
                  <option value="">-- اختار الموديل --</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
                
                <select value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)} disabled={!selectedModule} className="w-full p-3 border rounded-xl font-bold bg-slate-50 outline-none disabled:opacity-50">
                  <option value="">-- اختار الفصل --</option>
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.title_ar}</option>)}
                </select>

                <textarea 
                  value={jsonInput} 
                  onChange={e => setJsonInput(e.target.value)} 
                  placeholder="Lse9 JSON dyal slides hna (Array dyal objects)..."
                  className="w-full h-64 p-4 border rounded-xl font-mono text-sm bg-slate-50 outline-none"
                  dir="ltr"
                />
                <button onClick={handlePreview} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-xl transition cursor-pointer">
                  Preview JSON
                </button>
              </div>

              {/* Jiha dyal Preview w Save */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col h-[500px]">
                <h3 className="font-black mb-4 shrink-0">Preview ({parsedSlides.length} slides):</h3>
                
                <div className="space-y-4 mb-6 flex-1 overflow-y-auto pr-2">
                  {parsedSlides.map((slide, i) => (
                    <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md mb-2 inline-block">
                        Type: {slide.type}
                      </span>
                      <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap" dir="ltr">
                        {JSON.stringify(slide, null, 2)}
                      </pre>
                    </div>
                  ))}
                  {parsedSlides.length === 0 && <p className="text-sm font-bold text-slate-400 text-center mt-10">Makayn ta slide l preview.</p>}
                </div>
                
                <button onClick={handleSaveSlides} disabled={loadingAction || parsedSlides.length === 0} className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0">
                  <Save className="w-5 h-5" /> {loadingAction ? 'Kaysayvi...' : 'حفظ الدروس في القاعدة'}
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 3: ACCESS ================= */}
          {activeTab === 'access' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute right-3 top-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    placeholder="قلب بالسمية أو الإيميل..." 
                    className="w-full p-3 pr-10 border rounded-xl font-bold bg-white outline-none"
                  />
                </div>
                <select value={accessModule} onChange={e => setAccessModule(e.target.value)} className="w-full md:w-1/3 p-3 border rounded-xl font-bold bg-white outline-none">
                  <option value="">-- اختار الموديل للتفعيل --</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-sm text-right">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                    <tr>
                      <th className="p-4">السمية</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map(profile => (
                      <tr key={profile.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{profile.full_name || 'بلا سمية'}</td>
                        <td className="p-4 text-slate-500 font-mono text-xs" dir="ltr">{profile.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${profile.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                            {profile.role}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => grantAccess(profile.id)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg transition flex items-center gap-1 mx-auto cursor-pointer active:scale-95">
                            <CheckCircle2 className="w-4 h-4" /> تفعيل
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}