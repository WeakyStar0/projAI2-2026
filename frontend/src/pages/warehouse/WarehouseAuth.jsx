import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LangSwitcher from '../../components/LangSwitcher';
import api from '../../services/api';

export default function WarehouseAuth({ mode }) {
  const [form, setForm] = useState({ name: '', location: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/warehouse/register' : '/auth/warehouse/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data.token, data.user);
      navigate('/warehouse/stock');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem' }}>
          <LangSwitcher />
        </div>
        <div className="auth-left-logo"><span>Stock</span>er</div>
        <h2>{t('auth.warehouse.pitch')}</h2>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-box-seam" /></div>
          <p>{t('auth.warehouse.feature1')}</p>
        </div>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-inbox" /></div>
          <p>{t('auth.warehouse.feature2')}</p>
        </div>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-graph-up" /></div>
          <p>{t('auth.warehouse.feature3')}</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <h3>{isRegister ? t('auth.warehouse.registerTitle') : t('auth.warehouse.loginTitle')}</h3>
          <p className="subtitle">{isRegister ? t('auth.warehouse.registerSub') : t('auth.warehouse.loginSub')}</p>

          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="mb-3">
                  <label className="form-label">{t('auth.warehouseName')}</label>
                  <input className="form-control form-control-lg" placeholder={t('auth.warehouse.namePlaceholder')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">{t('auth.location')}</label>
                  <input className="form-control form-control-lg" placeholder={t('auth.warehouse.locationPlaceholder')} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </>
            )}
            <div className="mb-3">
              <label className="form-label">{t('auth.email')}</label>
              <input type="email" className="form-control form-control-lg" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-4">
              <label className="form-label">{t('auth.password')}</label>
              <input type="password" className="form-control form-control-lg" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn btn-dark w-100" style={{ padding: '0.65rem', fontSize: '0.9rem' }} disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-2" />}
              {isRegister ? t('auth.warehouse.createWarehouse') : t('auth.signIn')}
            </button>
          </form>

          <div className="mt-4 text-center" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            {isRegister ? (
              <>{t('auth.alreadyRegistered')} <Link to="/warehouse/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>{t('auth.signIn')}</Link></>
            ) : (
              <>{t('auth.noAccount')} <Link to="/warehouse/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>{t('auth.warehouse.createWarehouse')}</Link></>
            )}
          </div>
          <div className="mt-3 text-center" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            {t('auth.warehouse.storeLink')} <Link to="/store/login" style={{ color: 'var(--muted)', fontWeight: 600 }}>{t('auth.warehouse.storePortalLink')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
