const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator)
    try {
      await navigator.serviceWorker.register("/sw.js");
    } catch (r) {
      console.error("Service worker registration failed", r);
    }
};
window.addEventListener("load", () => {
  registerServiceWorker();
});
