document.addEventListener('DOMContentLoaded', function () {
    const sliderSection = document.getElementById('sliderSection');
    if (!sliderSection) return;

    // Start with the slider scrolled to the far left (showing left buffer)
    sliderSection.scrollLeft = 0;

    // Track if the slider is fully in view using IntersectionObserver.
    let sliderInView = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            sliderInView = entry.isIntersecting;
        });
    }, { threshold: 1 }); // Require full visibility
    observer.observe(sliderSection);

    // --- Desktop (Wheel) Inertia Scrolling ---
    let currentVelocity = 0;
    let animationFrameId = null;
    const friction = 0.95;
    const velocityThreshold = 0.5;

    window.addEventListener('wheel', function (e) {
        if (!sliderInView) return;

        const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;
        // Allow vertical scroll if at boundaries.
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

    // --- Mobile (Global Touch) Handling ---
    let touchStartY = null;
    let touchStartSliderScroll = null;

    window.addEventListener('touchstart', function (e) {
        if (!sliderInView) return;
        touchStartY = e.touches[0].clientY;
        touchStartSliderScroll = sliderSection.scrollLeft;
    }, { passive: false });

    window.addEventListener('touchmove', function (e) {
        if (!sliderInView || touchStartY === null) return;
        const touchCurrentY = e.touches[0].clientY;
        const diffY = touchStartY - touchCurrentY;
        const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;
        const newScrollLeft = touchStartSliderScroll + diffY;

        // If the new position would be out of bounds, clamp it
        if (newScrollLeft < 0 || newScrollLeft > maxScroll) {
            sliderSection.scrollLeft = (newScrollLeft < 0) ? 0 : maxScroll;
            // Clear the touch start values so subsequent events are not captured,
            // allowing the browser to resume vertical scrolling.
            touchStartY = null;
            touchStartSliderScroll = null;
            // Do not call preventDefault so that vertical scroll occurs.
            return;
        }

        // Otherwise, update horizontal scroll and prevent vertical scrolling.
        sliderSection.scrollLeft = newScrollLeft;
        e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', function (e) {
        touchStartY = null;
        touchStartSliderScroll = null;
    });
});
