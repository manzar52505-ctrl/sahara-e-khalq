import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Image as ImageIcon, 
  Newspaper, 
  Settings,
  LogOut,
  Heart,
  Activity
} from 'lucide-react';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

console.log('TRACE: Sidebar.tsx module evaluation. NavLink type:', typeof NavLink);

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/campaigns', icon: Megaphone, label: 'Campaigns' },
  { path: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { path: '/admin/news', icon: Newspaper, label: 'News' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
  { path: '/admin/diagnostics', icon: Activity, label: 'Diagnostics' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-primary-dark text-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50">
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Sahara-e-Khalq Logo" 
              className="w-full h-full object-contain rounded-lg bg-white/10 p-0.5 shadow-sm"
              onError={(e) => {
                // Fallback to Heart icon if logo is not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">Sahara</span>
            <span className="text-xs text-ivory/60">Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all
              ${isActive 
                ? 'bg-accent text-white shadow-lg shadow-accent/20 font-bold' 
                : 'text-ivory/60 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
