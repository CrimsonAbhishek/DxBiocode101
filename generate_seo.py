import json
import os

BASE_URL = "https://dxbiocode.com"

# Load products
data_path = r"d:\Dx bio code\Frontend\src\data\products.json"
with open(data_path, "r", encoding="utf-8") as f:
    products = json.load(f)["products"]

sitemap_urls = [
    f"{BASE_URL}/",
    f"{BASE_URL}/products",
    f"{BASE_URL}/service",
    f"{BASE_URL}/about",
    f"{BASE_URL}/contact",
    f"{BASE_URL}/careers",
    f"{BASE_URL}/quote"
]

for p in products:
    sitemap_urls.append(f"{BASE_URL}/products/{p['slug']}")

tags = set()
for p in products:
    if 'tags' in p:
        for t in p['tags']:
            tags.add(t.lower().replace(' ', '-').replace('/', '-'))

for t in tags:
    sitemap_urls.append(f"{BASE_URL}/tag/{t}")

sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for url in sitemap_urls:
    sitemap_xml += f'  <url>\n    <loc>{url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n'
sitemap_xml += '</urlset>\n'

public_dir = r"d:\Dx bio code\Frontend\public"
os.makedirs(public_dir, exist_ok=True)

with open(os.path.join(public_dir, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(sitemap_xml)

robots_txt = f"""User-agent: *
Allow: /

Sitemap: {BASE_URL}/sitemap.xml
"""

with open(os.path.join(public_dir, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(robots_txt)

print("sitemap.xml and robots.txt generated successfully!")
