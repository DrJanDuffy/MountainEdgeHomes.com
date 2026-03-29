/**
 * Calendly: load widget.css / widget.js once, shared URL, badge + popup helpers.
 * Inline embeds: use class calendly-inline-mount (NOT calendly-inline-widget — widget.js auto-inits that class and would duplicate our initInlineWidget).
 */
(function () {
  'use strict';

  var DEFAULT_URL =
    'https://calendly.com/drjanduffy/appointment?hide_event_type_details=1&hide_gdpr_banner=1';

  window.CALENDLY_APPOINTMENT_URL = DEFAULT_URL;

  function ensureCss() {
    if (document.querySelector('link[href*="assets.calendly.com/assets/external/widget.css"]')) {
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
  }

  function scriptAlreadyPresent() {
    return !!document.querySelector(
      'script[src*="assets.calendly.com/assets/external/widget.js"]'
    );
  }

  var loadCallbacks = [];

  function calendlyScriptReady() {
    var C = window.Calendly;
    if (typeof C === 'undefined') return false;
    return (
      typeof C.initPopupWidget === 'function' ||
      typeof C.initInlineWidget === 'function' ||
      typeof C.initBadgeWidget === 'function'
    );
  }

  function onCalendlyReady(fn) {
    if (calendlyScriptReady()) {
      fn();
      return;
    }
    loadCallbacks.push(fn);
    /** Popup path: if widget.js stays blocked, still run callback so openCalendlyPopup can fall back */
    setTimeout(function () {
      var i = loadCallbacks.indexOf(fn);
      if (i !== -1) {
        loadCallbacks.splice(i, 1);
        try {
          fn();
        } catch (e) {
          console.error('Calendly callback error (timeout)', e);
        }
      }
    }, 8000);
    if (!window.__calendlyLoadStarted) {
      window.__calendlyLoadStarted = true;
      ensureCss();
      if (scriptAlreadyPresent()) {
        var t = setInterval(function () {
          if (calendlyScriptReady()) {
            clearInterval(t);
            flushCallbacks();
          }
        }, 50);
        setTimeout(function () {
          clearInterval(t);
          flushCallbacks(true);
        }, 15000);
        return;
      }
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      s.onload = function () {
        flushCallbacks();
      };
      s.onerror = function () {
        flushCallbacks(true);
      };
      document.head.appendChild(s);
    }
  }

  function flushCallbacks(force) {
    if (force) {
      while (loadCallbacks.length) {
        var cb = loadCallbacks.shift();
        try {
          cb();
        } catch (e) {
          console.error('Calendly callback error', e);
        }
      }
      return;
    }
    while (loadCallbacks.length && calendlyScriptReady()) {
      var cbf = loadCallbacks.shift();
      try {
        cbf();
      } catch (e) {
        console.error('Calendly callback error', e);
      }
    }
  }

  var badgeInitialized = false;

  function initBadgeFromBody() {
    if (badgeInitialized) return;
    if (document.body.getAttribute('data-calendly-badge') !== 'true') return;
    /** One full inline embed is enough; badge + inline reads as duplicate UI */
    if (document.querySelector('.calendly-inline-mount')) return;

    onCalendlyReady(function () {
      if (badgeInitialized) return;
      if (!window.Calendly || typeof window.Calendly.initBadgeWidget !== 'function') return;
      badgeInitialized = true;
      try {
        window.Calendly.initBadgeWidget({
          url: DEFAULT_URL,
          text: 'Schedule time with me',
          color: '#44734e',
          textColor: '#ffffff',
          branding: false,
        });
      } catch (e) {
        console.warn('Calendly badge unavailable', e);
      }
    });
  }

  function normalizeCalendlyUrl(u) {
    if (!u || typeof u !== 'string') return DEFAULT_URL;
    return u.replace(/&amp;/g, '&').trim();
  }

  function openCalendlyPopup(url) {
    var u = normalizeCalendlyUrl(url || DEFAULT_URL);
    onCalendlyReady(function () {
      var C = window.Calendly;
      if (!C) {
        window.open(u, '_blank', 'noopener,noreferrer');
        return;
      }
      /** Close any existing popup so a second click re-opens cleanly */
      if (typeof C.closePopupWidget === 'function') {
        try {
          C.closePopupWidget();
        } catch (e) {
          /* ignore */
        }
      }
      if (typeof C.initPopupWidget === 'function') {
        try {
          C.initPopupWidget({ url: u });
          return;
        } catch (err) {
          console.error('Calendly initPopupWidget', err);
        }
      }
      if (typeof C.showPopupWidget === 'function') {
        try {
          C.showPopupWidget({ url: u });
          return;
        } catch (err) {
          console.warn('Calendly showPopupWidget', err);
        }
      }
      window.open(u, '_blank', 'noopener,noreferrer');
    });
  }

  function resolveCalendlyUrl(el) {
    var custom = el.getAttribute('data-calendly-url');
    if (custom) return normalizeCalendlyUrl(custom);
    var href = el.getAttribute('href');
    if (href && href.indexOf('calendly.com') !== -1) {
      return normalizeCalendlyUrl(href);
    }
    return DEFAULT_URL;
  }

  function wirePopupTriggers() {
    if (window.__calendlyPopupDelegationWired) return;
    window.__calendlyPopupDelegationWired = true;
    document.body.addEventListener(
      'click',
      function (e) {
        if (e.defaultPrevented) return;
        var t = e.target;
        if (t && t.nodeType === 3 && t.parentElement) t = t.parentElement;
        if (!t || typeof t.closest !== 'function') return;
        var trigger = t.closest('.calendly-popup-trigger');
        if (!trigger) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (typeof e.button === 'number' && e.button !== 0) return;
        e.preventDefault();
        openCalendlyPopup(resolveCalendlyUrl(trigger));
      },
      false
    );
  }

  function initInlineWidgets() {
    var nodes = document.querySelectorAll('.calendly-inline-mount');
    if (!nodes.length) return;

    onCalendlyReady(function () {
      if (typeof window.Calendly.initInlineWidget !== 'function') {
        console.warn('Calendly: initInlineWidget is not available');
        return;
      }
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.getAttribute('data-calendly-inline-initialized') === 'true') continue;
        if (el.querySelector('iframe[src*="calendly.com"]')) continue;
        var url = el.getAttribute('data-url');
        if (!url) continue;
        el.setAttribute('data-calendly-inline-initialized', 'true');
        try {
          window.Calendly.initInlineWidget({
            url: url,
            parentElement: el
          });
        } catch (err) {
          console.error('Calendly inline widget error', err);
        }
      }
    });
  }

  window.CalendlySite = {
    defaultUrl: DEFAULT_URL,
    openPopup: openCalendlyPopup,
    onReady: onCalendlyReady,
    initBadge: initBadgeFromBody,
    initInlineWidgets: initInlineWidgets
  };

  var calendlyBootOnce = false;
  var inlineHeavyRan = false;
  var badgeHeavyScheduled = false;

  /**
   * PSI / Core Web Vitals: do not load widget.js until needed.
   * - Popups: script loads on first .calendly-popup-trigger click (via onCalendlyReady).
   * - Inline: load when embed nears viewport (or fallback timeout).
   * - Badge: load after idle / first interaction (not on critical path).
   */
  function runInlineHeavyOnce() {
    if (inlineHeavyRan) return;
    inlineHeavyRan = true;
    initInlineWidgets();
  }

  function scheduleInlineWhenVisible() {
    var nodes = document.querySelectorAll('.calendly-inline-mount');
    if (!nodes.length) return;

    function fallback() {
      runInlineHeavyOnce();
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              io.disconnect();
              runInlineHeavyOnce();
            }
          });
        },
        { rootMargin: '280px 0px 400px 0px', threshold: 0.01 }
      );
      for (var i = 0; i < nodes.length; i++) {
        io.observe(nodes[i]);
      }
      window.setTimeout(function () {
        try {
          io.disconnect();
        } catch (e) {
          /* ignore */
        }
        fallback();
      }, 12000);
    } else {
      window.setTimeout(fallback, 600);
    }
  }

  function scheduleBadgeWhenIdleOrInteraction() {
    if (badgeHeavyScheduled) return;
    if (document.body.getAttribute('data-calendly-badge') !== 'true') return;
    if (document.querySelector('.calendly-inline-mount')) return;
    badgeHeavyScheduled = true;

    var done = false;
    function go() {
      if (done) return;
      done = true;
      document.removeEventListener('pointerdown', early, true);
      document.removeEventListener('keydown', early, true);
      initBadgeFromBody();
    }

    function early() {
      go();
    }

    document.addEventListener('pointerdown', early, true);
    document.addEventListener('keydown', early, true);

    if (window.requestIdleCallback) {
      window.requestIdleCallback(go, { timeout: 5000 });
    } else {
      window.setTimeout(go, 5000);
    }
  }

  function bootCalendlyUi() {
    if (calendlyBootOnce) return;
    calendlyBootOnce = true;
    wirePopupTriggers();
    scheduleInlineWhenVisible();
    scheduleBadgeWhenIdleOrInteraction();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootCalendlyUi);
  } else {
    bootCalendlyUi();
  }
})();
