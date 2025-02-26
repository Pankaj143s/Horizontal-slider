document.addEventListener('DOMContentLoaded', function () {
    const sliderSection = document.getElementById('sliderSection');
    if (!sliderSection) return;

    // Start with the slider scrolled to the far left (showing left buffer).
    sliderSection.scrollLeft = 0;

    // Track if the slider is in view via IntersectionObserver.
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
        // Only hijack scroll if slider is in view.
        if (!sliderInView) return;

        const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;

        // If user tries to scroll left beyond left boundary, allow vertical scroll.
        if (sliderSection.scrollLeft <= 0 && e.deltaY < 0) {
            return;
        }
        // If user tries to scroll right beyond right boundary, allow vertical scroll.
        if (sliderSection.scrollLeft >= maxScroll && e.deltaY > 0) {
            return;
        }

        // Prevent vertical scrolling while we scroll horizontally.
        e.preventDefault();

        // Add this scroll delta to our velocity.
        currentVelocity += e.deltaY;

        // Start the inertia loop if it's not already running.
        if (!animationFrameId) {
            animateScroll();
        }
    }, { passive: false });

    // Inertia-based animation loop.
    function animateScroll() {
        animationFrameId = requestAnimationFrame(() => {
            // Update horizontal position based on velocity.
            sliderSection.scrollLeft += currentVelocity;

            // Clamp to boundaries.
            const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;
            if (sliderSection.scrollLeft < 0) {
                sliderSection.scrollLeft = 0;
                currentVelocity = 0;
            } else if (sliderSection.scrollLeft > maxScroll) {
                sliderSection.scrollLeft = maxScroll;
                currentVelocity = 0;
            }

            // Apply friction so velocity decreases each frame.
            currentVelocity *= friction;

            // Stop if velocity is low enough.
            if (Math.abs(currentVelocity) < velocityThreshold) {
                currentVelocity = 0;
                animationFrameId = null;
            } else {
                animateScroll();
            }
        });
    }
});
