// header.module.js
// Control premium del header: hide/show on scroll + sticky debajo del announcement bar

const HeaderModule = (() => {
  let lastScroll = 0;
  let ticking = false;

  const header = document.getElementById("site-header");
  const announcementBar = document.querySelector(".announcement-bar");

  function getAnnouncementHeight() {
    return announcementBar ? announcementBar.offsetHeight : 0;
  }

  function updateHeaderPosition() {
    const offset = getAnnouncementHeight();
    header.style.top = `${offset}px`;
  }

  function handleScroll() {
    const current = window.pageYOffset;

    if (current > lastScroll && current > 80) {
      header.classList.add("header--hidden");
    } else {
      header.classList.remove("header--hidden");
    }

    lastScroll = current;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  function init() {
    if (!header) return;

    updateHeaderPosition();
    window.addEventListener("resize", updateHeaderPosition);
    window.addEventListener("scroll", onScroll);
  }

  return { init };
})();

export default HeaderModule;