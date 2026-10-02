import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="main-footer">
      <div className="section-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Tagline */}
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: 16 }} onClick={() => onNavigate('home')}>
              <div className="brand-emblem">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12"/>
                  <path d="M7 12c2.5-3 6-3 8-1s2 5.5-1 7.5c-2.5 1.5-5 .5-6-1.5"/>
                  <path d="M12 6v6"/>
                </svg>
              </div>
              <div className="brand-text-block">
                <span className="brand-title">ChyGodwin</span>
                <span className="brand-subtitle">Foodstuff Global</span>
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.6', maxWidth: 280, fontStyle: 'italic' }}>
              Quality Food. Healthy Families. A Better Tomorrow.
            </p>
            <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 12, lineHeight: '1.5' }}>
              Bringing the freshest taste of homeland Nigeria to dining tables across the nation and across the diaspora.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a></li>
              <li><a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Shop</a></li>
              <li><a href="#categories" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Categories</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>About Us</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('account'); }}>Contact</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul className="footer-links">
              <li><a href="#faq" onClick={(e) => e.preventDefault()}>FAQ</a></li>
              <li><a href="#shipping" onClick={(e) => e.preventDefault()}>Shipping Policy</a></li>
              <li><a href="#returns" onClick={(e) => e.preventDefault()}>Returns &amp; Refunds</a></li>
              <li><a href="#terms" onClick={(e) => e.preventDefault()}>Terms &amp; Conditions</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <Phone size={16} style={{ color: '#22C55E' }} />
              <span>+234 801 234 5678</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} style={{ color: '#22C55E' }} />
              <span>info@chygodwin.com</span>
            </div>
            <div className="footer-contact-item">
              <MapPin size={16} style={{ color: '#22C55E', flexShrink: 0 }} />
              <span>Onitsha, Anambra State, Nigeria</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: 6 }}>Payment Channels</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ background: '#1E293B', color: '#CBD5E1', padding: '3px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}>VISA</span>
                <span style={{ background: '#1E293B', color: '#CBD5E1', padding: '3px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}>Mastercard</span>
                <span style={{ background: '#1E293B', color: '#CBD5E1', padding: '3px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}>Verve</span>
                <span style={{ background: '#1E293B', color: '#22C55E', padding: '3px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}>Transfer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © 2025 ChyGodwin Foodstuff Global. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8' }}>
            <span>Made with</span>
            <Heart size={14} fill="#22C55E" color="#22C55E" />
            <span>for authentic Nigerian culinary heritage</span>
          </div>
        </div>
      </div>

      {/* CODEX / TECH BAR - Recreated exactly as shown at the bottom of the visual reference */}
      <div className="codex-banner-bar" style={{ marginTop: 24 }}>
        <div className="codex-brand-badge">
          <div className="brand-emblem" style={{ width: 28, height: 28 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>C</span>
          </div>
          <div>
            <div style={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 800 }}>ChyGodwin Foodstuff Global</div>
            <div style={{ color: '#64748B', fontSize: '0.68rem' }}>Quality Food. Healthy Families. A Better Tomorrow.</div>
          </div>
        </div>

        <div className="tech-badges-list">
          <div className="tech-item">
            <span style={{ color: '#22C55E' }}>⚡</span>
            <span><strong>Vite + React</strong> Modern Web</span>
          </div>
          <div className="tech-item">
            <span style={{ color: '#38BDF8' }}>🔒</span>
            <span><strong>Supabase &amp; Auth</strong> Ready</span>
          </div>
          <div className="tech-item">
            <span style={{ color: '#F97316' }}>✉️</span>
            <span><strong>Mailgun</strong> Notifications</span>
          </div>
          <div className="tech-item">
            <span style={{ color: '#4ADE80' }}>🇳🇬</span>
            <span><strong>Proudly Nigerian</strong> Global Reach</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
