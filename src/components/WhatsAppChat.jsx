import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, ShoppingCart, Phone, ChevronRight, Volume2, VolumeX, Mic } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export const formatNaira = (n) => `₦${Number(n || 0).toLocaleString()}`;
export function buildWhatsAppLink(message) {
  return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
}

const QUICK = [
  { id: 'best', label: 'BESTSELLERS' },
  { id: 'order', label: 'ORDER ON WHATSAPP' },
  { id: 'delivery', label: 'DELIVERY INFO' },
  { id: 'human', label: 'TALK TO HUMAN' },
];

const STOP = new Set(['price','cost','how','much','have','need','want','buy','order','show','find','search','what','the','for','with','is','are','any','do','you','sell','get']);

// --- Voice helpers (browser Speech Synthesis + Speech Recognition, no keys needed) ---
function pickVoice(lang = 'en') {
  try {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en-ng'))
      || voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'))
      || voices[0] || null;
  } catch { return null; }
}
function speakText(text, enabled) {
  try {
    if (!enabled || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    try { synth.resume(); } catch {}
    synth.cancel();
    const clean = String(text || '').replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, '').slice(0, 280);
    if (!clean.trim()) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1; u.pitch = 1;
    const v = pickVoice();
    if (v) u.voice = v;
    synth.speak(u);
    // Chrome quirk: long utterances pause — keep alive
    try {
      clearInterval(speakText._t);
      speakText._t = setInterval(() => { try { synth.resume(); } catch {} }, 5000);
      u.onend = () => clearInterval(speakText._t);
    } catch {}
  } catch { /* ignore */ }
}
function findProducts(query, products, limit = 4) {
  const q = (query || '').toLowerCase().trim();
  if (!q || q.length < 2) return [];
  const words = q.split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (!words.length) return [];
  return products.map((p) => {
    const hay = `${p.name} ${p.categoryName || ''} ${p.category || ''} ${p.brand || ''}`.toLowerCase();
    let s = 0;
    words.forEach((w) => { if ((p.name || '').toLowerCase().includes(w)) s += 5; else if (hay.includes(w)) s += 2; });
    return { p, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.p);
}

function botReply(input, products, cartItems, cartTotal) {
  const raw = (input || '').trim();
  const q = raw.toLowerCase();
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|how far|morning)\b/.test(q))
    return { text: `Hello! \uD83D\uDE0A Great to see you.\nAre you shopping for rice, oil, garri, beans, or a combo today?\n\nTap \uD83D\uDD25 Bestsellers or type e.g. "price of palm oil".` };
  if (q.includes('deliver') || q.includes('waybill') || q.includes('shipping') || q.includes('location') || q.includes('address') || q.includes('nationwide'))
    return { text: `\uD83D\uDE9A ${STORE_INFO.deliveryNotice}!\n\n\uD83D\uDCCD Shop: ${STORE_INFO.address}\n\uD83D\uDCDE Call/WhatsApp: ${STORE_INFO.phone}\n\nTell me your town (e.g. "delivery to Lagos") and I'll prep your WhatsApp order with the address ready.` };
  if (q.includes('pay') || q.includes('account') || q.includes('transfer') || q.includes('bank') || q.includes('moniepoint'))
    return { text: `\uD83D\uDCB3 Payment is easy:\n\nBank: ${STORE_INFO.bank.bankName}\nAcct: ${STORE_INFO.bank.accountNumber}\nName: ${STORE_INFO.bank.accountName}\n\nAfter transfer, send your receipt on WhatsApp to ${STORE_INFO.phone} for immediate dispatch. \u2705` };
  if (q.includes('track') || q.includes('my order') || q.includes('status') || q.includes('receipt'))
    return { text: `\uD83D\uDCE6 To track, open Account \u2192 Track My Order, or send your order ID to us on WhatsApp and we'll check it live for you.` };
  if (q.includes('human') || q.includes('agent') || q.includes('call me') || q.includes('speak') || q.includes('talk'))
    return { text: `Of course \u2014 a real person is ready for you. \uD83D\uDCAC\nTap below to chat live on WhatsApp (${STORE_INFO.phone}). We reply fast!`, human: true };
  if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
    const hits = findProducts(q, products, 4);
    if (!hits.length) return { text: `Tell me the product name (e.g. "how much is yam" or "price of honey") and I'll check it right away. \uD83E\uDDFE` };
    return { text: `Here you go \uD83D\uDCB0:\n` + hits.map((p) => `\u2022 ${p.name} \u2014 ${formatNaira(p.price)}`).join('\n') + `\n\nWant me to add one to your cart or send the order on WhatsApp?`, products: hits };
  }
  if (q.includes('cart') || q.includes('checkout') || q.includes('order') || q.includes('buy') || q.includes('i want') || q.includes('i need')) {
    const hits = findProducts(q, products, 4);
    if (hits.length) return { text: `Nice choice! I found these for you \uD83D\uDC47\nTap Add, or tap Order on WhatsApp and I'll forward it to our store line.`, products: hits };
    if (cartItems.length) return { text: `You have ${cartItems.length} item(s) in your cart (${formatNaira(cartTotal)}). Tap \uD83D\uDED2 Order on WhatsApp below and I'll forward everything to ${STORE_INFO.phone}. \uD83D\uDE80`, order: true };
    return { text: `Tell me what you need \u2014 e.g. "I want 2 bags of rice" or "I need palm oil and garri" \u2014 and I'll find it + prepare a WhatsApp order. \uD83D\uDED2` };
  }
  const hits = findProducts(q, products, 4);
  if (hits.length) return { text: `I found ${hits.length} match(es) for "${raw}" \uD83D\uDC47`, products: hits };
  return { text: `Hmm, I didn't catch that. \uD83E\uDD14\nTry:\n\u2022 "price of garri"\n\u2022 "I want yam and beans"\n\u2022 "delivery to Abuja"\n\u2022 "order on whatsapp"\n\nOr tap \uD83D\uDCAC Talk to human.` };
}

