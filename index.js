document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('jumping-dot');
    const blocks = document.querySelectorAll('.block');
    const transitionStyle = getComputedStyle(dot).transition;
    const headerHeight = parseInt(getComputedStyle(document.querySelector('header')).height, 0);

    let activeBlock = null;
    let isSticking = false;

    function moveDot(targetBlock) {
        if (!targetBlock) return;
        activeBlock = targetBlock;

        updatePosition(true);
    }

    function updatePosition(isJump = false) {
        if (!activeBlock) return;

        const padding = 20; // Adjust as needed
        const dotOffset = dot.offsetHeight / 2;

        const blockRect = activeBlock.getBoundingClientRect();

        // Natural position: Start of the block (relative to viewport)
        const naturalTop = blockRect.top + dotOffset;

        // Sticky limit: Header bottom + padding (relative to viewport)
        const stickyLimit = headerHeight + padding;

        if (isJump) {
            dot.style.transition = transitionStyle;
        }
        else {
            dot.style.transition = 'none';
        }

        if (naturalTop < stickyLimit) {
            // Sticky Mode
            dot.style.top = `${stickyLimit}px`;
            isSticking = true;
        } else {
            // Natural Mode
            isSticking = false;
            dot.style.top = `${naturalTop}px`;
        }
    }

    // Desktop: Hover interaction
    blocks.forEach(block => {
        block.addEventListener('mouseenter', () => {
            moveDot(block);
        });
    });

    // Mobile: Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
                if (isTouchDevice) {
                    moveDot(entry.target);
                }
            }
        });
    }, observerOptions);

    blocks.forEach(block => {
        observer.observe(block);
    });

    // Scroll listener for sticky behavior
    window.addEventListener('scroll', () => updatePosition(false));
    window.addEventListener('resize', updatePosition);

    // Initial position
    if (blocks.length > 0) {
        setTimeout(() => {
            moveDot(blocks[0]);
        }, 100);
    }
});
