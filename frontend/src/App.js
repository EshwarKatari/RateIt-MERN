import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#15151f',
            color: '#f1f0ff',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#07070d' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#07070d' } },
        }}
      />
      <div className="page">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
