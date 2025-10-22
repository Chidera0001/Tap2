// PWA Detection and Notification Utilities
export class PWANotificationManager {
  private static instance: PWANotificationManager;
  private installPrompt: any = null;
  private isInstalled = false;
  private canInstall = false;
  private notificationShown = false;
  private notificationDismissed = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): PWANotificationManager {
    if (!PWANotificationManager.instance) {
      PWANotificationManager.instance = new PWANotificationManager();
    }
    return PWANotificationManager.instance;
  }

  private initialize() {
    // Only initialize in browser environment
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    // Check if notification was previously dismissed
    this.notificationDismissed =
      localStorage.getItem("pwa-notification-dismissed") === "true";

    // Check if app is already installed as PWA
    this.isInstalled = this.checkIfInstalled();

    if (this.isInstalled) {
      return; // Don't show notification if already installed
    }

    // Listen for install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.installPrompt = e;
      this.canInstall = true;

      // Show notification immediately if not dismissed
      if (!this.notificationDismissed) {
        this.showNotification();
      }
    });

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      this.isInstalled = true;
      this.canInstall = false;
      this.installPrompt = null;
      this.notificationShown = false;
      this.hideNotification();
    });

    // Check for iOS Safari (different install flow)
    this.checkIOSInstallability();
  }

  private checkIfInstalled(): boolean {
    // Only check in browser environment
    if (typeof window === "undefined") {
      return false;
    }

    // Check multiple indicators for PWA installation
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")
    );
  }

  private checkIOSInstallability() {
    // Only check in browser environment
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    // Enhanced mobile detection for debugging
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isInStandaloneMode = (window.navigator as any).standalone === true;

    // For iOS, show instructions since beforeinstallprompt is not supported
    if (isIOS && !isInStandaloneMode && !this.notificationDismissed) {
      setTimeout(() => {
        this.showIOSInstructions();
      }, 2000); // Show after 2 seconds on iOS
    }
  }

  private showNotification() {
    this.notificationShown = true;
    // Dispatch custom event for components to listen to
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pwa-notification-show"));
    }
  }

  private hideNotification() {
    this.notificationShown = false;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pwa-notification-hide"));
    }
  }

  private showIOSInstructions() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pwa-ios-instructions-show"));
    }
  }

  public async installPWA(): Promise<boolean> {
    if (this.installPrompt) {
      this.installPrompt.prompt();
      const { outcome } = await this.installPrompt.userChoice;

      if (outcome === "accepted") {
        this.canInstall = false;
        this.installPrompt = null;
        this.notificationShown = false;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public dismissNotification() {
    this.notificationShown = false;
    this.notificationDismissed = true;

    // Only use localStorage in browser environment
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("pwa-notification-dismissed", "true");
    }

    this.hideNotification();
  }

  public resetNotification() {
    this.notificationDismissed = false;
    this.notificationShown = false;

    // Only use localStorage in browser environment
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("pwa-notification-dismissed");
    }
  }

  // Getters
  public get canShowNotification(): boolean {
    return !this.isInstalled && this.canInstall && !this.notificationDismissed;
  }

  public get shouldShowNotification(): boolean {
    return this.notificationShown && this.canShowNotification;
  }

  public get isPWAInstalled(): boolean {
    return this.isInstalled;
  }

  public get canInstallPWA(): boolean {
    return this.canInstall;
  }
}

// Export singleton instance
export const pwaManager = PWANotificationManager.getInstance();
