import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { translateText } from '../../services/translate';

export default function WarehouseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!user || user.role !== 'warehouse') navigate('/warehouse/login');
  }, [user]);

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    if (orders.length) translateOrderItems(orders);
  }, [i18n.language]);

  const translateOrderItems = async (rawOrders) => {
    const lang = i18n.language?.startsWith('pt') ? 'pt' : 'en';
    const translated = await Promise.all(rawOrders.map(async (order) => ({
      ...order,
      OrderItems: await Promise.all((order.OrderItems || []).map(async (oi) => ({
        ...oi,
        Item: oi.Item ? { ...oi.Item, name: await translateText(oi.Item.name, lang) } : oi.Item,
      }))),
    })));
    setOrders(translated);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/warehouse');
      await translateOrderItems(data);
    } finally { setLoading(false); }
  };

  const handleStatus = async (orderId, status) => {
    setProcessing(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating order');
    } finally { setProcessing(null); }
  };

  const counts = {
    pending: orders.filter((o) => o.status === 'pending').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    rejected: orders.filter((o) => o.status === 'rejected').length,
  };

  const statusMeta = (status) => ({
    pending:  { badge: 'bg-warning text-dark', icon: 'bi-hourglass-split', label: t('orders.status.pending') },
    accepted: { badge: 'bg-success',           icon: 'bi-check-circle',    label: t('orders.status.accepted') },
    rejected: { badge: 'bg-danger',            icon: 'bi-x-circle',        label: t('orders.status.rejected') },
  }[status]);

  if (loading) return <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}><div className="spinner-border" /></div>;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('orders.warehouseTitle')}</h1>
        <p className="page-subtitle">{t('orders.warehouseSubtitle')}</p>
      </div>

      <div className="stats-row">
        <div className="stat-card" style={{ '--accent-color': '#f59e0b' }}>
          <div className="stat-value">{counts.pending}</div>
          <div className="stat-label">{t('orders.awaiting')}</div>
          <i className="bi bi-hourglass-split stat-icon" />
        </div>
        <div className="stat-card" style={{ '--accent-color': '#22c55e' }}>
          <div className="stat-value">{counts.accepted}</div>
          <div className="stat-label">{t('orders.accepted')}</div>
          <i className="bi bi-check-circle stat-icon" />
        </div>
        <div className="stat-card" style={{ '--accent-color': '#ef4444' }}>
          <div className="stat-value">{counts.rejected}</div>
          <div className="stat-label">{t('orders.rejected')}</div>
          <i className="bi bi-x-circle stat-icon" />
        </div>
        <div className="stat-card" style={{ '--accent-color': 'var(--brand)' }}>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">{t('orders.total')}</div>
          <i className="bi bi-inbox stat-icon" />
        </div>
      </div>

      <div className="page-body" style={{ paddingTop: 0 }}>
        {orders.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <i className="bi bi-inbox" />
              <p>{t('orders.noWarehouseOrders')}<br />{t('orders.noWarehouseOrdersSub')}</p>
            </div>
          </div>
        ) : (
          orders.map((order) => {
            const meta = statusMeta(order.status);
            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{t('orders.orderNum')}{order.id}</span>
                      <span className="ms-2 text-muted" style={{ fontSize: '0.8rem' }}>
                        {t('orders.from')} <strong>{order.Store?.name}</strong>
                      </span>
                    </div>
                    <span className={`badge ${meta.badge}`}><i className={`bi ${meta.icon} me-1`} />{meta.label}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                      {new Date(order.createdAt).toLocaleDateString(i18n.language?.startsWith('pt') ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {order.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleStatus(order.id, 'accepted')} disabled={processing === order.id}>
                          <i className="bi bi-check-lg me-1" />{t('orders.accept')}
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleStatus(order.id, 'rejected')} disabled={processing === order.id}>
                          <i className="bi bi-x-lg me-1" />{t('orders.reject')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="order-card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{t('orders.itemCol')}</th>
                        <th>{t('orders.qtyRequested')}</th>
                        <th>{t('orders.unitCol')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.OrderItems?.map((oi) => (
                        <tr key={oi.id}>
                          <td className="fw-medium">{oi.Item?.name}</td>
                          <td>{oi.quantity_requested}</td>
                          <td className="text-muted">{oi.Item?.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {order.notes && (
                  <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <i className="bi bi-chat-left-text me-1" />{t('orders.notes')}: {order.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