export default function WhatsAppChat({ products = [], cartItems = [], onAddToCart }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(1);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [autoGreeted, setAutoGreeted] = useState(false);
  const recogRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 'bot-hi', from: 'bot', text: `Hello! Welcome to ${STORE_INFO.name}.\nI can check prices, find products, or send your order straight to WhatsApp.\n\nWhat would you like today?` },
  ]);
  const listRef = useRef(null);
  const cartTotal = useMemo(() => cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0), [cartItems]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    if (open) setUnread(0);
  }, [messages, open]);

  // Unlock speech audio on first user tap (browsers block autoplay voice otherwise)
  useEffect(() => {
    const unlock = () => {
      try {
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(' ');
          u.volume = 0;
          window.speechSynthesis.speak(u);
          window.speechSynthesis.cancel();
        }
      } catch {}
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Warm up browser voices (they load async)
  useEffect(() => {
    try {
      if ('speechSynthesis' in window) {
        const load = () => { try { window.speechSynthesis.getVoices(); } catch {} };
        load();
        window.speechSynthesis.onvoiceschanged = load;
      }
    } catch {}
  }, []);

  // Auto-welcome: 3.5s after load, auto-open chat with greeting.
  // Voice fires only after a user tap (browser autoplay rule) — until then show pulsing CTA.
  const [userTapped, setUserTapped] = useState(false);
  const [greetedBeforeTap, setGreetedBeforeTap] = useState(false);
  useEffect(() => {
    const tap = () => setUserTapped(true);
    window.addEventListener('pointerdown', tap);
    window.addEventListener('touchstart', tap);
    window.addEventListener('keydown', tap);
    return () => {
      window.removeEventListener('pointerdown', tap);
      window.removeEventListener('touchstart', tap);
      window.removeEventListener('keydown', tap);
    };
  }, []);
  useEffect(() => {
    if (autoGreeted) return;
    const t = setTimeout(() => {
      const greet = `Hello and welcome to ${STORE_INFO.name}! I can check prices, find products, or send your order straight to WhatsApp on ${STORE_INFO.phone}. What are you shopping for today?`;
      setMessages((p) => [...p, { id: `b-auto-${Date.now()}`, from: 'bot', text: greet, order: false }]);
      setUnread(1);
      setOpen(true);
      if (!userTapped) setGreetedBeforeTap(true);
      else speakText(greet, voiceOn);
      setAutoGreeted(true);
    }, 3500);
    return () => clearTimeout(t);
  }, [autoGreeted, userTapped, voiceOn]);
  // If greeting appeared before first tap, speak it on first tap
  useEffect(() => {
    if (userTapped && greetedBeforeTap) {
      setGreetedBeforeTap(false);
      const last = `Hello and welcome to ${STORE_INFO.name}! What are you shopping for today?`;
      setTimeout(() => speakText(last, voiceOn), 300);
    }
  }, [userTapped, greetedBeforeTap, voiceOn]);

  const sendOrder = () => {
    let msg;
    if (cartItems.length) {
      const lines = cartItems.map((i, idx) => `${idx + 1}. ${i.name} x${i.quantity || 1} - ${formatNaira((i.price || 0) * (i.quantity || 1))}`);
      msg = `Hello ${STORE_INFO.name}! I want to place this order:\n\n${lines.join('\n')}\n\nTotal: ${formatNaira(cartTotal)}\n\nMy name:\nDelivery town/address:\n\nPlease confirm availability + delivery. Thank you!`;
    } else {
      msg = `Hello ${STORE_INFO.name}! I want to make an order please.\n\nMy list:\n1. \n2. \n\nMy name:\nDelivery town/address:`;
    }
    setMessages((p) => [...p, { id: `u-${Date.now()}`, from: 'user', text: 'I want to order on WhatsApp' }, { id: `b-${Date.now()}`, from: 'bot', text: `Perfect! Opening WhatsApp to ${STORE_INFO.phone} with your order note.`, order: true }]);
    setTimeout(() => window.open(buildWhatsAppLink(msg), '_blank'), 500);
  };

  const send = (override) => {
    const text = (override ?? input).trim();
    if (!text) return;
    setMessages((p) => [...p, { id: `u-${Date.now()}`, from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      const r = botReply(text, products, cartItems, cartTotal);
      setMessages((p) => [...p, { id: `b-${Date.now()}-${Math.random()}`, from: 'bot', ...r }]);
      speakText(r.text, voiceOn);
      if (!open) setUnread((u) => u + 1);
    }, 450);
  };

  const quick = (id) => {
    if (id === 'best') {
      const best = [...products].filter((p) => p.inStock !== false).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
      setMessages((p) => [...p, { id: `u-${Date.now()}`, from: 'user', text: 'Show bestsellers' }]);
      setTimeout(() => setMessages((p) => [...p, { id: `b-${Date.now()}`, from: 'bot', text: `These are flying off the shelf this week:`, products: best }]), 400);
      return;
    }
    if (id === 'order') { sendOrder(); return; }
    if (id === 'delivery') { send('delivery info please'); return; }
    if (id === 'human') { window.open(buildWhatsAppLink(`Hello ${STORE_INFO.name}! I need help with my order please.`), '_blank'); return; }
  };

  const toggleListen = () => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { alert('Voice input is not supported in this browser. Please type instead.'); return; }
      if (listening && recogRef.current) { recogRef.current.stop(); setListening(false); return; }
      const rec = new SR();
      recogRef.current = rec;
      rec.lang = 'en-NG';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript;
        if (transcript) send(transcript);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      rec.start();
      setListening(true);
    } catch { setListening(false); }
  };
  return (
    <>
      {!open && (
        <button onClick={() => { setOpen(true); setUnread(0); }} aria-label="Chat with us on WhatsApp"
          title={greetedBeforeTap ? 'Tap to hear my welcome!' : 'Chat with us on WhatsApp'}
          style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 5000, width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(37,211,102,0.45)', animation: greetedBeforeTap ? 'chatPulse 1.2s ease-in-out infinite' : 'none' }}>
          <MessageCircle size={28} />
          {unread > 0 && <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 22, height: 22, borderRadius: 9999, background: '#DC2626', color: '#fff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', border: '2px solid #fff' }}>{unread}</span>}
        </button>
      )}
      <style>{`@keyframes chatPulse { 0%,100% { transform: scale(1); box-shadow: 0 12px 30px rgba(37,211,102,0.45);} 50% { transform: scale(1.12); box-shadow: 0 12px 42px rgba(37,211,102,0.75);} }`}</style>
      {open && (
        <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 5000, width: 'min(380px, calc(100vw - 32px))', height: 'min(560px, calc(100vh - 120px))', background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', border: '1px solid #E2E8F0' }}>
          <div style={{ background: '#075E54', color: '#fff', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>C</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{STORE_INFO.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Online - replies instantly</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 10px', overflowX: 'auto', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC', alignItems: 'center' }}>
            {QUICK.map((q) => <button key={q.id} onClick={() => quick(q.id)} style={{ whiteSpace: 'nowrap', background: '#fff', border: '1px solid #BBF7D0', color: '#166534', borderRadius: 9999, padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{q.label}</button>)}
            <button onClick={() => setVoiceOn((v) => { const n = !v; if (!n && 'speechSynthesis' in window) window.speechSynthesis.cancel(); return n; })} title={voiceOn ? 'Mute bot voice' : 'Unmute bot voice'} style={{ marginLeft: 'auto', whiteSpace: 'nowrap', background: voiceOn ? '#DCFCE7' : '#F1F5F9', border: '1px solid #BBF7D0', color: '#166534', borderRadius: 9999, padding: '6px 10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              {voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />} {voiceOn ? 'Voice on' : 'Muted'}
            </button>
          </div>
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#ECE5DD', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((m) => (
              <div key={m.id} style={{ alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                <div style={{ background: m.from === 'user' ? '#DCF8C6' : '#fff', borderRadius: 12, padding: '9px 12px', fontSize: '0.83rem', lineHeight: 1.5, whiteSpace: 'pre-line', color: '#1F2937', boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }}>
                  <div>{m.text}</div>
                  {m.from === 'bot' && (
                    <button onClick={() => speakText(m.text, true)} title="Listen to this reply" style={{ marginTop: 6, background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', borderRadius: 9999, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Volume2 size={12} /> Listen
                    </button>
                  )}
                </div>
                {m.products && m.products.length > 0 && (
                  <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {m.products.map((p) => (
                      <div key={p.id} style={{ background: '#fff', borderRadius: 10, padding: 8, display: 'flex', gap: 8, alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#062E1D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0C6837' }}>{formatNaira(p.price)}</div>
                        </div>
                        <button onClick={() => onAddToCart && onAddToCart(p)} style={{ background: '#22C55E', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 10px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}>Add</button>
                      </div>
                    ))}
                  </div>
                )}
                {(m.order || m.human) && (
                  <button onClick={() => { if (m.human) window.open(buildWhatsAppLink(`Hello ${STORE_INFO.name}! I need help please.`), '_blank'); else sendOrder(); }}
                    style={{ marginTop: 6, width: '100%', background: '#25D366', border: 'none', color: '#fff', borderRadius: 10, padding: '10px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {m.human ? <Phone size={16} /> : <ShoppingCart size={16} />}
                    {m.human ? `Chat live: ${STORE_INFO.phone}` : `Send order on WhatsApp${cartItems.length ? ` (${formatNaira(cartTotal)})` : ''}`}
                  </button>
                )}
              </div>
            ))}
          </div>
          {cartItems.length > 0 && (
            <button onClick={sendOrder} style={{ background: '#F0FDF4', border: 'none', borderTop: '1px solid #BBF7D0', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}><ShoppingCart size={15} /> {cartItems.length} in cart</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0C6837', display: 'flex', alignItems: 'center', gap: 2 }}>{formatNaira(cartTotal)} - Order now <ChevronRight size={15} /></span>
            </button>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ display: 'flex', gap: 8, padding: 10, background: '#fff', borderTop: '1px solid #E2E8F0', alignItems: 'center' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={listening ? 'Listening... speak now' : 'Ask price, order, delivery...'} style={{ flex: 1, border: listening ? '2px solid #DC2626' : '1px solid #E2E8F0', borderRadius: 9999, padding: '10px 14px', fontSize: '0.85rem', outline: 'none' }} />
            <button type="button" onClick={toggleListen} aria-label="Voice input" title="Tap and speak your order" style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', background: listening ? '#DC2626' : '#0C6837', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mic size={18} /></button>
            <button type="submit" aria-label="Send message" style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', background: '#25D366', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={18} /></button>
          </form>
        </div>
      )}
    </>
  );
}

