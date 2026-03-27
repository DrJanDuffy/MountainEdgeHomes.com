/**
 * Injects VideoObject JSON-LD for embedded YouTube videos on the testimonials page only.
 * URLs and dates match Dr. Jan Duffy's channel (youtube.com/@DrDuffy).
 */
document.addEventListener('DOMContentLoaded', function () {
    var section = document.querySelector('.video-testimonials');
    if (!section) {
        return;
    }

    var videos = [
        {
            '@type': 'VideoObject',
            name: 'Dr. Jan Duffy, REALTOR | Client Testimonial!',
            description:
                'Client testimonial with Dr. Jan Duffy, REALTOR, Berkshire Hathaway HomeServices Nevada Properties.',
            thumbnailUrl: 'https://i4.ytimg.com/vi/kEyg6JtCltY/hqdefault.jpg',
            uploadDate: '2025-08-20T20:03:27+00:00',
            contentUrl: 'https://www.youtube.com/watch?v=kEyg6JtCltY',
            embedUrl: 'https://www.youtube-nocookie.com/embed/kEyg6JtCltY',
            publisher: {
                '@type': 'Organization',
                name: 'Dr. Jan Duffy REALTOR',
                url: 'https://www.youtube.com/@DrDuffy',
            },
        },
        {
            '@type': 'VideoObject',
            name: 'Explore Vistas Summerlin homes for sale. Discover beautiful homes with great views and amenities.',
            description:
                'Real estate tour and insights from Dr. Jan Duffy, Berkshire Hathaway HomeServices.',
            thumbnailUrl: 'https://i2.ytimg.com/vi/ai38IQKXTMo/hqdefault.jpg',
            uploadDate: '2025-07-12T07:56:54+00:00',
            contentUrl: 'https://www.youtube.com/watch?v=ai38IQKXTMo',
            embedUrl: 'https://www.youtube-nocookie.com/embed/ai38IQKXTMo',
            publisher: {
                '@type': 'Organization',
                name: 'Dr. Jan Duffy REALTOR',
                url: 'https://www.youtube.com/@DrDuffy',
            },
        },
    ];

    var graph = {
        '@context': 'https://schema.org',
        '@graph': videos,
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(graph);
    document.head.appendChild(script);
});
