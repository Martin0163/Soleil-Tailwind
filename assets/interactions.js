const InteractionsModule = (() => {
  let initialized = false;

  function initMobileMenu() {
    const menu = document.querySelector("[data-mobile-menu]");
    const overlay = document.querySelector("[data-mobile-menu-overlay]");
    if (!menu || !overlay) return;

    const openButtons = document.querySelectorAll("[data-mobile-menu-open]");
    const closeButtons = document.querySelectorAll("[data-mobile-menu-close]");

    const open = () => {
      menu.classList.add("is-open");
      overlay.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");
    };

    const close = () => {
      menu.classList.remove("is-open");
      overlay.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("overflow-hidden");
    };

    openButtons.forEach((btn) => btn.addEventListener("click", open));
    closeButtons.forEach((btn) => btn.addEventListener("click", close));
    overlay.addEventListener("click", close);

    menu.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-mobile-submenu-toggle]");
      if (!toggle) return;
      const item = toggle.closest(".mobile-menu__item--has-children");
      if (!item) return;
      item.classList.toggle("is-open");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initSearchOverlay() {
    const overlay = document.querySelector("[data-search-overlay]");
    if (!overlay) return;

    const openButtons = document.querySelectorAll("[data-search-open]");
    const closeButtons = document.querySelectorAll("[data-search-close]");
    const input = overlay.querySelector("[data-search-input]");

    const open = () => {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");
      if (input) setTimeout(() => input.focus(), 50);
    };

    const close = () => {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("overflow-hidden");
    };

    openButtons.forEach((btn) => btn.addEventListener("click", open));
    closeButtons.forEach((btn) => btn.addEventListener("click", close));

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initHeaderDropdowns() {
    const items = document.querySelectorAll(".header__nav-item");
    items.forEach((item) => {
      item.classList.remove("is-open");

      const trigger = item.querySelector(".header__nav-link");
      const panel = item.querySelector(".header__dropdown, .header__mega-menu");
      if (!trigger || !panel) return;

      item.addEventListener("mouseenter", () => item.classList.add("is-open"));
      item.addEventListener("mouseleave", () => item.classList.remove("is-open"));

      trigger.addEventListener("focus", () => item.classList.add("is-open"));
      item.addEventListener("focusout", (event) => {
        if (!item.contains(event.relatedTarget)) {
          item.classList.remove("is-open");
        }
      });
    });
  }

  function initHomeTransparentHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const isHomeTransparent = header.getAttribute("data-home-transparent") === "true";
    if (!isHomeTransparent) return;

    let lastScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    let ticking = false;
    const downThreshold = 18;
    const upThreshold = 10;
    const revealAtTop = 12;

    const updateHeaderState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const delta = scrollTop - lastScrollTop;

      if (scrollTop > 30) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }

      if (scrollTop <= revealAtTop) {
        header.classList.remove("header--hidden");
      } else if (delta > downThreshold) {
        header.classList.add("header--hidden");
      } else if (delta < -upThreshold) {
        header.classList.remove("header--hidden");
      }

      lastScrollTop = scrollTop;
      ticking = false;
    };

    updateHeaderState();

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateHeaderState);
      },
      { passive: true }
    );
  }

  function init() {
    if (initialized) return;
    initMobileMenu();
    initSearchOverlay();
    initHeaderDropdowns();
    initHomeTransparentHeader();
    initialized = true;
  }

  return { init };
})();

export default InteractionsModule;
