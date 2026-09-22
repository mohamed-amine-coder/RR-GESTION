import { CheckCircle2, Search } from 'lucide-react';

export default function AccessManager({
  searchTerm,
  setSearchTerm,
  accessModule,
  setAccessModule,
  modules,
  filteredProfiles,
  grantAccess,
  revokeAccess,
  activeAccessMap,
}) {
  return (
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
  );
}
