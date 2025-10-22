// Service Worker Registration
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}

// PWA Install Prompt - Basic setup (detailed UI handled by PWAStatus component)
export function setupPWAInstallPrompt() {
  window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");
  });
}
