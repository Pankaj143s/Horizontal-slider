document.addEventListener('DOMContentLoaded', function () {
    const sliderSection = document.getElementById('sliderSection');
    if (!sliderSection) return;

    // Start with the slider scrolled to the far left
    sliderSection.scrollLeft = 0;

    // Track if the slider is in view
    let sliderInView = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log("IntersectionObserver triggered. entry.isIntersecting =", entry.isIntersecting);
            sliderInView = entry.isIntersecting;
        });
    }, { threshold: 0.1 }); // Lower threshold for easier debugging
    observer.observe(sliderSection);

    // Inertia scrolling variables
    let currentVelocity = 0;
    let animationFrameId = null;
    const friction = 0.95;
    const velocityThreshold = 0.5;

    // Listen globally for wheel events
    window.addEventListener('wheel', function (e) {
        // Log the wheel event
        console.log(
            "Wheel event triggered. sliderInView =", sliderInView,
            "deltaY =", e.deltaY
        );

        // Only hijack scroll if slider is in view
        if (!sliderInView) {
            console.log("Slider not in view, ignoring horizontal scroll hijack.");
            return;
        }

        const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;

        // If user tries to scroll left beyond left boundary
        if (sliderSection.scrollLeft <= 0 && e.deltaY < 0) {
            console.log("At left boundary, allowing vertical scroll.");
            return;
        }
        // If user tries to scroll right beyond right boundary
        if (sliderSection.scrollLeft >= maxScroll && e.deltaY > 0) {
            console.log("At right boundary, allowing vertical scroll.");
            return;
        }

        // Prevent vertical scrolling while we scroll horizontally
        e.preventDefault();

        // Add this scroll delta to our velocity
        currentVelocity += e.deltaY;
        console.log("Updated currentVelocity =", currentVelocity);

        // Start the inertia loop if not already running
        if (!animationFrameId) {
            console.log("Starting animateScroll...");
            animateScroll();
        }
    }, { passive: false });

    // Inertia-based animation loop
    function animateScroll() {
        animationFrameId = requestAnimationFrame(() => {
            // Update horizontal position based on velocity
            sliderSection.scrollLeft += currentVelocity;
            console.log(
                "Animating scroll. currentVelocity =", currentVelocity,
                "scrollLeft =", sliderSection.scrollLeft
            );

            // Clamp the scroll position
            const maxScroll = sliderSection.scrollWidth - sliderSection.clientWidth;
            if (sliderSection.scrollLeft < 0) {
                sliderSection.scrollLeft = 0;
                currentVelocity = 0;
                console.log("Clamped to left boundary. currentVelocity reset to 0.");
            } else if (sliderSection.scrollLeft > maxScroll) {
                sliderSection.scrollLeft = maxScroll;
                currentVelocity = 0;
                console.log("Clamped to right boundary. currentVelocity reset to 0.");
            }

            // Apply friction
            currentVelocity *= friction;

            // Stop if velocity is low
            if (Math.abs(currentVelocity) < velocityThreshold) {
                console.log("Velocity below threshold, stopping animation.");
                currentVelocity = 0;
                animationFrameId = null;
            } else {
                animateScroll();
            }
        });
    }
});
