// lib/server-logger.ts
/**
 * Server-side logging utility với structured logging
 * Hỗ trợ logging chi tiết cho debugging và monitoring
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  stack?: string;
}

/**
 * Format log entry thành string readable
 */
function formatLogEntry(entry: LogEntry): string {
  const timestamp = entry.timestamp;
  const level = entry.level.toUpperCase().padEnd(5);
  const message = entry.message;
  
  let output = `[${timestamp}] ${level} ${message}`;
  
  if (entry.context && Object.keys(entry.context).length > 0) {
    output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
  }
  
  if (entry.error) {
    output += `\n  Error: ${entry.error.message}`;
    if (entry.stack) {
      output += `\n  Stack: ${entry.stack}`;
    }
  }
  
  return output;
}

/**
 * Server-side logger với structured logging
 */
class ServerLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    if (!this.isDevelopment && !this.isProduction) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
    };
    
    console.log(formatLogEntry(entry));
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
      error,
      stack: error?.stack,
    };
    
    console.warn(formatLogEntry(entry));
  }

  /**
   * Log error message với full context
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const err = error instanceof Error ? error : new Error(String(error));
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context: {
        ...context,
        errorName: err.name,
        errorMessage: err.message,
      },
      error: err,
      stack: err.stack,
    };
    
    console.error(formatLogEntry(entry));
    
    // ✅ Trong production, có thể gửi lên error tracking service (Sentry, etc.)
    if (this.isProduction) {
      // TODO: Integrate with error tracking service
      // Example: Sentry.captureException(err, { extra: context });
    }
  }

  /**
   * Log debug message (chỉ trong development)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.isDevelopment) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      context,
    };
    
    console.debug(formatLogEntry(entry));
  }

  /**
   * Log API request với context
   */
  logRequest(
    method: string,
    path: string,
    context?: {
      params?: Record<string, any>;
      query?: Record<string, any>;
      body?: any;
      userId?: string;
      duration?: number;
    }
  ): void {
    const message = `${method} ${path}`;
    const logContext: LogContext = {
      method,
      path,
      ...context,
    };
    
    if (context?.duration) {
      this.info(`${message} - ${context.duration}ms`, logContext);
    } else {
      this.info(message, logContext);
    }
  }

  /**
   * Log API error với full context
   */
  logApiError(
    method: string,
    path: string,
    error: Error | unknown,
    context?: {
      params?: Record<string, any>;
      query?: Record<string, any>;
      body?: any;
      userId?: string;
      statusCode?: number;
    }
  ): void {
    const err = error instanceof Error ? error : new Error(String(error));
    const message = `API Error: ${method} ${path}`;
    
    this.error(message, err, {
      method,
      path,
      statusCode: context?.statusCode || 500,
      ...context,
    });
  }

  /**
   * Log database operation
   */
  logDbOperation(
    operation: string,
    table: string,
    context?: {
      recordId?: string;
      userId?: string;
      duration?: number;
      error?: Error;
    }
  ): void {
    const message = `DB ${operation}: ${table}`;
    
    if (context?.error) {
      this.error(message, context.error, context);
    } else {
      const logContext: LogContext = {
        operation,
        table,
        ...context,
      };
      
      if (context?.duration) {
        this.info(`${message} - ${context.duration}ms`, logContext);
      } else {
        this.info(message, logContext);
      }
    }
  }
}

// Export singleton instance
export const serverLogger = new ServerLogger();

// Export types for use in other files
export type { LogLevel, LogContext };

