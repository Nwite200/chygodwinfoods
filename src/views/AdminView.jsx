import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function AdminView({ orders }) {
  const [dealActive, setDealActive] = useState(true);

  const metrics = [
    {
      title: 'Total Products',
      val: '56',
      trend: '+16.5%',
      icon: <Package size={20} color="#0C6837" />
    },
    {
      title: 'Total Orders',
      val: '128',
      trend: '+24.0%',
      icon: <ShoppingCart size={20} color="#0284C7" />
    },
    {
      title: 'Total Customers',
      val: '243',
      trend: '+31.0%',
      icon: <Users size={20} color="#7C3AED" />
    },
    {
      title: 'Total Revenue',
      val: '₦1,245,600',
      trend: '+28.5%',
      icon: <TrendingUp size={20} color="#16A34A" />
    }
  ];

  const recentCustomers = [
    { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', spent: '₦45,200', orders: 4 },
    { id: 'CUST-002', name: 'Chinedu Okeke', email: 'chinedu.o@gmail.com', spent: '₦28,000', orders: 2 },
    { id: 'CUST-003', name: 'Ngozi Eze', email: 'ngozi.eze@outlook.com', spent: '₦32,500', orders: 3 },
    { id: 'CUST-004', name: 'Ifeanyi Mba', email: 'ifeanyi.mba@yahoo.com', spent: '₦18,900', orders: 1 }
  ];

  const lowStockItems = PRODUCTS.filter((p) => p.stockCount && p.stockCount <= 10);

  return (
    <div className="section-pad" style={{ background: '#F8FAFC' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0C6837', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Management Console
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#062E1D' }}>Admin Panel</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', background: '#DCFCE7', color: '#166534', padding: '6px 14px', borderRadius: 9999, fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, background: '#16A34A', borderRadius: '50%' }}></span>
              Live Store Connected
            </span>
          </div>
        </div>

        {/* 4 Top Metric Cards */}
        <div className="admin-metric-grid">
          {metrics.map((m, idx) => (
            <div key={idx} className="admin-card">
              <div className="admin-card-header">
                <span className="stat-title">{m.title}</span>
                {m.icon}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#062E1D' }}>{m.val}</div>
              <div style={{ marginTop: 6 }}>
                <span className="metric-trend">
                  <ArrowUpRight size={14} /> {m.trend}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: 4 }}>vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2 Columns: Tables & Side Widgets */}
        <div className="admin-columns-2">
          {/* Left Column: Recent Orders & Customers */}
          <div>
            {/* Recent Orders */}
            <div className="form-card">
              <h3 className="form-title">Recent Store Orders</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id}>
                        <td><strong>#{ord.id}</strong></td>
                        <td>{ord.customer}</td>
                        <td><strong>₦{ord.total.toLocaleString()}</strong></td>
                        <td>
                          <span
                            className={`status-badge ${
                              ord.status === 'Delivered'
                                ? 'status-delivered'
                                : ord.status === 'In Transit'
                                ? 'status-transit'
                                : 'status-processing'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td>{ord.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Customers */}
            <div className="form-card" style={{ marginTop: 24 }}>
              <h3 className="form-title">Recent Customers</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Total Spent</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCustomers.map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.email}</td>
                        <td><strong>{c.spent}</strong></td>
                        <td>{c.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Low Stock Alerts & Fresh Deals */}
          <div>
            {/* Low Stock Alerts */}
            <div className="form-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={18} color="#DC2626" />
                  <h3 className="form-title" style={{ margin: 0 }}>Low Stock Alerts</h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>
                  {lowStockItems.length} Items Critical
                </span>
              </div>

              <div>
                {lowStockItems.map((item) => (
                  <div key={item.id} className="low-stock-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'contain', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{item.name}</div>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.categoryName}</span>
                      </div>
                    </div>
                    <span className="stock-tag-red">
                      {item.stockCount} left
                    </span>
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: '100%',
                  marginTop: 14,
                  padding: '8px',
                  borderRadius: 8,
                  background: '#F1F5F9',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#062E1D',
                  textAlign: 'center'
                }}
                onClick={() => alert('Restock purchase requisition sent to warehouse team!')}
              >
                Trigger Automatic Reorder
              </button>
            </div>

            {/* Fresh Deals Banner Management */}
            <div
              style={{
                borderRadius: 16,
                padding: 24,
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #062E1D 0%, #0C6837 100%)',
                marginTop: 24,
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Sparkles size={16} color="#4ADE80" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#4ADE80' }}>
                  Live Promo Banner
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>
                Fresh Deals &amp; Special Offers
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#D1D5DB', lineHeight: '1.5', marginBottom: 16 }}>
                Currently offering up to 20% off selected Nigerian staples with promo code <code>CHY10</code>.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14 }}>
                <span style={{ fontSize: '0.82rem' }}>Campaign Status:</span>
                <button
                  style={{
                    background: dealActive ? '#22C55E' : '#64748B',
                    color: dealActive ? '#042416' : '#FFF',
                    padding: '4px 12px',
                    borderRadius: 9999,
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}
                  onClick={() => setDealActive(!dealActive)}
                >
                  {dealActive ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
