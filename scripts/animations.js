/**
 * Animation system using Intersection Observer API
 * Supports animation class names and delay via data attributes
 */

/**
 * Initialize scroll animations for all elements with data-animation attribute
 */
export function initScrollAnimations() {
  // Check if elements with animations exist
  const animatedElements = document.querySelectorAll('[data-animation]');
  if (animatedElements.length === 0) return;

  // Animation options
  const defaultOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from viewport
    threshold: 0.1, // Trigger when 10% of element is visible
  };

  // Create Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationClass = element.getAttribute('data-animation');
        const delay = element.getAttribute('data-animation-delay') || '0';
        const duration = element.getAttribute('data-animation-duration') || '600';

        // Apply delay via inline style
        if (delay !== '0') {
          element.style.animationDelay = `${delay}ms`;
        }
        if (duration !== '600') {
          element.style.animationDuration = `${duration}ms`;
        }

        // Add animation class
        element.classList.add('animate', animationClass);
        
        // Stop observing this element after animation
        observer.unobserve(element);
      }
    });
  }, defaultOptions);

  // Observe all elements with data-animation
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Initialize animations when DOM is ready
 */
export function loadAnimations() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
}

/**
 * Re-initialize animations for a specific container (useful for dynamically loaded content)
 * @param {Element} container - Container element to search for animated elements
 */
export function initScrollAnimationsForContainer(container) {
  const animatedElements = container.querySelectorAll('[data-animation]');
  if (animatedElements.length === 0) return;

  const defaultOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationClass = element.getAttribute('data-animation');
        const delay = element.getAttribute('data-animation-delay') || '0';
        const duration = element.getAttribute('data-animation-duration') || '600';

        if (delay !== '0') {
          element.style.animationDelay = `${delay}ms`;
        }
        if (duration !== '600') {
          element.style.animationDuration = `${duration}ms`;
        }

        element.classList.add('animate', animationClass);
        observer.unobserve(element);
      }
    });
  }, defaultOptions);

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}
