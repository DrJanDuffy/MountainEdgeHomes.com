/**
 * Calendly: load widget.css / widget.js once, shared URL, badge + popup helpers.
 * Inline embeds: add <div class="calendly-inline-widget" data-url="..."> in HTML; Calendly inits after script load.
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

  function openCalendlyPopup(url) {
    var u = url || DEFAULT_URL;
    onCalendlyReady(function () {
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        try {
          window.Calendly.initPopupWidget({ url: u });
          return;
        } catch (err) {
          console.error('Calendly initPopupWidget', err);
        }
      }
      window.open(u, '_blank', 'noopener,noreferrer');
    });
  }

  function resolveCalendlyUrl(el) {
    var custom = el.getAttribute('data-calendly-url');
    if (custom) return custom;
    var href = el.getAttribute('href');
    if (href && href.indexOf('calendly.com') !== -1) {
      return href.replace(/&amp;/g, '&');
    }
    return DEFAULT_URL;
  }

  function wirePopupTriggers() {
    document.querySelectorAll('.calendly-popup-trigger').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openCalendlyPopup(resolveCalendlyUrl(el));
      });
    });
  }

  function initInlineWidgets() {
    var nodes = document.querySelectorAll('.calendly-inline-widget');
    if (!nodes.length) return;

    onCalendlyReady(function () {
      if (typeof window.Calendly.initInlineWidget !== 'function') {
        console.warn('Calendly: initInlineWidget is not available');
        return;
      }
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.getAttribute('data-calendly-inline-initialized') === 'true') continue;
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

  function bootCalendlyUi() {
    initBadgeFromBody();
    wirePopupTriggers();
    initInlineWidgets();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootCalendlyUi);
  } else {
    bootCalendlyUi();
  }
})();
