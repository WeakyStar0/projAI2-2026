import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const storeLinks = [
  { to: '/store/browse', icon: 'bi-grid', label: 'Browse Stock' },
  { to: '/store/orders', icon: 'bi-clipboard-check', label: 'My Orders' },
];

const warehouseLinks = [
  { to: '/warehouse/stock', icon: 'bi-box-seam', label: 'Stock' },
  { to: '/warehouse/orders', icon: 'bi-inbox', label: 'Orders', badge: 'pendingOrders' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingOrders, setPendingOrders] = useState(0);

  const links = user?.role === 'warehouse' ? warehouseLinks : storeLinks;
  const initial = user?.name?.[0]?.toUpperCase() || '?';

  useEffect(() => {
    if (user?.role !== 'warehouse') return;
    const fetchPending = async () => {
      try {
        const { data } = await api.get('/orders/warehouse');
        setPendingOrders(data.filter((o) => o.status === 'pending').length);
      } catch {
        // silently ignore
      }
    };
    fetchPending();
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const badges = { pendingOrders };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-text"><span>Stock</span>er</div>
          <div className="logo-sub">
            {user?.role === 'warehouse' ? 'Warehouse Portal' : 'Store Portal'}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Navigation</div>
          {links.map((l) => {
            const badgeCount = l.badge ? badges[l.badge] : 0;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <i className={`bi ${l.icon}`} />
                <span style={{ flex: 1 }}>{l.label}</span>
                {badgeCount > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5px',
                    lineHeight: 1,
                  }}>
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initial}</div>
            <div className="sidebar-user-info">
              <div className="name">{user?.name}</div>
              <div className="role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
