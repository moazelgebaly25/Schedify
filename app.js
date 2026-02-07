const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator)
    try {
      await navigator.serviceWorker.register("./sw.js", { scope: "./" });
    } catch (r) {
      console.error("Service worker registration failed", r);
    }
};

const initNavigation = () => {
  const buttons = document.querySelectorAll("[data-target]");
  const screens = document.querySelectorAll("[data-screen]");
  const screenTitle = document.querySelector(".screen-title");
  if (!buttons.length || !screens.length) return;
  const setActive = (target) => {
    screens.forEach((screen) => {
      const isActive = screen.dataset.screen === target;
      screen.classList.toggle("is-active", isActive);
      screen.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    buttons.forEach((button) => {
      const isActive = button.dataset.target === target;
      button.classList.toggle("is-active", isActive);
      if (isActive) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (screenTitle) {
      const label = target.charAt(0).toUpperCase() + target.slice(1);
      screenTitle.textContent = label;
    }
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => setActive(button.dataset.target));
  });
  setActive(buttons[0].dataset.target);
};

const initThemeToggle = () => {
  const toggle = document.querySelector("#themeToggle");
  if (!toggle) return;
  const root = document.documentElement;
  const syncChecked = () => {
    toggle.checked = root.classList.contains("dark");
  };
  toggle.addEventListener("change", () => {
    root.classList.toggle("dark", toggle.checked);
  });
  syncChecked();
};

window.addEventListener("load", () => {
  registerServiceWorker();
  initNavigation();
  initThemeToggle();
});
