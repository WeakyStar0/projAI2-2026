import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function WarehouseAuth({ mode }) {
  const [form, setForm] = useState({ name: '', location: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
        <div className="auth-left-logo"><span>Stock</span>er</div>
        <h2>Your warehouse backoffice, built for speed.</h2>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-box-seam" /></div>
          <p>Add and manage your full inventory in one place</p>
        </div>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-inbox" /></div>
          <p>Accept or reject store orders with one click</p>
        </div>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-graph-up" /></div>
          <p>Stock updates automatically when orders are accepted</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <h3>{isRegister ? 'Register warehouse' : 'Warehouse backoffice'}</h3>
          <p className="subtitle">{isRegister ? 'Set up your warehouse account' : 'Sign in to manage your stock'}</p>

          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="mb-3">
                  <label className="form-label">Warehouse Name</label>
                  <input
                    className="form-control form-control-lg"
                    placeholder="e.g. Armazém Norte"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    className="form-control form-control-lg"
                    placeholder="e.g. Porto, Portugal"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className="btn btn-dark w-100" style={{ padding: '0.65rem', fontSize: '0.9rem' }} disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-2" />}
              {isRegister ? 'Create Warehouse' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            {isRegister ? (
              <>Already registered? <Link to="/warehouse/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign in</Link></>
            ) : (
              <>No account? <Link to="/warehouse/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>Register</Link></>
            )}
          </div>
          <div className="mt-3 text-center" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            Are you a store? <Link to="/store/login" style={{ color: 'var(--muted)', fontWeight: 600 }}>Store Portal →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
