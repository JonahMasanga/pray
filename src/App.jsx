import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';

// Lazy-load all page components so each route is a separate JS chunk
const Home = lazy(() => import('@/pages/Home'));
const PrayerRequests = lazy(() => import('@/pages/PrayerRequests'));
const PrayerRequestDetail = lazy(() => import('@/pages/PrayerRequestDetail'));
const Testimonies = lazy(() => import('@/pages/Testimonies'));
const Devotion = lazy(() => import('@/pages/Devotion'));
const Donate = lazy(() => import('@/pages/Donate'));
const PrayerAssistant = lazy(() => import('@/pages/PrayerAssistant'));
const Community = lazy(() => import('@/pages/Community'));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/requests" element={<PrayerRequests />} />
                <Route path="/requests/:id" element={<PrayerRequestDetail />} />
                <Route path="/testimonies" element={<Testimonies />} />
                <Route path="/devotion" element={<Devotion />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/assistant" element={<PrayerAssistant />} />
                <Route path="/community" element={<Community />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
