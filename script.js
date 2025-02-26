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
            // For debugging: console.log("IntersectionObserver:", entry.isIntersecting);
        });
    }, { threshold: 1 });
    observer.observe(sliderSection);

    // Inertia scrolling variables for desktop (wheel)
    let currentVelocity = 0;
    let animationFrameId = null;
    const friction = 0.95;
    const velocityThreshold = 0.5;

    // Desktop: Listen for wheel events
    window.addEventListener('wheel', function (e) {
        // Only hijack scroll if slider is in view.
        if (!sliderInView) return;

        const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;

        // Allow vertical scroll at boundaries.
        if ((sliderSection.scrollLeft <= 0 && e.deltaY < 0) ||
            (sliderSection.scrollLeft >= maxScroll && e.deltaY > 0)) {
            return;
        }

        e.preventDefault();
        currentVelocity += e.deltaY;
        if (!animationFrameId) {
            animateScroll();
        }
    }, { passive: false });

    function animateScroll() {
        animationFrameId = requestAnimationFrame(() => {
            sliderSection.scrollLeft += currentVelocity;
            const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;
            if (sliderSection.scrollLeft < 0) {
                sliderSection.scrollLeft = 0;
                currentVelocity = 0;
            } else if (sliderSection.scrollLeft > maxScroll) {
                sliderSection.scrollLeft = maxScroll;
                currentVelocity = 0;
            }
            currentVelocity *= friction;
            if (Math.abs(currentVelocity) < velocityThreshold) {
                currentVelocity = 0;
                animationFrameId = null;
            } else {
                animateScroll();
            }
        });
    }

    // Mobile: Touch event support for horizontal swiping
    let touchStartX = null;
    let touchStartScrollLeft = null;
    sliderSection.addEventListener('touchstart', function (e) {
        // Record starting X position and current scrollLeft
        touchStartX = e.touches[0].clientX;
        touchStartScrollLeft = sliderSection.scrollLeft;
    }, { passive: true });

    sliderSection.addEventListener('touchmove', function (e) {
        if (touchStartX === null) return;
        // Calculate the horizontal difference
        let currentX = e.touches[0].clientX;
        let diffX = touchStartX - currentX;
        // Update scroll position accordingly
        sliderSection.scrollLeft = touchStartScrollLeft + diffX;
        // Prevent vertical scroll while swiping horizontally
        e.preventDefault();
    }, { passive: false });

    sliderSection.addEventListener('touchend', function (e) {
        // Reset touch start variables
        touchStartX = null;
        touchStartScrollLeft = null;
    });
});
