import { Link } from 'react-router-dom';
import { Users, FolderPlus, Zap, FileJson } from 'lucide-react';

export default function AdminTabs({ activeTab, setActiveTab }) {
  return (
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
        <button
          onClick={() => setActiveTab('edit_content')}
          className={`min-w-[170px] py-4 font-black flex items-center justify-center gap-2 ${activeTab === 'edit_content' ? 'border-b-2 border-amber-500 text-slate-900 bg-amber-50/50' : 'text-slate-500'}`}
        >
          <FileJson className="w-5 h-5" /> تعديل المحتوى
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
  );
}
