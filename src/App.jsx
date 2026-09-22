import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/common/LoadingScreen';
import ScrollToTop from './components/common/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Modules = lazy(() => import('./pages/Modules'));
const ModulePage = lazy(() => import('./pages/ModulePage'));
const Login = lazy(() => import('./pages/Login'));
const Waitlist = lazy(() => import('./pages/Waitlist'));
const CourseViewer = lazy(() => import('./pages/CourseViewer'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Presentation = lazy(() => import('./pages/Presentation'));
const AdminRoute = lazy(() => import('./components/admin/AdminRoute'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminWaitlist = lazy(() => import('./pages/AdminWaitlist'));

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-200 selection:text-blue-900 font-[family-name:var(--font-tajawal)]">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingScreen message="جارٍ تجهيز التطبيق..." />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/modules" element={<Modules />} />
                <Route path="/module/:moduleId" element={<ModulePage />} />
                <Route path="/viewer" element={<CourseViewer />} />
                <Route path="/viewer/:chapterId" element={<CourseViewer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/waitlist" element={<Waitlist />} />
                <Route path="/presentation" element={<Presentation />} />

                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/waitlist"
                  element={
                    <AdminRoute>
                      <AdminWaitlist />
                    </AdminRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}