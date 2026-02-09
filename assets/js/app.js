const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator)
    try {
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    } catch (r) {
      console.error("Service worker registration failed", r);
    }
};

const initNavigation = () => {
  const buttons = document.querySelectorAll("[data-target]");
  const screens = document.querySelectorAll("[data-screen]");
  const screenTitle = document.querySelector(".screen-title");
  const triggers = document.querySelectorAll("[data-screen-target]");
  const logo = document.querySelector(".app-logo");
  if (!screens.length) return;
  const mainTargets = new Set(
    Array.from(buttons)
      .map((button) => button.dataset.target)
      .filter(Boolean),
  );
  let lastMainTarget =
    Array.from(mainTargets)[0] || screens[0].dataset.screen;
  const setActive = (target) => {
    let activeScreen = null;
    screens.forEach((screen) => {
      const isActive = screen.dataset.screen === target;
      screen.classList.toggle("is-active", isActive);
      screen.setAttribute("aria-hidden", isActive ? "false" : "true");
      if (isActive) activeScreen = screen;
    });
    if (mainTargets.has(target)) {
      lastMainTarget = target;
    }
    const hasNavTarget = Array.from(buttons).some(
      (button) => button.dataset.target === target,
    );
    if (hasNavTarget) {
      buttons.forEach((button) => {
        const isActive = button.dataset.target === target;
        button.classList.toggle("is-active", isActive);
        if (isActive) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
      });
    }
    if (screenTitle) {
      const fallback =
        target.charAt(0).toUpperCase() + target.slice(1);
      const label = activeScreen?.dataset.title || fallback;
      screenTitle.textContent = label;
    }
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => setActive(button.dataset.target));
  });
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = trigger.dataset.screenTarget;
      if (target) setActive(target);
    });
  });
  if (logo) {
    logo.addEventListener("click", () => {
      if (lastMainTarget) setActive(lastMainTarget);
    });
  }
  if (buttons.length) setActive(buttons[0].dataset.target);
  else setActive(screens[0].dataset.screen);
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
    try {
      localStorage.setItem("theme", toggle.checked ? "dark" : "light");
    } catch (e) {
    }
    if (typeof window.__applyThemeAssets === "function") {
      window.__applyThemeAssets(toggle.checked ? "dark" : "light");
    }
  });
  syncChecked();
};

window.addEventListener("load", () => {
  registerServiceWorker();
  initNavigation();
  initThemeToggle();
});
