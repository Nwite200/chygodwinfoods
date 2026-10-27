#!/usr/bin/env python3
import os

path = os.path.join(os.environ.get('HOME', '/'), 'Desktop/untitled folder 3/wrangler.toml')
# Actually use the known path
path = "/Users/a/Desktop/untitled folder 3/wrangler.toml"

with open(path, 'w') as f:
    f.write('name = "chygodwinfoods"\n')
    f.write('type = "webpack"\n')
    f.write('compatibility_date = "2026-10-12"\n')
    f.write('compatibility_flags = ["nodejs_compat"]\n')
    f.write('\n')
    f.write('script = "worker.js"\n')
    f.write('\n')
    f.write('[d1]\n')
    f.write('binding = "DB"\n')
    f.write('database_name = "chygodwinfoods"\n')
    f.write('path = "./d1.sqlite"\n')
    f.write('\n')
    f.write('[env.production]\n')
    f.write('ADMIN_EMAIL = "chygodwinfoods@gmail.com"\n')
    f.write('ADMIN_PASSWORD_HASH = "a1cc34df791b1b48371292a73545297db5072e1ad90697f4a2a6d44f6783a5b9:35e2fa8261058af6d201246b009f4b96c768d7fedba4d8bf2942d2f472446ce6"\n')
    f.write('\n')
    f.write('[[kv_namespaces]]\n')
    f.write('binding = "ADMIN_LIMITS_KV"\n')
    f.write('id = "87b134c887d34afba5da0a26eb3c6a7b"\n')
    f.write('\n')
    f.write('[assets]\n')
    f.write('directory = "./dist"\n')

print("wrangler.toml rewritten successfully")