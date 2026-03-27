document.addEventListener('DOMContentLoaded', function() {
    const bookingButtons = document.querySelectorAll('.btn-book-now');

    bookingButtons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            var url =
                button.getAttribute('data-calendly-url') ||
                (typeof window.CALENDLY_APPOINTMENT_URL !== 'undefined'
                    ? window.CALENDLY_APPOINTMENT_URL
                    : null);
            if (!url) return;

            if (window.CalendlySite && typeof window.CalendlySite.openPopup === 'function') {
                window.CalendlySite.openPopup(url);
            } else if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                window.Calendly.initPopupWidget({ url: url });
            }
        });
    });

    // Add animation to booking cards
    const bookingCards = document.querySelectorAll('.booking-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    bookingCards.forEach(card => {
        observer.observe(card);
    });
});
