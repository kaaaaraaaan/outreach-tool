import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Users, 
  Globe2, 
  Link, 
  Building2, 
  Database, 
  Settings,
  LogOut 
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  const links = [
    { to: '/clients', icon: Users, label: 'Clients', roles: ['admin'] },
    { to: '/outreach-sites', icon: Globe2, label: 'Outreach Sites', roles: ['admin', 'outreach_manager'] },
    { to: '/links', icon: Link, label: 'Links Mapping', roles: ['admin', 'outreach_manager'] },
    { to: '/agencies', icon: Building2, label: 'Agencies', roles: ['admin', 'agency'] },
    { to: '/database', icon: Database, label: 'Database', roles: ['admin'] },
    { to: '/admin', icon: Settings, label: 'Admin', roles: ['admin'] },
  ].filter(link => link.roles.includes(user?.role || ''));

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Outreach Tool</h1>
        <p className="text-sm text-gray-600">Canty Digital</p>
      </div>

      <nav className="space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}