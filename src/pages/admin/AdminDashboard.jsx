import useAdminDashboard from '../../hooks/useAdminDashboard';
import AdminTabs from '../../components/admin/AdminTabs';
import SmartLessonManager from '../../components/admin/SmartLessonManager';
import StructureManager from '../../components/admin/StructureManager';
import AccessManager from '../../components/admin/AccessManager';

export default function AdminDashboard() {
  const {
    activeTab,
    setActiveTab,
    modules,
    targetModuleId,
    setTargetModuleId,
    smartJsonInput,
    setSmartJsonInput,
    smartParsedData,
    handleSmartPreview,
    handleSaveSmartLesson,
    loadingAction,
    newMod,
    setNewMod,
    handleAddModule,
    newChap,
    setNewChap,
    handleAddChapter,
    searchTerm,
    setSearchTerm,
    accessModule,
    setAccessModule,
    filteredProfiles,
    grantAccess,
    revokeAccess,
  } = useAdminDashboard();

  return (
    <div className="min-h-screen bg-[#FBFBF7] p-4 md:p-8 select-none" dir="rtl">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="p-6 md:p-8">
          {activeTab === 'smart_lesson' && (
            <SmartLessonManager
              targetModuleId={targetModuleId}
              setTargetModuleId={setTargetModuleId}
              modules={modules}
              smartJsonInput={smartJsonInput}
              setSmartJsonInput={setSmartJsonInput}
              handleSmartPreview={handleSmartPreview}
              smartParsedData={smartParsedData}
              handleSaveSmartLesson={handleSaveSmartLesson}
              loadingAction={loadingAction}
            />
          )}

          {activeTab === 'structure' && (
            <StructureManager
              newMod={newMod}
              setNewMod={setNewMod}
              handleAddModule={handleAddModule}
              newChap={newChap}
              setNewChap={setNewChap}
              handleAddChapter={handleAddChapter}
              modules={modules}
              loadingAction={loadingAction}
            />
          )}

          {activeTab === 'access' && (
            <AccessManager
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              accessModule={accessModule}
              setAccessModule={setAccessModule}
              modules={modules}
              filteredProfiles={filteredProfiles}
              grantAccess={grantAccess}
              revokeAccess={revokeAccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}