/**
 * Soleil Beauty Shop - Animations
 * 
 * Scroll-based animations using Intersection Observer
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
  });

  /**
   * Initialize scroll-based animations
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (!animatedElements.length) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show all elements without animation
      animatedElements.forEach(function(el) {
        el.style.opacity = '1';
      });
      return;
    }

    // Intersection Observer options
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    // Create observer
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-animate-delay') || 0;
          
          setTimeout(function() {
            el.classList.add('is-visible');
          }, parseInt(delay));
          
          // Unobserve after animation
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    // Observe elements
    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  /**
   * Parallax effect for hero images (optional)
   */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (!parallaxElements.length) return;
    
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(function(el) {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        const yPos = -(scrollY * speed);
        el.style.transform = 'translate3d(0, ' + yPos + 'px, 0)';
      });
      
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  /**
   * Stagger animation for grid items
   */
  window.staggerAnimation = function(selector, baseDelay) {
    baseDelay = baseDelay || 100;
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(function(el, index) {
      el.style.animationDelay = (index * baseDelay) + 'ms';
    });
  };

})();