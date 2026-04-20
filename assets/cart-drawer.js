const CartDrawer = (() => {
  let drawer;
  let itemsContainer;
  let subtotalEl;
  let cartCountEls = [];
  let closeBtn;
  let isInitialized = false;

  function formatMoney(cents) {
    if (window.Shopify && typeof window.Shopify.formatMoney === "function") {
      return window.Shopify.formatMoney(cents);
    }
    return `$${(Number(cents || 0) / 100).toFixed(2)}`;
  }

  function getElements() {
    drawer = document.querySelector("[data-cart-drawer]");
    itemsContainer = document.querySelector("[data-cart-items]");
    subtotalEl = document.querySelector("[data-cart-subtotal]");
    closeBtn = document.querySelector("[data-cart-close]");
    cartCountEls = Array.from(document.querySelectorAll("[data-cart-count]"));
  }

  function setCartCount(count) {
    cartCountEls.forEach((el) => {
      el.textContent = count;
      el.setAttribute("data-cart-count", String(count));
    });
  }

  async function fetchCart() {
    const response = await fetch("/cart.js", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("No se pudo obtener el carrito");
    return response.json();
  }

  async function updateItemQuantity(key, quantity) {
    const response = await fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ id: key, quantity })
    });
    if (!response.ok) throw new Error("No se pudo actualizar el carrito");
    return response.json();
  }

  function renderEmptyState() {
    if (!itemsContainer || !subtotalEl) return;
    itemsContainer.innerHTML = `<p class="empty-cart">Tu carrito está vacío.</p>`;
    subtotalEl.textContent = formatMoney(0);
  }

  function renderItems(cart) {
    if (!itemsContainer || !subtotalEl) return;

    if (!cart.items || cart.items.length === 0) {
      renderEmptyState();
      setCartCount(0);
      return;
    }

    itemsContainer.innerHTML = cart.items
      .map((item) => {
        const image = item.image || "";
        return `
          <article class="mini-cart-item" data-cart-item-key="${item.key}">
            <img src="${image}" class="mini-cart-thumb" alt="${item.product_title}">
            <div class="mini-cart-info">
              <p class="mini-cart-item-title">${item.product_title}</p>
              <div class="mini-cart-qty">
                <button type="button" data-cart-qty="decrease" data-key="${item.key}" aria-label="Disminuir cantidad">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-cart-qty="increase" data-key="${item.key}" aria-label="Aumentar cantidad">+</button>
              </div>
              <button type="button" class="mini-cart-remove" data-cart-remove data-key="${item.key}">
                Eliminar
              </button>
              <strong>${formatMoney(item.final_line_price)}</strong>
            </div>
          </article>
        `;
      })
      .join("");

    subtotalEl.textContent = formatMoney(cart.total_price);
    setCartCount(cart.item_count);
  }

  function open() {
    if (!drawer) return;
    drawer.classList.remove("hidden");
    drawer.classList.add("mini-cart--open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function close() {
    if (!drawer) return;
    drawer.classList.remove("mini-cart--open");
    drawer.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      drawer.classList.add("hidden");
    }, 200);
  }

  async function refresh() {
    try {
      const cart = await fetchCart();
      renderItems(cart);
      return cart;
    } catch (error) {
      console.error("[CartDrawer] refresh error:", error);
      renderEmptyState();
      return null;
    }
  }

  async function handleQuantityClick(button) {
    const key = button.getAttribute("data-key");
    const action = button.getAttribute("data-cart-qty");
    if (!key || !action) return;

    try {
      const cart = await fetchCart();
      const item = cart.items.find((cartItem) => cartItem.key === key);
      if (!item) return;

      const nextQty = action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      await updateItemQuantity(key, nextQty);
      await refresh();
      document.dispatchEvent(new CustomEvent("cart:updated"));
    } catch (error) {
      console.error("[CartDrawer] quantity error:", error);
    }
  }

  async function handleRemoveClick(button) {
    const key = button.getAttribute("data-key");
    if (!key) return;

    try {
      await updateItemQuantity(key, 0);
      await refresh();
      document.dispatchEvent(new CustomEvent("cart:updated"));
    } catch (error) {
      console.error("[CartDrawer] remove error:", error);
    }
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const openTrigger = event.target.closest("[data-cart-open]");
      if (openTrigger) {
        event.preventDefault();
        open();
        refresh();
      }

      const qtyBtn = event.target.closest("[data-cart-qty]");
      if (qtyBtn) {
        event.preventDefault();
        handleQuantityClick(qtyBtn);
      }

      const removeBtn = event.target.closest("[data-cart-remove]");
      if (removeBtn) {
        event.preventDefault();
        handleRemoveClick(removeBtn);
      }
    });

    closeBtn?.addEventListener("click", () => close());

    document.addEventListener("cart:updated", () => {
      refresh();
    });
  }

  function init() {
    if (isInitialized) return;
    getElements();
    if (!drawer) return;

    bindEvents();
    refresh();
    isInitialized = true;
  }

  return { init, refresh, open, close };
})();

export default CartDrawer;
