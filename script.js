document.addEventListener('DOMContentLoaded', function () {
    const sliderSection = document.getElementById('sliderSection');
    if (!sliderSection) return;

    // Start with the slider scrolled to the far left (showing left buffer)
    sliderSection.scrollLeft = 0;

    // Track if the slider is in view using IntersectionObserver.
    let sliderInView = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            sliderInView = entry.isIntersecting;
        });
    }, { threshold: 0.6 });
    observer.observe(sliderSection);

    // Inertia scrolling variables.
    let currentVelocity = 0;
    let animationFrameId = null;
    const friction = 0.95;         // Deceleration factor
    const velocityThreshold = 0.5; // Minimum velocity to continue

    // Listen globally for wheel events.
    window.addEventListener('wheel', function (e) {
        // Only hijack scroll if the slider is in view.
        if (!sliderInView) return;

        const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;

        // Allow vertical scroll if at left/right boundaries.
        if ((sliderSection.scrollLeft <= 0 && e.deltaY < 0) ||
            (sliderSection.scrollLeft >= maxScroll && e.deltaY > 0)) {
            return;
        }

        // Prevent vertical scrolling while scrolling horizontally.
        e.preventDefault();

        // Add wheel delta to current velocity.
        currentVelocity += e.deltaY;

        // Start the inertia loop if not already running.
        if (!animationFrameId) {
            animateScroll();
        }
    }, { passive: false });

    // Inertia-based animation loop.
    function animateScroll() {
        animationFrameId = requestAnimationFrame(() => {
            sliderSection.scrollLeft += currentVelocity;

            const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;
            // Clamp the scroll position.
            if (sliderSection.scrollLeft < 0) {
                sliderSection.scrollLeft = 0;
                currentVelocity = 0;
            } else if (sliderSection.scrollLeft > maxScroll) {
                sliderSection.scrollLeft = maxScroll;
                currentVelocity = 0;
            }

            // Apply friction.
            currentVelocity *= friction;

            // Stop if velocity is low.
            if (Math.abs(currentVelocity) < velocityThreshold) {
                currentVelocity = 0;
                animationFrameId = null;
            } else {
                animateScroll();
            }
        });
    }
});
