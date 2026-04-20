/**
 * Soleil Beauty Shop - Interactions
 * 
 * UI interactions: dropdowns, modals, tabs, etc.
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initDropdowns();
    initWishlist();
    initQuantitySelectors();
    initImageZoom();
    initTabs();
  });

  /**
   * Dropdown menus (for navigation)
   */
  function initDropdowns() {
    const dropdownItems = document.querySelectorAll('.header__nav-item');
    
    dropdownItems.forEach(function(item) {
      const link = item.querySelector('.header__nav-link');
      const dropdown = item.querySelector('.header__dropdown, .header__mega-menu');
      
      if (!dropdown) return;
      
      // Show on hover (desktop)
      item.addEventListener('mouseenter', function() {
        dropdown.classList.add('is-visible');
      });
      
      item.addEventListener('mouseleave', function() {
        dropdown.classList.remove('is-visible');
      });
      
      // Keyboard navigation
      if (link) {
        link.addEventListener('focus', function() {
          dropdown.classList.add('is-visible');
        });
      }
      
      item.addEventListener('focusout', function(e) {
        if (!item.contains(e.relatedTarget)) {
          dropdown.classList.remove('is-visible');
        }
      });
    });
  }

  /**
   * Wishlist functionality
   */
  function initWishlist() {
    const wishlistButtons = document.querySelectorAll('[data-wishlist-add]');
    
    // Get current wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('soleil_wishlist') || '[]');
    
    // Update button states
    function updateWishlistButtons() {
      wishlistButtons.forEach(function(btn) {
        const productId = btn.getAttribute('data-wishlist-add');
        if (wishlist.includes(productId)) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });
    }
    
    updateWishlistButtons();
    
    // Handle clicks
    wishlistButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = this.getAttribute('data-wishlist-add');
        const index = wishlist.indexOf(productId);
        
        if (index > -1) {
          // Remove from wishlist
          wishlist.splice(index, 1);
          this.classList.remove('is-active');
        } else {
          // Add to wishlist
          wishlist.push(productId);
          this.classList.add('is-active');
        }
        
        // Save to localStorage
        localStorage.setItem('soleil_wishlist', JSON.stringify(wishlist));
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('wishlist:updated', {
          detail: { wishlist: wishlist }
        }));
      });
    });
  }

  /**
   * Quantity selectors
   */
  function initQuantitySelectors() {
    document.addEventListener('click', function(e) {
      const decreaseBtn = e.target.closest('[data-quantity-decrease]');
      const increaseBtn = e.target.closest('[data-quantity-increase]');
      
      if (decreaseBtn || increaseBtn) {
        const container = (decreaseBtn || increaseBtn).closest('[data-quantity-selector]');
        const input = container.querySelector('[data-quantity-input]');
        const min = parseInt(input.getAttribute('min')) || 1;
        const max = parseInt(input.getAttribute('max')) || 99;
        let value = parseInt(input.value) || 1;
        
        if (decreaseBtn && value > min) {
          value--;
        } else if (increaseBtn && value < max) {
          value++;
        }
        
        input.value = value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  /**
   * Image zoom on hover (product pages)
   */
  function initImageZoom() {
    const zoomContainers = document.querySelectorAll('[data-image-zoom]');
    
    zoomContainers.forEach(function(container) {
      const image = container.querySelector('img');
      if (!image) return;
      
      container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        image.style.transformOrigin = x + '% ' + y + '%';
        image.style.transform = 'scale(1.5)';
      });
      
      container.addEventListener('mouseleave', function() {
        image.style.transform = 'scale(1)';
      });
    });
  }

  /**
   * Tabs
   */
  function initTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');
    
    tabContainers.forEach(function(container) {
      const tabs = container.querySelectorAll('[data-tab]');
      const panels = container.querySelectorAll('[data-tab-panel]');
      
      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          const targetId = this.getAttribute('data-tab');
          
          // Update tabs
          tabs.forEach(function(t) {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          this.classList.add('is-active');
          this.setAttribute('aria-selected', 'true');
          
          // Update panels
          panels.forEach(function(panel) {
            if (panel.getAttribute('data-tab-panel') === targetId) {
              panel.classList.add('is-active');
              panel.removeAttribute('hidden');
            } else {
              panel.classList.remove('is-active');
              panel.setAttribute('hidden', '');
            }
          });
        });
      });
    });
  }

  /**
   * Form validation helpers
   */
  window.validateEmail = function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  /**
   * Format money
   */
  window.formatMoney = function(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || window.theme.moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = precision || 2;
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);
      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  };

})();