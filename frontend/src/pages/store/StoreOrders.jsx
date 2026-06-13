import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_META = {
  pending:  { badge: 'bg-warning text-dark', icon: 'bi-hourglass-split', label: 'Pending' },
  accepted: { badge: 'bg-success',           icon: 'bi-check-circle',    label: 'Accepted' },
  rejected: { badge: 'bg-danger',            icon: 'bi-x-circle',        label: 'Rejected' },
};

export default function StoreOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'store') navigate('/store/login');
  }, [user]);

  useEffect(() => {
    api.get('/orders/store').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  const counts = {
    pending: orders.filter((o) => o.status === 'pending').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    rejected: orders.filter((o) => o.status === 'rejected').length,
  };

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" />
    </div>
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track the status of your warehouse orders</p>
      </div>

      <div className="stats-row">
        <div className="stat-card" style={{ '--accent-color': '#f59e0b' }}>
          <div className="stat-value">{counts.pending}</div>
          <div className="stat-label">Awaiting Response</div>
          <i className="bi bi-hourglass-split stat-icon" />
        </div>
        <div className="stat-card" style={{ '--accent-color': '#22c55e' }}>
          <div className="stat-value">{counts.accepted}</div>
          <div className="stat-label">Accepted</div>
          <i className="bi bi-check-circle stat-icon" />
        </div>
        <div className="stat-card" style={{ '--accent-color': '#ef4444' }}>
          <div className="stat-value">{counts.rejected}</div>
          <div className="stat-label">Rejected</div>
          <i className="bi bi-x-circle stat-icon" />
        </div>
      </div>

      <div className="page-body" style={{ paddingTop: 0 }}>
        {orders.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <i className="bi bi-clipboard-check" />
              <p>No orders yet.<br />Browse stock and place your first order.</p>
            </div>
          </div>
        ) : (
          orders.map((order) => {
            const meta = STATUS_META[order.status];
            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>Order #{order.id}</span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-building me-1" />{order.Warehouse?.name}
                    </span>
                    <span className={`badge ${meta.badge}`}>
                      <i className={`bi ${meta.icon} me-1`} />{meta.label}
                    </span>
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="order-card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty Requested</th>
                        <th>Unit</th>
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
                    <i className="bi bi-chat-left-text me-1" />Notes: {order.notes}
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
