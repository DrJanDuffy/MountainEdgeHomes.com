# GBP alignment audit matrix — Mountain Edge Homes

**Canonical host:** `https://mountainedgehomes.com` (apex, no `www`). Keep Search Console, sitemap, and GBP website URL on this host.

**Single source of truth:** [`assets/js/site-contact.js`](assets/js/site-contact.js) — NAP, Maps search URL, review URL. Update when Google Business Profile changes, then sync visible copy and [`assets/js/local-business-schema.js`](assets/js/local-business-schema.js) (homepage entity only).

| Page | Canonical | Visible NAP | Hours (where shown) | Call / Directions / Reviews | JSON-LD notes |
|------|-----------|-------------|---------------------|----------------------------|---------------|
| index.html | Yes | Yes | Yes | Yes | RealEstateAgent `@graph` via local-business-schema.js, `@id` #organization |
| homes-for-sale.html | Yes | Yes | Yes | Footer | WebPage + RealEstateAgent `@id` #organization |
| buyers.html | Yes | Yes | — | Footer | WebPage + RealEstateAgent |
| home-value.html | Yes | Footer | Footer | Footer | WebPage + provider `@id` #organization |
| community.html | Yes | Yes | Yes | Footer | WebPage + RealEstateAgent `@id` #organization |
| neighborhoods.html | Yes | Yes | — | Footer | WebPage + publisher `@id` |
| neighborhood-*.html (8) | Yes | Footer | — | Footer | WebPage + publisher `@id` |
| neighborhood-template.html | Yes | — | — | — | Template for new neighborhood pages |
| blog.html | Yes | Yes | Yes | Yes (sidebar) | Blog + publisher `@id` |
| faq.html | Yes | Footer | — | Footer | FAQ / WebPage as per page |
| testimonials.html | Yes | Footer | — | Footer | WebPage + publisher `@id` |
| our-team.html | Yes | Footer | — | Footer | RealEstateAgent (team) |
| market-reports.html | Yes | — | — | — | Per page head |
| schedule.html | Yes | Yes | — | Yes | WebPage + RealEstateAgent |
| property-details.html | Yes | Top strip | — | Yes | WebPage + publisher `@id` |
| resident-portal.html | Yes (noindex) | Footer | — | Footer | Utility |
| privacy.html | Yes | Yes | — | — | Legal |
| terms.html | Yes | Yes | — | — | Legal |
| sitemap.html | Yes | Footer | — | Footer | WebPage + publisher `@id` |
| assets/html/global-map.html | — | — | — | — | Asset; include in deploy if used |

**Integrity**

- Removed fabricated `Review` / `AggregateRating` from [`local-business-schema.js`](assets/js/local-business-schema.js).
- `hasMap` uses the same Maps **search** URL as visible Directions (address-based). Replace with the exact **Place** URL from GBP when available.
- `googleReviewUrl` in site-contact.js must match the live GBP review link.

**Manual verification**

- [ ] Confirm NAP, hours, Maps link, and review link against Google Business Profile.
- [ ] Confirm `g.page/r/Mountains-Edge-Homes/review` is the correct listing.
