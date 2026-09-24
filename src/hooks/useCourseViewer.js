import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function useCourseViewer() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user, hasActiveModuleAccess, loading: authLoading } = useAuth();

  const [slides, setSlides] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      if (!chapterId) {
        setLoading(false);
        return;
      }

      const { data: chapData } = await supabase
        .from('chapters')
        .select('id, module_id, is_free, title_ar')
        .eq('id', chapterId)
        .single();

      if (!chapData) {
        setLoading(false);
        return;
      }

      setChapterTitle(chapData.title_ar || '');

      const nextModuleId = chapData.module_id;
      setModuleId(nextModuleId);

      if (!chapData.is_free) {
        if (!user) {
          navigate('/login', { replace: true });
          return;
        }
        const hasAccess = await hasActiveModuleAccess(nextModuleId);
        if (!hasAccess) {
          navigate(`/module/${nextModuleId}`, { replace: true });
          return;
        }
      }

      const { data, error } = await supabase
        .from('slides')
        .select('content')
        .eq('chapter_id', chapterId)
        .order('order_index');

      if (error) {
        console.error('Error fetching slides:', error);
      } else if (data) {
        setSlides(data.map(item => item.content));
      }
      setLoading(false);
    };

    fetchChapterData();
  }, [chapterId, hasActiveModuleAccess, navigate, user]);

  const total = slides.length;
  const current = slides[currentIndex];
  const progressPercentage = ((currentIndex + 1) / total) * 100;

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    }
  };

  const handleRepeat = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleReturn = () => {
    navigate(moduleId ? `/module/${moduleId}` : '/modules');
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const dist = touchStartX.current - touchEndX.current;
    const threshold = 60;
    if (Math.abs(dist) < threshold) return;
    if (dist < 0) handleNext();
    else handlePrev();
  };

  const isQuizSlide = current?.type === 'quiz';
  const isAnswerCorrect = isQuizSlide && quizSubmitted && selectedOption === current?.correct;
  const isAnswerWrong = isQuizSlide && quizSubmitted && selectedOption !== current?.correct;

  const mood = isCompleted
    ? 'celebrate'
    : isAnswerCorrect
      ? 'correct'
      : isAnswerWrong
        ? 'wrong'
        : isQuizSlide && selectedOption !== null && !quizSubmitted
          ? 'thinking'
          : 'idle';

  const charAnimate = {
    idle: { y: [0, -3, 0], rotate: [0, -1, 1, 0] },
    thinking: { rotate: [0, 3, -3, 0], y: [0, -2, 0] },
    correct: { y: [0, -14, 0], scale: [1, 1.1, 1] },
    wrong: { x: [0, -4, 4, -4, 4, 0] },
    celebrate: { y: [0, -16, 0], rotate: [0, 6, -6, 0], scale: [1, 1.06, 1] },
  };

  const charTransition = {
    duration:
      mood === 'idle' || mood === 'thinking' || mood === 'celebrate' ? 2 : 0.5,
    repeat:
      mood === 'idle' || mood === 'thinking' || mood === 'celebrate' ? Infinity : 0,
    ease: 'easeInOut',
  };

  const msSpeech = (() => {
    if (isCompleted || isQuizSlide) return null;
    if (current?.type === 'intro') return 'يلا نبداو الدرس! 🌟';
    if (current?.type === 'concept') return 'ركز فهاد المفهوم 💡';
    if (current?.type === 'comparison') return 'شوف الفرق بيناتهم 👀';
    if (current?.type === 'audio') return 'سمع مزيان 🎧';
    if (current?.type === 'table') return 'المعطيات فالجدول 📊';
    return null;
  })();

  const mrSpeech = (() => {
    if (isQuizSlide && !quizSubmitted && selectedOption !== null) {
      return 'تحقق واش صحيح';
    }
    if (current?.type === 'dictionary') return 'حفظ هاد المصطلحات 📚';
    if (current?.type === 'trap') return 'حذاري! هاد الغلطة شائعة ⚠️';
    return null;
  })();

  return {
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
  };
}
