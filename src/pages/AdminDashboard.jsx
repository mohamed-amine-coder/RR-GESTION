import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Layers, Users, Save, Search, CheckCircle2, FolderPlus, PlusCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('smart_lesson'); // 'smart_lesson' | 'structure' | 'access'
  
  // Data States
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [activeAccessMap, setActiveAccessMap] = useState({});
  const [loadingAction, setLoadingAction] = useState(false);

  // Tab 1: Smart Direct Lesson Upload (الحل السريع)
  const [targetModuleId, setTargetModuleId] = useState('');
  const [smartJsonInput, setSmartJsonInput] = useState('');
  const [smartParsedData, setSmartParsedData] = useState(null);

  // Tab 2: Structure (Manual Modules & Chapters)
  const [newMod, setNewMod] = useState({ id: '', title: '', description: '', semestre: 'S1', price: 0 });
  const [newChap, setNewChap] = useState({ module_id: '', title_ar: '', title_fr: '', badge: '', is_free: false });

  // Tab 3: Access
  const [searchTerm, setSearchTerm] = useState('');
  const [accessModule, setAccessModule] = useState('');

  useEffect(() => {
    fetchModules();
    fetchProfiles();
  }, []);

  const fetchModules = async () => {
    const { data } = await supabase.from('modules').select('*').order('order_index');
    if (data) setModules(data);
  };

  const fetchProfiles = async () => {
    const { data: profileData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: accessData } = await supabase
      .from('user_access')
      .select('user_id, module_id, status')
      .eq('status', 'active');

    const accessMap = {};
    (accessData || []).forEach(({ user_id, module_id }) => {
      if (!accessMap[user_id]) accessMap[user_id] = [];
      accessMap[user_id].push(module_id);
    });

    setActiveAccessMap(accessMap);

    if (profileData) {
      const mergedProfiles = profileData.map(profile => ({
        ...profile,
        active_modules: accessMap[profile.id] || []
      }));
      setProfiles(mergedProfiles);
    } else {
      setProfiles([]);
    }
  };

  // ================= SMART INSTANT UPLOAD LOGIC =================
  const handleSmartPreview = () => {
    try {
      const parsed = JSON.parse(smartJsonInput);

      if (!parsed.title_ar || !Array.isArray(parsed.slides)) {
        return alert('الـ JSON خاصو ضروري يحتوي على title_ar ومصفوفة slides!');
      }

      setSmartParsedData(parsed);
    } catch (err) {
      alert('خطأ فـ بنية الـ JSON، تأكد من الفواصل والـ Syntax!');
    }
  };

  const handleSaveSmartLesson = async () => {
    if (!targetModuleId) return alert('المرجو اختيار الموديل أولاً!');
    if (!smartParsedData) return alert('المرجو الضغط على زر معاينة الـ JSON أولاً!');

    setLoadingAction(true);

    try {
      const { title_ar, title_fr = '', badge = '', is_free = false, slides = [] } = smartParsedData;

      // 1. التحقق واش الفصل ديجا كاين فهاد الموديل
      const { data: existingChapters, error: searchError } = await supabase
        .from('chapters')
        .select('*')
        .eq('module_id', targetModuleId)
        .eq('title_ar', title_ar.trim());

      if (searchError) throw searchError;

      let chapterId = null;

      if (existingChapters && existingChapters.length > 0) {
        const found = existingChapters[0];
        const confirmUpdate = window.confirm(
          `هاد الفصل "${title_ar}" ديجا كاين فهاد الموديل!\n\nواش باغي تستبدل السلايدات ديالو بالسلايدات الجداد؟\n(OK = استبدال السلايدات، Cancel = إلغاء باش تبدل العنوان)`
        );

        if (!confirmUpdate) {
          setLoadingAction(false);
          return;
        }

        chapterId = found.id;
        // تحديث معلومات الفصل الاختيارية
        await supabase
          .from('chapters')
          .update({ title_fr, badge, is_free })
          .eq('id', chapterId);
      } else {
        // 2. إنشاء فصل جديد مع حساب order_index تلقائياً
        const { count } = await supabase
          .from('chapters')
          .select('*', { count: 'exact' })
          .eq('module_id', targetModuleId);

        const order_index = (count || 0) + 1;

        const { data: newChapterData, error: createError } = await supabase
          .from('chapters')
          .insert([{
            module_id: targetModuleId,
            title_ar: title_ar.trim(),
            title_fr: title_fr.trim(),
            badge: badge.trim(),
            is_free: Boolean(is_free),
            order_index
          }])
          .select()
          .single();

        if (createError) throw createError;
        chapterId = newChapterData.id;
      }

      // 3. تجهيز وحفظ السلايدات
      const slidesToInsert = slides.map((slide, index) => ({
        chapter_id: chapterId,
        type: slide.type,
        content: slide,
        order_index: index + 1
      }));

      // مسح السلايدات القدام إذا كان تحديث
      await supabase.from('slides').delete().eq('chapter_id', chapterId);
      
      const { error: insertSlidesError } = await supabase.from('slides').insert(slidesToInsert);
      if (insertSlidesError) throw insertSlidesError;

      alert(`✅ تم حفظ الفصل "${title_ar}" و ${slides.length} سلايد بنجاح!`);
      setSmartJsonInput('');
      setSmartParsedData(null);

    } catch (err) {
      alert('وقع خطأ: ' + err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  // ================= MANUAL STRUCTURE ACTIONS =================
  const handleAddModule = async () => {
    if (!newMod.id || !newMod.title) return alert('المرجو إدخال رمز وعنوان الموديل!');
    setLoadingAction(true);
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
    const { count } = await supabase.from('chapters').select('*', { count: 'exact' }).eq('module_id', newChap.module_id);
    const order_index = (count || 0) + 1;

    const { error } = await supabase.from('chapters').insert([{ ...newChap, order_index }]);
    setLoadingAction(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('تزاد الفصل بنجاح!');
      setNewChap({ module_id: '', title_ar: '', title_fr: '', badge: '', is_free: false });
    }
  };

  // ================= ACCESS MANAGEMENT =================
  const grantAccess = async (userId) => {
    if (!accessModule) return alert('اختار الموديل الأول من الفوق!');
    const alreadyHasAccess = (activeAccessMap[userId] || []).includes(accessModule);
    if (alreadyHasAccess) {
      await revokeAccess(userId);
      return;
    }

    const { error } = await supabase.from('user_access').insert([{ user_id: userId, module_id: accessModule, status: 'active' }]);
    if (error) {
      alert(error.code === '23505' ? 'هاد الطالب مفعل عندو هاد الموديل من قبل!' : 'Error: ' + error.message);
      return;
    }

    alert('تفعل الموديل لهاد الطالب بنجاح!');
    fetchProfiles();
  };

  const revokeAccess = async (userId) => {
    if (!accessModule) return alert('اختار الموديل الأول من الفوق!');
    const { error } = await supabase
      .from('user_access')
      .delete()
      .eq('user_id', userId)
      .eq('module_id', accessModule)
      .eq('status', 'active');

    if (error) {
      alert('Error: ' + error.message);
      return;
    }

    alert('تم إلغاء التفعيل بنجاح!');
    fetchProfiles();
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
            <button 
              onClick={() => setActiveTab('smart_lesson')} 
              className={`min-w-[170px] py-4 font-black flex items-center justify-center gap-2 ${activeTab === 'smart_lesson' ? 'border-b-2 border-amber-500 text-slate-900 bg-amber-50/50' : 'text-slate-500'}`}
            >
              <Zap className="w-5 h-5 text-amber-500 fill-current" /> إضافة فصل وسلايدات فورياً
            </button>
            <button 
              onClick={() => setActiveTab('structure')} 
              className={`min-w-[150px] py-4 font-black flex items-center justify-center gap-2 ${activeTab === 'structure' ? 'border-b-2 border-[#0F172A] text-slate-900' : 'text-slate-500'}`}
            >
              <FolderPlus className="w-5 h-5" /> إدارة الهيكلة يدوياً
            </button>
            <button 
              onClick={() => setActiveTab('access')} 
              className={`min-w-[150px] py-4 font-black flex items-center justify-center gap-2 ${activeTab === 'access' ? 'border-b-2 border-[#0F172A] text-slate-900' : 'text-slate-500'}`}
            >
              <Users className="w-5 h-5" /> إدارة الاشتراكات
            </button>
          </div>

          <Link
            to="/admin/waitlist"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shrink-0 transition"
          >
            <Users className="w-4 h-4" />
            <span>لائحة الانتظار 📋</span>
          </Link>
        </div>

        <div className="p-6 md:p-8">
          
          {/* ================= TAB 1: SMART INSTANT UPLOAD ================= */}
          {activeTab === 'smart_lesson' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* جهة الإدخال */}
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
                    placeholder='{"title_ar": "...", "title_fr": "...", "badge": "...", "slides": [...]}'
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

              {/* جهة الـ Preview والحفظ الفوري */}
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
          )}

          {/* ================= TAB 2: MANUAL STRUCTURE ================= */}
          {activeTab === 'structure' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* فورم إضافة موديل */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                  <FolderPlus className="text-amber-500" /> زيد موديل جديد
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">رمز الموديل (ID)</label>
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

              {/* فورم إضافة فصل يدوياً */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="text-sky-500" /> زيد فصل يدوي
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">اختار الموديل</label>
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
                    <label className="block text-xs font-bold text-slate-500 mb-1">شارة (Badge)</label>
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
                <table className="w-full text-sm text-right min-w-[960px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                    <tr>
                      <th className="p-4">السمية</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">الموديلات المفعلة</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map(profile => {
                      const hasModuleAccess = accessModule && (profile.active_modules || []).includes(accessModule);

                      return (
                        <tr key={profile.id} className="border-b border-slate-100 hover:bg-slate-50/60 align-top">
                          <td className="p-4 font-bold text-slate-900">{profile.full_name || 'بلا سمية'}</td>
                          <td className="p-4 text-slate-500 font-mono text-xs" dir="ltr">{profile.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${profile.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                              {profile.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {(profile.active_modules || []).length > 0 ? (
                                (profile.active_modules || []).map(moduleId => {
                                  const module = modules.find(m => m.id === moduleId);
                                  return (
                                    <span
                                      key={`${profile.id}-${moduleId}`}
                                      className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700"
                                    >
                                      {module ? module.title : moduleId}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="text-[11px] font-bold text-slate-400">لا توجد</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {!accessModule ? (
                              <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-black rounded-lg cursor-not-allowed flex items-center gap-1 mx-auto">
                                <CheckCircle2 className="w-4 h-4" /> حدد الموديل
                              </button>
                            ) : hasModuleAccess ? (
                              <button onClick={() => revokeAccess(profile.id)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black rounded-lg transition flex items-center gap-1 mx-auto cursor-pointer active:scale-95">
                                <CheckCircle2 className="w-4 h-4" /> إلغاء التفعيل
                              </button>
                            ) : (
                              <button onClick={() => grantAccess(profile.id)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg transition flex items-center gap-1 mx-auto cursor-pointer active:scale-95">
                                <CheckCircle2 className="w-4 h-4" /> تفعيل
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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