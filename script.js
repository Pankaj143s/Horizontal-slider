document.addEventListener('DOMContentLoaded', function () {
    const sliderSection = document.getElementById('sliderSection');
    if (!sliderSection) return;

    // Ensure the slider starts scrolled to the far left.
    sliderSection.scrollLeft = 0;

    // Track if the slider is fully in view.
    let sliderInView = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            sliderInView = entry.isIntersecting;
            // For debugging:
            // console.log("IntersectionObserver: isIntersecting =", entry.isIntersecting, "intersectionRatio =", entry.intersectionRatio);
        });
    }, { threshold: 1 }); // Entire slider must be in view.
    observer.observe(sliderSection);

    // --- Desktop (Wheel) Inertia Scrolling ---
    let currentVelocity = 0;
    let animationFrameId = null;
    const friction = 0.95;
    const velocityThreshold = 0.5;

    window.addEventListener('wheel', function (e) {
        // Only hijack if slider is in view.
        if (!sliderInView) return;

        const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;

        // If we're at the boundaries, allow vertical scrolling.
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
        // If the slider is in view, capture the touch.
        if (!sliderInView) return;
        touchStartY = e.touches[0].clientY;
        touchStartSliderScroll = sliderSection.scrollLeft;
    }, { passive: false });

    window.addEventListener('touchmove', function (e) {
        if (!sliderInView || touchStartY === null) return;
        const touchCurrentY = e.touches[0].clientY;
        const diffY = touchStartY - touchCurrentY;
        // Update horizontal scroll based on vertical swipe.
        sliderSection.scrollLeft = touchStartSliderScroll + diffY;
        e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', function (e) {
        touchStartY = null;
        touchStartSliderScroll = null;
    });
});
