import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import AboutPage from '@/pages/AboutPage';
import MainLayout from './layouts/MainLayout';
import '../app/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
