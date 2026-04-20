// cart-drawer.js
// Mini‑carrito premium con drawer lateral derecho

const CartDrawer = (() => {
  const drawer = document.getElementById("mini-cart");
  const itemsContainer = document.getElementById("mini-cart-items");
  const subtotalEl = document.getElementById("mini-cart-subtotal");
  const closeBtn = drawer?.querySelector(".mini-cart-close");
  const cartCount = document.querySelector("[data-cart-count]");

  function open() {
    drawer.classList.remove("hidden");
    drawer.classList.add("mini-cart--open");
  }

  function close() {
    drawer.classList.remove("mini-cart--open");
    setTimeout(() => drawer.classList.add("hidden"), 300);
  }

  function updateCartCount(count) {
    if (cartCount) cartCount.textContent = count;
  }

  async function fetchCart() {
    const res = await fetch("/cart.js");
    return await res.json();
  }

  function renderItems(cart) {
    itemsContainer.innerHTML = "";

    if (cart.items.length === 0) {
      itemsContainer.innerHTML = `<p class="empty-cart">Tu carrito está vacío</p>`;
      subtotalEl.textContent = "$0.00";
      return;
    }

    cart.items.forEach(item => {
      const el = document.createElement("div");
      el.className = "mini-cart-item";
      el.innerHTML = `
        <img src="${item.image}" class="mini-cart-thumb">
        <div class="mini-cart-info">
          <p>${item.product_title}</p>
          <strong>$${(item.final_line_price / 100).toFixed(2)}</strong>
        </div>
      `;
      itemsContainer.appendChild(el);
    });

    subtotalEl.textContent = `$${(cart.total_price / 100).toFixed(2)}`;
  }

  async function refresh() {
    const cart = await fetchCart();
    renderItems(cart);
    updateCartCount(cart.item_count);
  }

  function init() {
    if (!drawer) return;

    refresh();

    document.querySelector(".header__cart-btn")?.addEventListener("click", e => {
      e.preventDefault();
      open();
      refresh();
    });

    closeBtn?.addEventListener("click", close);
  }

  return { init, refresh };
})();

export default CartDrawer;