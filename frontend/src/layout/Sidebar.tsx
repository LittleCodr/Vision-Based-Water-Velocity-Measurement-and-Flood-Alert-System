import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/live', label: 'Live Feed' },
  { to: '/velocity', label: 'Velocity Analytics' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/sites', label: 'Sites & Health' },
  { to: '/datasets', label: 'Datasets' },
  { to: '/model', label: 'Model' }
];

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col border-r-4 border-slate-900 bg-white shadow-[6px_6px_0_#0f172a]">
      <div className="p-6 border-b-4 border-slate-900">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Water Velocity</h1>
        <p className="text-xs text-slate-600">Vision Flood Monitor</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-semibold border-2 border-slate-900 transition-all ${
                isActive
                  ? 'bg-sky-200 text-slate-900 shadow-[4px_4px_0_#0f172a] translate-x-1'
                  : 'bg-white text-slate-800 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0f172a]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t-4 border-slate-900 text-sm text-slate-700 bg-slate-50">
        <p className="mb-2 font-semibold">{user?.email || 'guest@anon'}</p>
        <button
          onClick={logout}
          className="w-full rounded-md border-2 border-slate-900 px-3 py-2 text-sm font-semibold hover:shadow-[3px_3px_0_#0f172a]"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
