// global.js
import HeaderModule from "./header.module.js";
import CartDrawer from "./cart-drawer.js";

document.addEventListener("DOMContentLoaded", () => {
  HeaderModule.init();
  CartDrawer.init();

  // Si tienes otras inicializaciones:
  if (typeof initAnimations === "function") initAnimations();
  if (typeof initInteractions === "function") initInteractions();
});