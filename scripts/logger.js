class Logger {
  constructor(level = 'info') {
    this.levels = ['debug', 'info', 'warn', 'error'];
    this.currentLevel = level;
  }

  // Helper method to check if the log level is enabled
  isEnabled(level) {
    return this.levels.indexOf(level) >= this.levels.indexOf(this.currentLevel);
  }

  // Log methods for different log levels
  debug(message) {
    if (this.isEnabled('debug')) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  }

  info(message) {
    if (this.isEnabled('info')) {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`);
    }
  }

  warn(message) {
    if (this.isEnabled('warn')) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }
  }

  error(message) {
    if (this.isEnabled('error')) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    }
  }
}

const infoLogger = new Logger('info');
const warnLogger = new Logger('warn');
const debugLogger = new Logger('debug');
const errorLogger = new Logger('error');

// Export loggers
export {
  infoLogger, warnLogger, debugLogger, errorLogger,
};
