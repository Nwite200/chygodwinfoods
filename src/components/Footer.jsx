import React from 'react';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Truck, Building } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import StoreLogo from './StoreLogo';

export default function Footer({ onNavigate }) {
  return (
    <footer className="main-footer">
      <div className="section-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Tagline */}
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: 16, cursor: 'pointer' }} onClick={() => onNavigate('home')}>
              <StoreLogo size={52} />
              <div className="brand-text-block">
                <span className="brand-title">ChyGodwin</span>
                <span className="brand-subtitle">Foodstuff Global</span>
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.6', maxWidth: 280, fontStyle: 'italic' }}>
              Quality Food. Healthy Families. A Better Tomorrow.
            </p>
            <p style={{ color: '#CBD5E1', fontSize: '0.82rem', marginTop: 12, lineHeight: '1.5' }}>
              We sale Quality and affordable prices. We waybill and deliver Nationwide and beyond.
            </p>
            <div style={{ marginTop: 14 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#4ADE80', fontWeight: 700 }}>
                <Truck size={14} /> Nationwide &amp; Global Waybill Logistics
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a></li>
              <li><a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Shop All 62 Staples</a></li>
              <li><a href="#categories" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Categories</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} style={{ color: '#4ADE80', fontWeight: 700 }}>Admin Dashboard</a></li>
              <li><a href="#account" onClick={(e) => { e.preventDefault(); onNavigate('account'); }}>Track My Order</a></li>
            </ul>
          </div>

          {/* Col 3: Payment & Bank Details */}
          <div className="footer-col">
            <h4>Official Bank Details</h4>
            <div style={{ background: '#1E293B', padding: 14, borderRadius: 10, border: '1px solid #334155', fontSize: '0.82rem' }}>
              <div style={{ color: '#94A3B8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Bank Name:</div>
              <div style={{ color: '#4ADE80', fontWeight: 900, fontSize: '0.95rem', marginBottom: 6 }}>
                Moniepoint Microfinance Bank
              </div>

              <div style={{ color: '#94A3B8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Account Number:</div>
              <div style={{ color: '#FEF08A', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.05em', marginBottom: 6 }}>
                8063654393
              </div>

              <div style={{ color: '#94A3B8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Account Name:</div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem' }}>
                Chygodwin Foodstuffs Global Concept
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="footer-col">
            <h4>Contact &amp; Location</h4>
            <div className="footer-contact-item">
              <MapPin size={16} style={{ color: '#22C55E', flexShrink: 0 }} />
              <span>Located at Nkwelle Light of God estate, Anambra State</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={16} style={{ color: '#22C55E' }} />
              <span>Call / WhatsApp: 08063654393</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} style={{ color: '#22C55E' }} />
              <span>chygodwinfoodstuffs@gmail.com</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => onNavigate('admin')}
                style={{
                  background: 'rgba(34,197,94,0.15)',
                  color: '#4ADE80',
                  border: '1px solid rgba(34,197,94,0.3)',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ShieldCheck size={14} /> Open Store Admin Console
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © 2026 Chygodwin Foodstuffs Global Concept. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8' }}>
            <span>Made with</span>
            <Heart size={14} fill="#22C55E" color="#22C55E" />
            <span>for healthy Nigerian families nationwide &amp; beyond</span>
          </div>
          <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#64748B' }}>
            Maintained by <strong style={{ color: '#4ADE80' }}>TK Software Solutions</strong>
            {' '}— <a href="tel:07062129563" style={{ color: '#4ADE80', fontWeight: 700, textDecoration: 'none' }}>07062129563</a>
            {' '}• <a href="https://wa.me/2347062129563" target="_blank" rel="noreferrer" style={{ color: '#4ADE80', fontWeight: 700, textDecoration: 'none' }}>WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
