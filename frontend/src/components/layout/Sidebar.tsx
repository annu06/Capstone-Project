import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem { label: string; to: string; icon: string; roles?: string[] }

const navItems: NavItem[] = [
  { label: 'Dashboard',       to: '/dashboard',              icon: '📊' },
  { label: 'Couriers',        to: '/couriers',               icon: '📦' },
  { label: 'Create Courier',  to: '/couriers/create',        icon: '➕', roles: ['Shipper'] },
  { label: 'Track Shipment',  to: '/tracking',               icon: '🔍' },
  { label: 'Notifications',   to: '/notifications',          icon: '🔔' },
  { label: 'Admin Panel',     to: '/admin',                  icon: '⚙️', roles: ['Admin'] },
  { label: 'Manage Users',    to: '/admin/users',            icon: '👥', roles: ['Admin'] },
  { label: 'Audit Log',       to: '/admin/audit-log',        icon: '📋', roles: ['Admin'] },
  { label: 'Courier Search',  to: '/admin/courier-search',   icon: '🔎', roles: ['Admin'] },
  { label: 'Tampered Data',   to: '/admin/tampered-couriers',icon: '⚠️', roles: ['Admin'] },
];

export default function Sidebar() {
  const { user } = useAuth();

  const visible = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="sidebar d-flex flex-column p-0" style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
      <div className="px-4 py-4 border-bottom border-blue-800">
        <div className="text-white fw-bold fs-5">⛓ ShipTrack</div>
        <div className="text-blue-200 small">Blockchain Shipment System</div>
      </div>

      {user && (
        <div className="px-4 py-3 border-bottom border-blue-800">
          <div className="text-white small fw-semibold">{user.fullName}</div>
          <span className="badge bg-light text-primary small">{user.role.replace('_', ' ')}</span>
        </div>
      )}

      <nav className="flex-grow-1 py-2">
        {visible.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-sm ${
                isActive
                  ? 'bg-white bg-opacity-25 text-white fw-semibold'
                  : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
