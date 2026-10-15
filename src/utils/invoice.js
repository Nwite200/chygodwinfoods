import { jsPDF } from 'jspdf';
import { STORE_INFO } from '../data/products';

const naira = (n) => `NGN ${Number(n || 0).toLocaleString()}`;

export function buildInvoicePdf({ order, customer = {}, subtotal, deliveryCost, total }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 56;

  // Header band
  doc.setFillColor(6, 46, 29);
  doc.rect(0, 0, W, 118, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(STORE_INFO.name, M, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(220, 252, 231);
  doc.text(STORE_INFO.tagline, M, 62);
  doc.text(`${STORE_INFO.address} | ${STORE_INFO.phone} | ${STORE_INFO.email}`, M, 78);
  doc.text(`${STORE_INFO.deliveryNotice}.`, M, 93);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', W - M, 52, { align: 'right' });
  doc.setFontSize(11);
  doc.text(`#${order?.id || 'DRAFT'}`, W - M, 70, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Date: ${order?.date || new Date().toLocaleDateString()}`, W - M, 86, { align: 'right' });
  doc.text(`Tracking: ${order?.tracking || '-'}`, W - M, 100, { align: 'right' });

  y = 150;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Bill To', M, y);
  doc.text('Payment', W - M, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 16;
  doc.text(`${customer.fullName || order?.customer || ''}`, M, y);
  doc.text(`${order?.paymentMethod || customer.paymentMethod || ''}`, W - M, y, { align: 'right' });
  y += 14;
  doc.text(`${customer.phone || ''}  ${customer.email || order?.email || ''}`, M, y);
  doc.text(`Status: ${order?.status || 'Processing'}`, W - M, y, { align: 'right' });
  y += 14;
  const addr = `${customer.address || ''}${customer.city ? `, ${customer.city}` : ''}${customer.state ? `, ${customer.state}` : ''}`;
  if (addr.replace(/[, ]/g, '')) {
    doc.text(addr.slice(0, 90), M, y);
    y += 14;
  }
  doc.text(`Delivery: ${customer.deliveryMethod === 'express' ? 'Express' : 'Standard'}`, M, y);
  y += 26;

  // Items table
  doc.setFillColor(240, 253, 244);
  doc.rect(M, y - 14, W - M * 2, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 46, 29);
  doc.text('Item', M + 8, y + 2);
  doc.text('Qty', W - 250, y + 2);
  doc.text('Price', W - 180, y + 2);
  doc.text('Amount', W - M - 8, y + 2, { align: 'right' });
  y += 22;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  const items = Array.isArray(order?.items) ? order.items : [];
  items.forEach((it, i) => {
    if (y > 720) { doc.addPage(); y = 70; }
    const name = String(it.name || `Item ${i + 1}`).slice(0, 48);
    const qty = Number(it.quantity || 1);
    const price = Number(it.price || 0);
    doc.text(name, M + 8, y);
    doc.text(String(qty), W - 250, y);
    doc.text(naira(price), W - 180, y);
    doc.text(naira(price * qty), W - M - 8, y, { align: 'right' });
    y += 18;
  });

  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(M, y, W - M, y);
  y += 18;
  doc.setFontSize(11);
  doc.text('Subtotal', W - 200, y);
  doc.text(naira(subtotal ?? order?.subtotal ?? 0), W - M - 8, y, { align: 'right' });
  y += 18;
  doc.text('Delivery', W - 200, y);
  doc.text(naira(deliveryCost ?? order?.deliveryCost ?? 0), W - M - 8, y, { align: 'right' });
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(6, 46, 29);
  doc.text('Total', W - 200, y);
  doc.text(naira(total ?? order?.total ?? 0), W - M - 8, y, { align: 'right' });

  y += 34;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Bank: ${STORE_INFO.bank.bankName} | ${STORE_INFO.bank.accountNumber} | ${STORE_INFO.bank.accountName}`, M, y);
  y += 14;
  doc.text('Send transfer receipt on WhatsApp for immediate dispatch. Thank you for shopping with us!', M, y);
  y += 14;
  doc.text('© 2026 Chygodwin Foodstuffs Global Concept. All rights reserved. | Maintained by TK Software Solutions (07062129563).', M, y);

  return doc;
}

export function downloadInvoicePdf(args, filename) {
  const doc = buildInvoicePdf(args);
  doc.save(filename || `Chygodwin-Invoice-${args?.order?.id || Date.now()}.pdf`);
  return doc;
}
