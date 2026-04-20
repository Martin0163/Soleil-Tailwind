// global.js
import HeaderModule from "./header.module.js";
import CartDrawer from "./cart-drawer.js";
import ProductModule from "./product.js";
import InteractionsModule from "./interactions.js";

document.addEventListener("DOMContentLoaded", () => {
  HeaderModule.init();
  CartDrawer.init();
  ProductModule.init();
  InteractionsModule.init();
});
