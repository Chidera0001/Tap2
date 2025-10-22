// Service Worker Registration
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Service worker registered successfully
        })
        .catch((registrationError) => {
          // Service worker registration failed
        });
    });
  }
}

// PWA Install Prompt - Basic setup (detailed UI handled by PWAStatus component)
export function setupPWAInstallPrompt() {
  window.addEventListener("appinstalled", () => {
    // PWA was installed successfully
  });
}
