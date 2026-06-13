import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="hero-page">
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 10 }}>
        <LangSwitcher />
      </div>

      <div className="hero-section">
        <div className="hero-badge">
          <i className="bi bi-box-seam-fill" />
          {t('home.badge')}
        </div>
        <h1 className="hero-title"><span>Stock</span>er</h1>
        <p className="hero-desc">{t('home.tagline')}</p>

        <div className="portal-grid">
          <div className="portal-tile">
            <span className="tile-icon">🏪</span>
            <h4>{t('home.storePortal')}</h4>
            <p>{t('home.storeDesc')}</p>
            <div className="portal-tile-actions">
              <Link to="/store/login" className="btn btn-sm btn-outline-secondary" style={{ borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)' }}>
                {t('home.login')}
              </Link>
              <Link to="/store/register" className="btn btn-sm btn-primary">{t('home.register')}</Link>
            </div>
          </div>

          <div className="portal-tile">
            <span className="tile-icon">🏭</span>
            <h4>{t('home.warehousePortal')}</h4>
            <p>{t('home.warehouseDesc')}</p>
            <div className="portal-tile-actions">
              <Link to="/warehouse/login" className="btn btn-sm btn-outline-secondary" style={{ borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)' }}>
                {t('home.login')}
              </Link>
              <Link to="/warehouse/register" className="btn btn-sm" style={{ background: 'rgba(255,255,255,.1)', color: 'white', border: '1px solid rgba(255,255,255,.15)' }}>
                {t('home.register')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-footer">{t('home.footer')}</div>
    </div>
  );
}
