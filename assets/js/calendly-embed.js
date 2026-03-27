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

  function onCalendlyReady(fn) {
    if (typeof window.Calendly !== 'undefined' && window.Calendly.initPopupWidget) {
      fn();
      return;
    }
    loadCallbacks.push(fn);
    if (!window.__calendlyLoadStarted) {
      window.__calendlyLoadStarted = true;
      ensureCss();
      if (scriptAlreadyPresent()) {
        var t = setInterval(function () {
          if (typeof window.Calendly !== 'undefined') {
            clearInterval(t);
            flushCallbacks();
          }
        }, 50);
        setTimeout(function () {
          clearInterval(t);
          flushCallbacks();
        }, 15000);
        return;
      }
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      s.onload = function () {
        flushCallbacks();
      };
      document.head.appendChild(s);
    }
  }

  function flushCallbacks() {
    while (loadCallbacks.length && typeof window.Calendly !== 'undefined') {
      var cb = loadCallbacks.shift();
      try {
        cb();
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
      badgeInitialized = true;
      window.Calendly.initBadgeWidget({
        url: DEFAULT_URL,
        text: 'Schedule time with me',
        color: '#44734e',
        textColor: '#ffffff',
        branding: false,
      });
    });
  }

  function openCalendlyPopup(url) {
    var u = url || DEFAULT_URL;
    onCalendlyReady(function () {
      window.Calendly.initPopupWidget({ url: u });
    });
  }

  function wirePopupTriggers() {
    document.querySelectorAll('.calendly-popup-trigger').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var custom = el.getAttribute('data-calendly-url');
        openCalendlyPopup(custom || DEFAULT_URL);
      });
    });
  }

  window.CalendlySite = {
    defaultUrl: DEFAULT_URL,
    openPopup: openCalendlyPopup,
    onReady: onCalendlyReady,
    initBadge: initBadgeFromBody,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initBadgeFromBody();
      wirePopupTriggers();
    });
  } else {
    initBadgeFromBody();
    wirePopupTriggers();
  }
})();
