/**
 * Defer RealScout web components until listings enter the viewport (or fallback delay).
 * Improves LCP/TBT by not loading em.realscout.com on initial main-thread work.
 */
(function () {
  'use strict';

  var LOADED = false;

  function loadRealScout() {
    if (LOADED) return;
    if (document.querySelector('script[data-realscout-widget="1"]')) {
      LOADED = true;
      return;
    }
    LOADED = true;
    var s = document.createElement('script');
    s.src = 'https://em.realscout.com/widgets/realscout-web-components.umd.js';
    s.type = 'module';
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-realscout-widget', '1');
    s.async = true;
    document.head.appendChild(s);
  }

  function boot() {
    var targets = document.querySelectorAll('realscout-office-listings');
    if (!targets.length) return;

    var fired = false;
    function trigger() {
      if (fired) return;
      fired = true;
      loadRealScout();
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) trigger();
          });
        },
        { rootMargin: '320px 0px 400px 0px', threshold: 0.01 }
      );
      targets.forEach(function (el) {
        io.observe(el);
      });
    } else {
      window.setTimeout(trigger, 400);
    }

    window.setTimeout(trigger, 9000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
