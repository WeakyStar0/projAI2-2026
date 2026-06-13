import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span>Stock</span>er
        </Link>
        <div className="ms-auto d-flex align-items-center gap-3">
          {user ? (
            <>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                {user.name}
                <span
                  className="ms-2"
                  style={{
                    background: user.role === 'warehouse' ? 'var(--brand)' : '#3b82f6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {user.role}
                </span>
              </span>
              {user.role === 'store' && (
                <>
                  <Link className="nav-link text-white" to="/store/browse">Browse</Link>
                  <Link className="nav-link text-white" to="/store/orders">My Orders</Link>
                </>
              )}
              {user.role === 'warehouse' && (
                <>
                  <Link className="nav-link text-white" to="/warehouse/stock">Stock</Link>
                  <Link className="nav-link text-white" to="/warehouse/orders">Orders</Link>
                </>
              )}
              <button
                className="btn btn-sm"
                onClick={handleLogout}
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn btn-sm"
                to="/store/login"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Store Login
              </Link>
              <Link className="btn btn-primary btn-sm" to="/warehouse/login">
                Warehouse Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
