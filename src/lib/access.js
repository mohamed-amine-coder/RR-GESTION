export const hasActiveAccess = (chapter, isSubscribed) => Boolean(chapter?.is_free || isSubscribed);

export const canAccessModuleChapter = ({ chapter, userAccess, isAuthenticated }) => {
  if (!chapter) return false;
  if (chapter.is_free) return true;
  if (!isAuthenticated) return false;
  return Boolean(userAccess);
};
