// Usage: node scripts/import-products.mjs products-export.json > import.sql
// Turns a Supabase `app_products` export into SQL for Cloudflare D1.
//
// Export it in the Supabase SQL editor with:
//   select json_agg(app_products) from app_products;
// Accepted shapes: [{ id, data }] (data an object or a JSON string), or a plain
// array of product objects that each have an `id`.
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/import-products.mjs products-export.json > import.sql');
  process.exit(1);
}

let raw = JSON.parse(readFileSync(file, 'utf8'));
// The SQL editor wraps the result as [{ "json_agg": [...] }]
if (Array.isArray(raw) && raw.length === 1 && Array.isArray(raw[0]?.json_agg)) raw = raw[0].json_agg;
if (!Array.isArray(raw)) {
  console.error('Expected a JSON array of products.');
  process.exit(1);
}

const sqlString = (value) => `'${String(value).replace(/'/g, "''")}'`;
const lines = [];
let skipped = 0;

for (const row of raw) {
  let id = row?.id;
  let product = row?.data ?? row;
  if (typeof product === 'string') {
    try {
      product = JSON.parse(product);
    } catch {
      skipped += 1;
      continue;
    }
  }
  id = id ?? product?.id;
  if (!id || !product || typeof product !== 'object') {
    skipped += 1;
    continue;
  }
  lines.push(
    `INSERT INTO app_products (id, data) VALUES (${sqlString(id)}, ${sqlString(JSON.stringify({ ...product, id }))}) ` +
      'ON CONFLICT (id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP;'
  );
}

console.log(lines.join('\n'));
console.error(`Wrote ${lines.length} product(s)${skipped ? `, skipped ${skipped} unreadable row(s)` : ''}.`);
