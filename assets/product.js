const ProductModule = (() => {
  function init() {
    const sections = document.querySelectorAll("[data-product-section]");
    if (!sections.length) return;

    sections.forEach((section) => {
      initGallery(section);
      initVariantSelection(section);
      initTabs(section);
      initProductForm(section);
    });
  }

  function initGallery(section) {
    const mainImage = section.querySelector("[data-product-main-image]");
    const thumbs = section.querySelectorAll("[data-product-thumb]");
    if (!mainImage || !thumbs.length) return;

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const mediaUrl = thumb.getAttribute("data-media-url");
        if (!mediaUrl) return;

        mainImage.src = mediaUrl;

        thumbs.forEach((t) => {
          t.classList.remove("ring-2", "ring-black");
        });
        thumb.classList.add("ring-2", "ring-black");
      });
    });
  }

  function initVariantSelection(section) {
    const select = section.querySelector("[data-product-variant-select]");
    const mainImage = section.querySelector("[data-product-main-image]");
    const priceNode = section.querySelector("[data-product-price]");
    if (!select) return;

    select.addEventListener("change", () => {
      const selected = select.options[select.selectedIndex];
      if (!selected) return;

      const image = selected.getAttribute("data-image");
      const price = selected.getAttribute("data-price");

      if (mainImage && image) {
        mainImage.src = image;
      }

      if (priceNode && price) {
        priceNode.textContent = price;
      }
    });
  }

  function initTabs(section) {
    const tabContainer = section.querySelector("[data-product-tabs]");
    if (!tabContainer) return;

    const triggers = Array.from(tabContainer.querySelectorAll("[data-tab-trigger]"));
    const root = section.closest(".shopify-section") || section;
    const anchorSections = Array.from(root.querySelectorAll("[data-product-anchor-section]"));
    if (!triggers.length || !anchorSections.length) return;

    const setActiveTab = (key) => {
      triggers.forEach((btn) => {
        const btnKey = btn.getAttribute("data-tab-trigger");
        const isActive = btnKey === key;

        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        btn.classList.toggle("border-black", isActive);
        btn.classList.toggle("bg-black", isActive);
        btn.classList.toggle("text-white", isActive);

        btn.classList.toggle("border-gray-300", !isActive);
        btn.classList.toggle("text-gray-700", !isActive);
      });
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const target = trigger.getAttribute("data-tab-trigger");
        if (!target) return;

        const targetSection = root.querySelector(`[data-product-anchor-section="${target}"]`);
        if (!targetSection) return;

        setActiveTab(target);
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const key = visible.target.getAttribute("data-product-anchor-section");
        if (key) setActiveTab(key);
      },
      {
        root: null,
        threshold: [0.35, 0.6],
        rootMargin: "-25% 0px -55% 0px"
      }
    );

    anchorSections.forEach((anchorSection) => observer.observe(anchorSection));
  }

  function initProductForm(section) {
    const form = section.querySelector("[data-product-form]");
    const submitButton = section.querySelector("[data-product-submit]");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add("opacity-70");
      }

      const formData = new FormData(form);

      try {
        const response = await fetch("/cart/add.js", {
          method: "POST",
          body: formData
        });

        if (!response.ok) throw new Error("No se pudo agregar el producto");

        await response.json();

        document.dispatchEvent(new CustomEvent("cart:updated"));
      } catch (error) {
        form.submit();
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove("opacity-70");
        }
      }
    });
  }

  return { init };
})();

export default ProductModule;
