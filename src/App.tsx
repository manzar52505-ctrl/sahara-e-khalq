import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CampaignsPage from './pages/public/CampaignsPage';
import CampaignDetails from './pages/public/CampaignDetails';
import NewsPage from './pages/public/NewsPage';
import NewsDetails from './pages/public/NewsDetails';
import GalleryPage from './pages/public/GalleryPage';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Campaigns from './pages/admin/Campaigns';
import Gallery from './pages/admin/Gallery';
import News from './pages/admin/News';
import Settings from './pages/admin/Settings';
import DiagnosticTools from './pages/admin/DiagnosticTools';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/gallery" element={<GalleryPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/campaigns" element={<Campaigns />} />
          <Route path="/admin/gallery" element={<Gallery />} />
          <Route path="/admin/news" element={<News />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/diagnostics" element={<DiagnosticTools />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
