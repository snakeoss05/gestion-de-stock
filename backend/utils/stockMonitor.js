// services/stockMonitor.js
import { checkStockLevels } from "../controller/Notification.js";

// Run stock level check every hour
const STOCK_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

class StockMonitor {
  constructor() {
    this.intervalId = null;
  }

  start() {
    // Run immediately on startup
    checkStockLevels();

    // Then set up the interval
    this.intervalId = setInterval(checkStockLevels, STOCK_CHECK_INTERVAL);

    console.log("Stock monitoring service started");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log("Stock monitoring service stopped");
  }
}

export const stockMonitor = new StockMonitor();
