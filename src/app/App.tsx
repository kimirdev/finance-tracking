import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import ProfilePage from '@/pages/ProfilePage';
import MainLayout from './layouts/MainLayout';
import '../app/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
