import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero-page">
      <div className="hero-section">
        <div className="hero-badge">
          <i className="bi bi-box-seam-fill" />
          Warehouse Management Platform
        </div>
        <h1 className="hero-title">
          <span>Stock</span>er
        </h1>
        <p className="hero-desc">
          Connect warehouses and stores. Manage inventory, process orders, and track stock — all in one place.
        </p>

        <div className="portal-grid">
          <div className="portal-tile">
            <span className="tile-icon">🏪</span>
            <h4>Store Portal</h4>
            <p>Browse stock across warehouses and place orders instantly.</p>
            <div className="portal-tile-actions">
              <Link to="/store/login" className="btn btn-sm btn-outline-secondary" style={{ borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)' }}>
                Login
              </Link>
              <Link to="/store/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          </div>

          <div className="portal-tile">
            <span className="tile-icon">🏭</span>
            <h4>Warehouse Portal</h4>
            <p>Manage your stock and accept or reject store orders.</p>
            <div className="portal-tile-actions">
              <Link to="/warehouse/login" className="btn btn-sm btn-outline-secondary" style={{ borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)' }}>
                Login
              </Link>
              <Link to="/warehouse/register" className="btn btn-sm" style={{ background: 'rgba(255,255,255,.1)', color: 'white', border: '1px solid rgba(255,255,255,.15)' }}>
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-footer">
        Stocker · Warehouse Stock Management
      </div>
    </div>
  );
}
