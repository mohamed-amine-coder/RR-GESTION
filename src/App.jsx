import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModulePage from './pages/ModulePage';
import Login from './pages/Login';
import Waitlist from './pages/Waitlist';
import CourseViewer from './pages/CourseViewer';
import NotFound from './pages/NotFound';
import Presentation from './pages/Presentation';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
// 1. تأكد من هاد السطر
import AdminWaitlist from './pages/AdminWaitlist';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-200 selection:text-blue-900 font-[family-name:var(--font-tajawal)]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/module/:moduleId" element={<ModulePage />} />
            <Route path="/viewer" element={<CourseViewer />} />
            <Route path="/viewer/:chapterId" element={<CourseViewer />} />            
            <Route path="/login" element={<Login />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path='/presentation' element={<Presentation />} />
            
            {/* 2. الـ Routes ديال Admin هنا */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />

            <Route path="/admin/waitlist" element={
              <AdminRoute>
                <AdminWaitlist />
              </AdminRoute>
            } />
            
            {/* 3. ديما 404 تكون هي الأخيرة كاع */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}