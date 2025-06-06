import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import ProfilePage from '@/pages/ProfilePage';
import StatsPage from '@/pages/StatsPage';
import MainLayout from './layouts/MainLayout';
import '../app/index.css';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </MainLayout>
      <Toaster />
    </BrowserRouter>
  );
}
