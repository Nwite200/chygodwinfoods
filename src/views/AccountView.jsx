import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Settings,
  LogOut,
  LogIn,
  Search
} from 'lucide-react';

export default function AccountView({
  orders,
  cartCount,
  wishlist,
  user,
  authLoading,
  authConfigured,
  authError,
  onGoogleSignIn,
  onSignOut,
  onNavigate
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trackingSearch, setTrackingSearch] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = () => {
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === trackingSearch.trim().toLowerCase() ||
        (o.tracking && o.tracking.toLowerCase() === trackingSearch.trim().toLowerCase())
    );
    setTrackingResult(found || 'not-found');
  };

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'Your account';

  if (authLoading) {
    return (
      <div className="section-pad">
        <div className="section-container" role="status">Checking your sign-in status...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="section-pad">
        <div className="section-container" style={{ maxWidth: 560 }}>
          <div className="form-card" style={{ textAlign: 'center', padding: '40px 28px' }}>
            <LogIn size={28} color="#0C6837" style={{ marginBottom: 12 }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#062E1D', marginBottom: 8 }}>
              Sign in to your account
            </h1>
            <p style={{ color: '#64748B', marginBottom: 24 }}>
              Continue with Google to view your account and orders.
            </p>
            {authError && (
              <p role="alert" style={{ color: '#B91C1C', marginBottom: 16 }}>
                {authError}
              </p>
            )}
            {!authConfigured && (
              <p role="status" style={{ color: '#64748B', marginBottom: 16 }}>
                Google sign-in is not configured for this deployment yet.
              </p>
            )}
            <button
              className="btn-primary-pill"
              style={{ justifyContent: 'center' }}
              onClick={onGoogleSignIn}
              disabled={!authConfigured}
            >
              <LogIn size={18} />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-pad">
      <div className="section-container">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="user-profile-widget">
              <div className="user-avatar">{displayName.charAt(0).toUpperCase()}</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#062E1D' }}>{displayName}</h4>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{user.email}</span>
              </div>
            </div>

            <button
              className={`dash-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              className={`dash-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={18} />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              className={`dash-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={18} />
              <span>Addresses</span>
            </button>

            <button
              className={`dash-nav-btn ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              <CreditCard size={18} />
              <span>Payment Methods</span>
            </button>

            <button
              className={`dash-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <Heart size={18} />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            <button
              className={`dash-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>

            <button
              className="dash-nav-btn"
              style={{ color: '#DC2626', marginTop: 12 }}
              onClick={onSignOut}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </aside>

          {/* Main Dashboard Content */}
          <main>
            {/* Header Greeting */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#062E1D' }}>
                Welcome back, {displayName}!
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Here's what's happening with your account and orders.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="stat-cards-grid">
              <div className="stat-card">
                <span className="stat-title">Total Orders</span>
                <div className="stat-val">{orders.length}</div>
              </div>
              <div className="stat-card">
                <span className="stat-title">In Cart</span>
                <div className="stat-val" style={{ color: '#0C6837' }}>{cartCount}</div>
              </div>
              <div className="stat-card">
                <span className="stat-title">Wishlist Items</span>
                <div className="stat-val" style={{ color: '#EF4444' }}>{wishlist.length}</div>
              </div>
            </div>

            {/* Track Order Bar */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: 20,
                border: '1px solid #E2E8F0',
                marginBottom: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <Search size={20} color="#0C6837" />
              <input
                type="text"
                placeholder="Enter Order ID (#CSF20250930) or Tracking number..."
                style={{ flex: 1, border: 'none', fontSize: '0.9rem', outline: 'none' }}
                value={trackingSearch}
                onChange={(e) => setTrackingSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              />
              <button
                className="btn-primary-pill"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                onClick={handleTrack}
              >
                Track Order
              </button>
            </div>

            {trackingResult && (
              <div
                style={{
                  background: trackingResult === 'not-found' ? '#FEF2F2' : '#F0FDF4',
                  border: `1px solid ${trackingResult === 'not-found' ? '#FECACA' : '#BBF7D0'}`,
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 24,
                  fontSize: '0.88rem'
                }}
              >
                {trackingResult === 'not-found' ? (
                  <p style={{ color: '#DC2626' }}>No order found matching "{trackingSearch}".</p>
                ) : (
                  <div>
                    <strong style={{ color: '#166534' }}>Order #{trackingResult.id} Found!</strong>
                    <p style={{ marginTop: 4 }}>
                      Status: <strong>{trackingResult.status}</strong> | Total: ₦{trackingResult.total.toLocaleString()} | Tracking Code: <code>{trackingResult.tracking}</code>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Recent Orders Section */}
            <div className="form-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <h3 className="form-title" style={{ margin: 0 }}>Recent Orders</h3>
                <button
                  style={{ fontSize: '0.82rem', color: '#0C6837', fontWeight: 700 }}
                  onClick={() => setActiveTab('orders')}
                >
                  View All Orders &gt;
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <strong style={{ color: '#062E1D' }}>#{ord.id}</strong>
                        </td>
                        <td>{ord.date}</td>
                        <td>
                          {ord.items && ord.items.length > 0
                            ? ord.items.map((i) => i.name || i.title).join(', ').slice(0, 32) + '...'
                            : 'Foodstuff pack'}
                        </td>
                        <td>
                          <strong>₦{ord.total.toLocaleString()}</strong>
                        </td>
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
                        <td>
                          <button
                            style={{
                              fontSize: '0.78rem',
                              color: '#0C6837',
                              fontWeight: 700,
                              background: '#F0FDF4',
                              padding: '4px 10px',
                              borderRadius: 9999,
                              border: '1px solid #BBF7D0'
                            }}
                            onClick={() => {
                              setTrackingSearch(ord.id);
                              setTrackingResult(ord);
                            }}
                          >
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  padding: 16,
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigate('shop')}
              >
                <div style={{ fontWeight: 700, color: '#062E1D', fontSize: '0.9rem' }}>📦 Reorder Staples</div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>Fast repeat orders of your favorite Semo, Garri &amp; Oil</p>
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  padding: 16,
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('addresses')}
              >
                <div style={{ fontWeight: 700, color: '#062E1D', fontSize: '0.9rem' }}>📍 My Addresses</div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>Manage shipping addresses in Onitsha, Lagos &amp; Abuja</p>
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  padding: 16,
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer'
                }}
                onClick={() => alert('Customer Support: Call +234 801 234 5678 or Email info@chygodwin.com')}
              >
                <div style={{ fontWeight: 700, color: '#062E1D', fontSize: '0.9rem' }}>💬 Support Helpdesk</div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>Live WhatsApp chat &amp; phone assistance</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
