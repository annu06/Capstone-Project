import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar navbar-expand bg-white border-bottom shadow-sm px-4 py-2">
      <div className="ms-auto d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-light position-relative"
          onClick={() => navigate('/notifications')}
          title="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <div className="dropdown">
          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
            {user?.fullName}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><span className="dropdown-item-text small text-muted">{user?.email}</span></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
