# Google Search Console — Mountain Edge Homes

Use the **same host** everywhere: `https://mountainedgehomes.com` (matches `robots.txt`, `sitemap.xml`, and page `canonical` links).

## 1. Add a property

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add property → **URL prefix** → `https://mountainedgehomes.com/`
3. Complete **ownership verification** (recommended: **HTML tag**).
   - Copy the `<meta name="google-site-verification" content="…">` line from GSC.
   - Paste it into `index.html` inside `<head>` (see the comment near the top of the file), deploy, then click **Verify** in GSC.

## 2. Submit the sitemap

1. In GSC: **Sitemaps** → add `https://mountainedgehomes.com/sitemap.xml`
2. Ensure the sitemap returns **HTTP 200** (after deploy, open that URL in a browser).

## 3. Confirm `robots.txt`

- Live URL: `https://mountainedgehomes.com/robots.txt`
- It should list `Sitemap: https://mountainedgehomes.com/sitemap.xml` and **not** block `/assets/` (CSS/JS/images needed for rendering).

## 4. After verification

- Use **URL Inspection** on important URLs (homepage, `homes-for-sale.html`, key neighborhoods).
- Request indexing **sparingly** for high-priority pages; routine crawls use the sitemap.

## 5. Optional

- **Google Analytics 4**: add your measurement ID in site scripts when ready (separate from GSC).
- **Bing Webmaster Tools**: import from GSC or add `https://mountainedgehomes.com/` separately.
