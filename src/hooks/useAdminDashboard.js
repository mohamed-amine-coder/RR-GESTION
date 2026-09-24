import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState('smart_lesson');

  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [activeAccessMap, setActiveAccessMap] = useState({});
  const [loadingAction, setLoadingAction] = useState(false);

  const [targetModuleId, setTargetModuleId] = useState('');
  const [smartJsonInput, setSmartJsonInput] = useState('');
  const [smartParsedData, setSmartParsedData] = useState(null);

  const [newMod, setNewMod] = useState({ id: '', title: '', description: '', semestre: 'S1', price: 0 });
  const [newChap, setNewChap] = useState({ module_id: '', title_ar: '', title_fr: '', badge: '', is_free: false });

  const [searchTerm, setSearchTerm] = useState('');
  const [accessModule, setAccessModule] = useState('');

  // Content editor specific states
  const [editModuleId, setEditModuleId] = useState('');
  const [editChapterId, setEditChapterId] = useState('');
  const [editorChapters, setEditorChapters] = useState([]);
  const [editorSlides, setEditorSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [jsonTextarea, setJsonTextarea] = useState('');
  const [isSavingJson, setIsSavingJson] = useState(false);

  useEffect(() => {
    fetchModules();
    fetchProfiles();
  }, []);

  // Fetch chapters for editor when module changes
  useEffect(() => {
    if (!editModuleId) {
      setEditorChapters([]);
      setEditChapterId('');
      return;
    }
    fetchEditorChapters(editModuleId);
  }, [editModuleId]);

  // Fetch slides for editor when chapter changes
  useEffect(() => {
    if (!editChapterId) {
      setEditorSlides([]);
      setSelectedSlide(null);
      setJsonTextarea('');
      return;
    }
    fetchEditorSlides(editChapterId);
  }, [editChapterId]);

  const fetchEditorChapters = async (moduleId) => {
    const { data } = await supabase.from('chapters').select('*').eq('module_id', moduleId).order('order_index');
    if (data) setEditorChapters(data);
    else setEditorChapters([]);
  };

  const fetchEditorSlides = async (chapterId) => {
    const { data } = await supabase.from('slides').select('*').eq('chapter_id', chapterId).order('order_index');
    if (data) setEditorSlides(data);
    else setEditorSlides([]);
  };

  const saveSlideJson = async () => {
    if (!selectedSlide || !selectedSlide.id) return alert('المرجو اختيار السلايد أولاً!');

    let parsedData;
    try {
      parsedData = JSON.parse(jsonTextarea);
    } catch (err) {
      return alert('بنية JSON غير صالحة: ' + err.message);
    }

    setIsSavingJson(true);
    try {
      const { error } = await supabase.from('slides').update({ content: parsedData }).eq('id', selectedSlide.id);
      if (error) throw error;
      alert('✅ تم حفظ السلايد بنجاح!');
      // refresh slides
      fetchEditorSlides(editChapterId);
    } catch (err) {
      alert('وقع خطأ: ' + err.message);
    } finally {
      setIsSavingJson(false);
    }
  };

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
        await supabase
          .from('chapters')
          .update({ title_fr, badge, is_free })
          .eq('id', chapterId);
      } else {
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

      const slidesToInsert = slides.map((slide, index) => ({
        chapter_id: chapterId,
        type: slide.type,
        content: slide,
        order_index: index + 1
      }));

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

  return {
    activeTab,
    setActiveTab,
    modules,
    chapters,
    profiles,
    activeAccessMap,
    loadingAction,
    targetModuleId,
    setTargetModuleId,
    smartJsonInput,
    setSmartJsonInput,
    smartParsedData,
    setSmartParsedData,
    newMod,
    setNewMod,
    newChap,
    setNewChap,
    searchTerm,
    setSearchTerm,
    accessModule,
    setAccessModule,
    fetchModules,
    fetchProfiles,
    handleSmartPreview,
    handleSaveSmartLesson,
    handleAddModule,
    handleAddChapter,
    grantAccess,
    revokeAccess,
    filteredProfiles,
    // editor exports
    editModuleId,
    setEditModuleId,
    editChapterId,
    setEditChapterId,
    editorChapters,
    editorSlides,
    selectedSlide,
    setSelectedSlide,
    jsonTextarea,
    setJsonTextarea,
    isSavingJson,
    saveSlideJson,
    fetchEditorChapters,
    fetchEditorSlides,
  };
}
