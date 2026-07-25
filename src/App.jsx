import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider } from '@/lib/AuthContext';

import Layout from '@/components/Layout';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import PrayerRequests from '@/pages/PrayerRequests';
import PrayerRequestDetail from '@/pages/PrayerRequestDetail';
import Testimonies from '@/pages/Testimonies';
import Devotion from '@/pages/Devotion';
import Donate from '@/pages/Donate';
import PrayerAssistant from '@/pages/PrayerAssistant';
import Community from '@/pages/Community';
import PageNotFound from '@/lib/PageNotFound';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
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
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
