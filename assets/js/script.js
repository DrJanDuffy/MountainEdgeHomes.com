// Simple performance tracking
const pageLoadStart = Date.now();

// Basic preconnect to important domains
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded in ' + (Date.now() - pageLoadStart) + 'ms');

    // Simple lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                        console.log('Image loaded:', img.alt);
                    }
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                img.classList.add('loaded');
            }
        });
    }

    // Handle image errors
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.src.includes('fallback') && !this.classList.contains('error-handled')) {
                console.error('Failed to load image:', this.src);
                this.src = 'assets/images/placeholders/fallback.svg';
                this.classList.add('error-handled');
            }
        });
    });

    console.log("Window loaded");
});

// Set viewport height fix for mobile browsers
function setVhProperty() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initially and on resize
setVhProperty();
window.addEventListener('resize', setVhProperty);

// Set viewport height fix for mobile browsers
function setVhProperty() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initially and on resize
setVhProperty();
window.addEventListener('resize', setVhProperty);

document.addEventListener('DOMContentLoaded', function() {
    // Cache frequently accessed DOM elements to reduce lookups
    const cachedElements = {};

    function getElement(id) {
        if (!cachedElements[id]) {
            cachedElements[id] = document.getElementById(id);
        }
        return cachedElements[id];
    }

    // Announcement banner close functionality
    const announcementBanner = getElement('announcement-banner');
    const closeBanner = getElement('close-banner');

    if (closeBanner && announcementBanner) {
        closeBanner.addEventListener('click', function() {
            announcementBanner.style.display = 'none';

            // Store in session storage that the banner was closed
            sessionStorage.setItem('bannerClosed', 'true');
        });

        // Check if banner was previously closed in this session
        if (sessionStorage.getItem('bannerClosed') === 'true') {
            announcementBanner.style.display = 'none';
        }
    }

    // Mobile menu toggle (.site-nav) + a11y
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.getElementById('site-navigation') || document.querySelector('header nav.site-nav');
    const MOBILE_NAV_MAX = 991;

    function setMenuToggleIcon(isOpen) {
        if (!menuToggle) return;
        menuToggle.innerHTML = isOpen
            ? '<i class="fas fa-times" aria-hidden="true"></i>'
            : '<i class="fas fa-bars" aria-hidden="true"></i>';
    }

    function closeMobileNav() {
        if (!siteNav || !menuToggle) return;
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        setMenuToggleIcon(false);
        document.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
            dd.classList.remove('is-open');
            var b = dd.querySelector('.nav-dropdown-toggle');
            if (b) b.setAttribute('aria-expanded', 'false');
        });
    }

    if (menuToggle && siteNav) {
        if (!menuToggle.hasAttribute('aria-controls')) {
            menuToggle.setAttribute('aria-controls', 'site-navigation');
        }
        menuToggle.setAttribute('aria-expanded', 'false');

        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = !siteNav.classList.contains('open');
            siteNav.classList.toggle('open', open);
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            setMenuToggleIcon(open);
        });

        document.addEventListener('click', function (event) {
            if (!siteNav.contains(event.target) && !menuToggle.contains(event.target) && siteNav.classList.contains('open')) {
                closeMobileNav();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && siteNav.classList.contains('open')) {
                closeMobileNav();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > MOBILE_NAV_MAX) {
                closeMobileNav();
            }
        });

        var navLinks = siteNav.querySelectorAll('#primary-nav a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= MOBILE_NAV_MAX) {
                    closeMobileNav();
                }
            });
        });
    }

    // Desktop: blur focus inside Resources dropdown when clicking outside (fixes stuck-open menu)
    document.addEventListener(
        'pointerdown',
        function (e) {
            if (window.innerWidth <= MOBILE_NAV_MAX) return;
            document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
                if (dd.contains(e.target)) return;
                var active = document.activeElement;
                if (active && dd.contains(active)) {
                    active.blur();
                }
            });
        },
        true
    );

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (window.innerWidth <= MOBILE_NAV_MAX) return;
        document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
            var active = document.activeElement;
            if (active && dd.contains(active)) {
                active.blur();
            }
        });
    });

    // Resources dropdown: mobile tap to expand
    document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            if (window.innerWidth > MOBILE_NAV_MAX) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            var li = btn.closest('.nav-dropdown');
            if (!li) return;
            var expanded = !li.classList.contains('is-open');
            document.querySelectorAll('.nav-dropdown.is-open').forEach(function (other) {
                if (other !== li) {
                    other.classList.remove('is-open');
                    var ob = other.querySelector('.nav-dropdown-toggle');
                    if (ob) ob.setAttribute('aria-expanded', 'false');
                }
            });
            li.classList.toggle('is-open', expanded);
            btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    });

    // Testimonials slider functionality
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const totalTestimonials = testimonials.length;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }

    // Initialize and set interval for testimonials
    if (testimonials.length > 0) {
        showTestimonial(0);
        setInterval(nextTestimonial, 5000);
    }

    // Scroll reveal animation
    const animateSections = document.querySelectorAll('.animate-section');

    const revealSection = function(entries, observer) {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    animateSections.forEach(function(section) {
        sectionObserver.observe(section);
        section.classList.add('animate-section');
    });

    // Sticky header
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');

    if (header && heroSection) {
        const stickyHeader = function() {
            if (window.scrollY > heroSection.offsetHeight / 2) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', stickyHeader);
    }

    // Lightbox functionality for property images
    const propertyImages = document.querySelectorAll('.property-image img');

    propertyImages.forEach(img => {
        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            document.body.appendChild(lightbox);

            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';
            lightbox.appendChild(lightboxContent);

            const lightboxImage = document.createElement('img');
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightboxContent.appendChild(lightboxImage);

            const closeButton = document.createElement('span');
            closeButton.className = 'lightbox-close';
            closeButton.innerHTML = '&times;';
            lightboxContent.appendChild(closeButton);

            closeButton.addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });

            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                }
            });
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Viewport height fix for mobile browsers
    function setVhProperty() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set initially and on resize
    setVhProperty();
    window.addEventListener('resize', setVhProperty);

    console.log("Window loaded");

    // Copy RSS feed URL to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show brief success message
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';

            setTimeout(function() {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    // RealScout: CSS variables only — embed script owns component lifecycle.
    document.querySelectorAll('realscout-office-listings').forEach((el) => {
        el.style.setProperty('--rs-listing-divider-color', '#4a90e2');
        el.style.width = '100%';
    });

    // Advanced search toggle
    const searchToggle = document.getElementById('search-toggle');
    const advancedSearchForm = document.getElementById('advanced-property-search');
    const advancedFields = document.querySelectorAll('.advanced-field');

    if (searchToggle && advancedSearchForm) {
        // Initially hide advanced fields
        advancedFields.forEach(field => {
            field.style.display = 'none';
        });

        searchToggle.addEventListener('click', function() {
            // Toggle advanced fields visibility
            const isCollapsed = searchToggle.classList.contains('collapsed');

            if (isCollapsed) {
                // Show advanced fields
                advancedFields.forEach(field => {
                    field.style.display = 'block';
                });
                searchToggle.classList.remove('collapsed');
                advancedSearchForm.classList.add('search-form-full');
            } else {
                // Hide advanced fields
                advancedFields.forEach(field => {
                    field.style.display = 'none';
                });
                searchToggle.classList.add('collapsed');
                advancedSearchForm.classList.remove('search-form-full');
            }
        });

        // Initialize in collapsed state
        searchToggle.classList.add('collapsed');
    }

    // Initialize testimonials slider
    let testimonialIndex = 0;
    const testimonials = document.querySelectorAll('.testimonial');

    if (testimonials.length > 0) {
        function showNextTestimonial() {
            testimonials[testimonialIndex].style.display = 'none';
            testimonialIndex = (testimonialIndex + 1) % testimonials.length;
            testimonials[testimonialIndex].style.display = 'block';
        }

        // Auto-advance testimonials every 8 seconds
        setInterval(showNextTestimonial, 8000);
    }

    // Initialize FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Close all FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });

            // If the clicked FAQ wasn't active, open it
            if (!isActive) {
                question.classList.add('active');
                answer.classList.add('active');
            }

            if (typeof gtag === 'function') {
                gtag('event', 'faq_interaction', {
                    'faq_question': question.textContent.trim()
                });
            }
        });
    });
});