document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('jumping-dot');
    const blocks = document.querySelectorAll('.block');
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    function moveDot(targetBlock) {
        if (!targetBlock) return;
        
        // Calculate the vertical center of the block relative to the document
        const blockRect = targetBlock.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const top = blockRect.top + scrollTop + (blockRect.height / 2) - (dot.offsetHeight / 2);
        
        dot.style.top = `${top}px`;
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
                // Check if the device is likely mobile (touch) or desktop (mouse)
                // We prioritize hover on desktop, so we only auto-jump on scroll if it's a touch device
                // or if we want to support keyboard navigation/scroll tracking.
                // The prompt says: "In the mobile version, the dot will be at the block currently in view."
                // This implies distinct behavior.
                
                if (isTouchDevice) {
                     moveDot(entry.target);
                }
            }
        });
    }, observerOptions);

    blocks.forEach(block => {
        observer.observe(block);
    });
    
    // Initial position (first block)
    if (blocks.length > 0) {
        // Small timeout to ensure layout is settled
        setTimeout(() => {
            moveDot(blocks[0]);
        }, 100);
    }
    
    // Handle window resize to update position if needed
    window.addEventListener('resize', () => {
        // Find the block that the dot is currently closest to? 
        // Or just let the next interaction fix it.
        // For now, we leave it as is.
    });
});
