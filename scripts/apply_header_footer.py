"""
One-off helper: apply canonical header/footer from the Header Footer Expert Refresh plan.
Run from repo root: python scripts/apply_header_footer.py
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CALENDLY = "https://calendly.com/drjanduffy/appointment?hide_event_type_details=1&amp;hide_gdpr_banner=1"

# primary: home | buyers | homes | community | neighborhoods | team | None
# resource: blog | faq | testimonials | market | homevalue | schedulepage | None
FILE_META: dict[str, tuple[str | None, str | None]] = {
    "index.html": ("home", None),
    "buyers.html": ("buyers", None),
    "homes-for-sale.html": ("homes", None),
    "community.html": ("community", None),
    "neighborhoods.html": ("neighborhoods", None),
    "neighborhood-aspire.html": ("neighborhoods", None),
    "neighborhood-cascade.html": ("neighborhoods", None),
    "neighborhood-collina.html": ("neighborhoods", None),
    "neighborhood-mesa-valla.html": ("neighborhoods", None),
    "neighborhood-montelano.html": ("neighborhoods", None),
    "neighborhood-quintessa.html": ("neighborhoods", None),
    "neighborhood-san-gabriel.html": ("neighborhoods", None),
    "neighborhood-sierra-madre.html": ("neighborhoods", None),
    "neighborhood-template.html": ("neighborhoods", None),
    "our-team.html": ("team", None),
    "blog.html": (None, "blog"),
    "testimonials.html": (None, "testimonials"),
    "faq.html": (None, "faq"),
    "schedule.html": (None, "schedulepage"),
    "market-reports.html": (None, "market"),
    "home-value.html": (None, "homevalue"),
    "terms.html": (None, None),
    "privacy.html": (None, None),
    "sitemap.html": (None, None),
    "resident-portal.html": (None, None),
}


def cls(active: str | None, key: str | None) -> str:
    return ' class="active"' if active and key and active == key else ""


def build_header(filename: str) -> str:
    primary, resource = FILE_META.get(filename, (None, None))
    is_index = filename == "index.html"
    sh = "#services" if is_index else "index.html#services"
    ch = "#contact" if is_index else "index.html#contact"

    def pa(key: str, href: str, text: str) -> str:
        return f'                    <li><a href="{href}"{cls(primary, key)}>{text}</a></li>\n'

    def ra(key: str, href: str, text: str) -> str:
        return f'                            <li role="none"><a href="{href}" role="menuitem"{cls(resource, key)}>{text}</a></li>\n'

    lines: list[str] = []
    lines.append("    <header>\n")
    lines.append('        <div class="container header-inner">\n')
    lines.append('            <div class="logo">\n')
    lines.append('                <a href="index.html" class="site-name">Mountain Edge Homes</a>\n')
    lines.append("            </div>\n")
    lines.append('            <nav id="site-navigation" class="site-nav" aria-label="Main">\n')
    lines.append('                <ul id="primary-nav">\n')
    lines.extend(
        [
            pa("home", "index.html", "Home"),
            pa("buyers", "buyers.html", "Buyers"),
            pa("homes", "homes-for-sale.html", "Homes for sale"),
            pa("community", "community.html", "Community"),
            pa("neighborhoods", "neighborhoods.html", "Neighborhoods"),
            f'                    <li><a href="{sh}">Services</a></li>\n',
            pa("team", "our-team.html", "Our Team"),
            f'                    <li><a href="{ch}">Contact</a></li>\n',
            '                    <li class="nav-dropdown">\n',
            '                        <button type="button" class="nav-dropdown-toggle" aria-expanded="false" '
            'aria-controls="resources-submenu" aria-haspopup="true" id="resources-btn">Resources</button>\n',
            '                        <ul class="nav-dropdown-menu" id="resources-submenu" role="menu" '
            'aria-labelledby="resources-btn">\n',
            ra("blog", "blog.html", "Blog"),
            ra("faq", "faq.html", "FAQ"),
            ra("testimonials", "testimonials.html", "Testimonials"),
            ra("market", "market-reports.html", "Market reports"),
            ra("homevalue", "home-value.html", "Home Value"),
            ra("schedulepage", "schedule.html", "Full schedule page"),
            "                        </ul>\n",
            "                    </li>\n",
        ]
    )
    lines.append("                </ul>\n")
    lines.append("            </nav>\n")
    lines.append('            <div class="header-actions">\n')
    lines.append(
        f'                <a href="{CALENDLY}" class="btn-schedule calendly-popup-trigger">Schedule</a>\n'
    )
    lines.append(
        '                <a href="resident-portal.html" class="btn-portal header-portal">'
        '<i class="fas fa-user-lock" aria-hidden="true"></i><span> Resident Portal</span></a>\n'
    )
    lines.append(
        '                <button type="button" class="menu-toggle" '
        'aria-label="Toggle navigation menu" aria-expanded="false" '
        'aria-controls="site-navigation" id="menu-toggle-btn">\n'
        '                    <i class="fas fa-bars" aria-hidden="true"></i>\n'
        "                </button>\n"
    )
    lines.append("            </div>\n")
    lines.append("        </div>\n")
    lines.append("    </header>\n")
    return "".join(lines)


FOOTER_BLOCK = """    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <h3>Mountain Edge Homes</h3>
                    <p>Your trusted partner in mountain real estate. We help you find the perfect property that matches your lifestyle and preferences.</p>
                    <div class="business-info">
                        <p><strong>Address:</strong> 8015 Blue Diamond Rd, Las Vegas, Nevada 89178, US</p>
                        <p><strong>Phone:</strong> <a href="tel:+17029195002">(702) 919-5002</a></p>
                        <p><strong>Email:</strong> <a href="mailto:DrJanSells@MountainEdgeHomes.com">DrJanSells@MountainEdgeHomes.com</a></p>
                        <p><strong>Office Hours:</strong> Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM<br>Sunday: By Appointment</p>
                    </div>
                    <div class="social-links">
                        <a href="https://www.facebook.com/MountainEdgeHomes" target="_blank" rel="noopener noreferrer" aria-label="Mountain Edge Homes on Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
                        <a href="https://twitter.com/MountainEdgeHomes" target="_blank" rel="noopener noreferrer" aria-label="Mountain Edge Homes on X (Twitter)"><i class="fab fa-twitter" aria-hidden="true"></i></a>
                        <a href="https://www.instagram.com/MountainEdgeHomes" target="_blank" rel="noopener noreferrer" aria-label="Mountain Edge Homes on Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
                        <a href="https://www.linkedin.com/company/mountain-edge-homes" target="_blank" rel="noopener noreferrer" aria-label="Mountain Edge Homes on LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>
                    </div>
                </div>
                <div class="footer-links">
                    <div class="link-column">
                        <h4>Explore</h4>
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="buyers.html">Buyers</a></li>
                            <li><a href="homes-for-sale.html">Homes for sale</a></li>
                            <li><a href="community.html">Community</a></li>
                            <li><a href="neighborhoods.html">Neighborhoods</a></li>
                            <li><a href="index.html#services">Services</a></li>
                            <li><a href="our-team.html">Our Team</a></li>
                            <li><a href="schedule.html">Schedule</a></li>
                            <li><a href="index.html#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div class="link-column">
                        <h4>Learn</h4>
                        <ul>
                            <li><a href="blog.html">Blog</a></li>
                            <li><a href="faq.html">FAQ</a></li>
                            <li><a href="testimonials.html">Testimonials</a></li>
                            <li><a href="market-reports.html">Market reports</a></li>
                            <li><a href="home-value.html">Home Value</a></li>
                        </ul>
                    </div>
                    <div class="link-column">
                        <h4>Neighborhoods</h4>
                        <ul>
                            <li><a href="neighborhoods.html">All neighborhoods</a></li>
                            <li><a href="neighborhood-aspire.html">Aspire</a></li>
                            <li><a href="neighborhood-cascade.html">Cascade</a></li>
                            <li><a href="neighborhood-collina.html">Collina</a></li>
                            <li><a href="neighborhood-mesa-valla.html">Mesa/Valla</a></li>
                            <li><a href="neighborhood-montelano.html">Montelano</a></li>
                            <li><a href="neighborhood-quintessa.html">Quintessa</a></li>
                            <li><a href="neighborhood-san-gabriel.html">San Gabriel</a></li>
                            <li><a href="neighborhood-sierra-madre.html">Sierra Madre</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Mountain Edge Homes. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="privacy.html">Privacy</a>
                    <a href="terms.html">Terms</a>
                    <a href="index.html#contact">Contact</a>
                    <a href="sitemap.html">Sitemap</a>
                </div>
            </div>
        </div>
    </footer>
"""


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        name = path.name
        if name == "property-details.html":
            continue
        if name not in FILE_META:
            print("skip (not in map):", name)
            continue
        text = path.read_text(encoding="utf-8")
        if "<header" not in text.lower():
            print("skip (no header):", name)
            continue
        if "<footer" not in text.lower():
            print("skip (no footer):", name)
            continue
        new_h = build_header(name)
        text2 = re.sub(
            r"(?:\s*<!--\s*Header\s*-->\s*)?<header[^>]*>.*?</header>",
            "\n    <!-- Header -->\n" + new_h,
            text,
            count=1,
            flags=re.DOTALL | re.IGNORECASE,
        )
        text3 = re.sub(
            r"<footer[^>]*>.*?</footer>",
            "\n" + FOOTER_BLOCK.rstrip() + "\n",
            text2,
            count=1,
            flags=re.DOTALL | re.IGNORECASE,
        )
        path.write_text(text3, encoding="utf-8")
        print("updated:", name)


if __name__ == "__main__":
    main()
