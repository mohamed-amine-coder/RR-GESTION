import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingScreen from '../../components/common/LoadingScreen';
import CelebrationModal from '../../components/viewer/CelebrationModal';
import SlideRenderer from '../../components/viewer/SlideRenderer';
import ViewerFooter from '../../components/viewer/ViewerFooter';
import ViewerHeader from '../../components/viewer/ViewerHeader';
import useCourseViewer from '../../hooks/useCourseViewer';
import mrRrImg from '../../assets/mr-rr.png';
import msRrImg from '../../assets/ms-rr.png';

export default function CourseViewer() {
  const {
    authLoading,
    loading,
    slides,
    moduleId,
    chapterTitle,
    currentIndex,
    selectedOption,
    quizSubmitted,
    isCompleted,
    setSelectedOption,
    setQuizSubmitted,
    total,
    current,
    progressPercentage,
    handleNext,
    handlePrev,
    handleRepeat,
    handleReturn,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    mood,
    charAnimate,
    charTransition,
    msSpeech,
    mrSpeech,
  } = useCourseViewer();

  if (authLoading || loading) {
    return <LoadingScreen message="جارٍ تحميل الدرس..." />;
  }

  if (slides.length === 0) {
    return (
      <div className="h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-4">
        <div className="font-black text-lg text-rose-500">مزال مادخل تا محتوى فهاد الفصل!</div>
        <Link to="/modules" className="px-6 py-2 bg-[#0F172A] text-white font-bold rounded-xl text-sm">
          الرجوع للموديلات
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full bg-[#FFFDF7] flex flex-col overflow-hidden select-none" dir="rtl">
      <CelebrationModal
        isCompleted={isCompleted}
        handleReturn={handleReturn}
        handleRepeat={handleRepeat}
      />

      <ViewerHeader
        moduleId={moduleId}
        progressPercentage={progressPercentage}
        currentIndex={currentIndex}
        total={total}
      />

      <div className="w-full max-w-3xl mx-auto px-3 pt-5">
        <div className="w-full mb-5 space-y-2.5">
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
          <h2 className="text-sm md:text-base font-black text-slate-800 text-center">{chapterTitle}</h2>
        </div>
      </div>

      <SlideRenderer
        current={current}
        currentIndex={currentIndex}
        quizSubmitted={quizSubmitted}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setQuizSubmitted={setQuizSubmitted}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />

      <ViewerFooter
        mood={mood}
        msSpeech={msSpeech}
        mrSpeech={mrSpeech}
        handleNext={handleNext}
        handlePrev={handlePrev}
        currentIndex={currentIndex}
        total={total}
        charAnimate={charAnimate}
        charTransition={charTransition}
        mrRrImg={mrRrImg}
        msRrImg={msRrImg}
      />
    </div>
  );
}
