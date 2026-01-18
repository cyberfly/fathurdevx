// Enhanced page transitions with View Transitions API
export function initPageTransitions() {
  // Check if View Transitions API is supported
  const supportsViewTransitions = 'startViewTransition' in document;

  // Reset transition state when navigating back/forward (bfcache)
  window.addEventListener("pageshow", (event) => {
    if (!supportsViewTransitions) {
      document.body.classList.remove("page-transitioning");
    }
  });

  // Handle internal link clicks
  const links = document.querySelectorAll('a[href^="/"]');
  links.forEach((link) => {
    link.addEventListener("click", async (e) => {
      const href = link.getAttribute("href");

      // Only transition for internal links (not anchors)
      if (href && !href.startsWith("#") && href !== window.location.pathname) {
        e.preventDefault();

        // Use View Transitions API if available
        if (supportsViewTransitions) {
          document.startViewTransition(() => {
            window.location.href = href;
          });
        } else {
          // Fallback animation - reduced delay for snappier feel
          document.body.classList.add("page-transitioning");
          await new Promise(resolve => setTimeout(resolve, 200));
          window.location.href = href;
        }
      }
    });
  });
}

// Intersection Observer for scroll animations
export function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.animation = entry.target.dataset.animation ||
          'fadeInUp 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with scroll animation classes
  document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-scale, .animate-on-scroll-rotate').forEach((el) => {
    observer.observe(el);
  });
}

// Jump to Top functionality
export function initJumpToTop() {
  const jumpToTopBtn = document.getElementById('jumpToTop');
  if (!jumpToTopBtn) return;

  // Show/hide button based on scroll position
  function toggleJumpToTop() {
    if (window.scrollY > 300) {
      jumpToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      jumpToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      jumpToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      jumpToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Event listeners
  window.addEventListener('scroll', toggleJumpToTop);
  jumpToTopBtn.addEventListener('click', scrollToTop);

  // Initial check
  toggleJumpToTop();
}

// Initialize all features when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initPageTransitions();
  initScrollAnimations();
  initJumpToTop();
});
