import "../styles/main.css";
import "../styles/pages/destination.css";
import "../styles/pages/favorite.css";
import Router from "./routes/router";
import Header from "./views/components/header";
import Footer from "./views/components/footer";

class App {
  constructor() {
    console.log("App: Constructor called");
    this._header = new Header();
    this._footer = new Footer();
    this._router = new Router();
    this._initialized = false;
  }

  async init() {
    // Prevent multiple initializations
    if (this._initialized) {
      console.log("App: Already initialized");
      return;
    }

    console.log("App: Starting initialization...");
    try {
      await this._header.render();
      console.log("App: Header rendered");

      await this._footer.render();
      console.log("App: Footer rendered");

      this._router.init();
      console.log("App: Router initialized");

      this._initialized = true;
    } catch (error) {
      console.error("App: Initialization error:", error);
      // Show error message to user if needed
    }
  }
}

// Create app instance
const app = new App();

// Initialize app on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded, initializing app...");
  app.init();
});

// Backup initialization on window load
window.addEventListener("load", () => {
  console.log("Window loaded, checking initialization...");
  if (!app._initialized) {
    console.log("App not initialized yet, initializing now...");
    app.init();
  }
});
