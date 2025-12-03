/**
 * Base HTTP error class with status code.
 * Throw this from route handlers to send specific HTTP errors.
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

// Convenience constructors for HTTP errors
export const BadRequestError = (msg: string) => new HttpError(400, msg);
export const UnauthorizedError = (msg: string) => new HttpError(401, msg);
export const ForbiddenError = (msg: string) => new HttpError(403, msg);
export const NotFoundError = (msg: string) => new HttpError(404, msg);

/**
 * Application-specific error codes for consistent client handling
 */
export enum AppErrorCode {
  // Credit-related errors
  INSUFFICIENT_CREDITS = "INSUFFICIENT_CREDITS",
  INVALID_CREDIT_AMOUNT = "INVALID_CREDIT_AMOUNT",
  
  // Resource errors
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  WORKSPACE_NOT_FOUND = "WORKSPACE_NOT_FOUND",
  GOAL_NOT_FOUND = "GOAL_NOT_FOUND",
  TODO_NOT_FOUND = "TODO_NOT_FOUND",
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  
  // Authorization errors
  ACCESS_DENIED = "ACCESS_DENIED",
  OWNERSHIP_REQUIRED = "OWNERSHIP_REQUIRED",
  
  // Limit errors
  WORKSPACE_LIMIT_REACHED = "WORKSPACE_LIMIT_REACHED",
  CHAT_LIMIT_REACHED = "CHAT_LIMIT_REACHED",
  GOAL_LIMIT_REACHED = "GOAL_LIMIT_REACHED",
  
  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  
  // External service errors
  LLM_ERROR = "LLM_ERROR",
  STRIPE_ERROR = "STRIPE_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  
  // Generic errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Application error with structured error code
 * Use this for business logic errors that need to be handled by the client
 */
export class AppError extends Error {
  constructor(
    public code: AppErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Convenience constructors for common application errors
 */
export const InsufficientCreditsError = (balance: number, required: number) =>
  new AppError(
    AppErrorCode.INSUFFICIENT_CREDITS,
    `Insufficient credits. Required: ${required}, Available: ${balance}`,
    { balance, required }
  );

export const ResourceNotFoundError = (resource: string, id?: number | string) =>
  new AppError(
    AppErrorCode.RESOURCE_NOT_FOUND,
    `${resource} not found${id ? ` (ID: ${id})` : ""}`,
    { resource, id }
  );

export const AccessDeniedError = (resource?: string) =>
  new AppError(
    AppErrorCode.ACCESS_DENIED,
    resource ? `Access denied to ${resource}` : "Access denied",
    { resource }
  );

export const LimitReachedError = (limitType: string, current: number, max: number) =>
  new AppError(
    AppErrorCode.WORKSPACE_LIMIT_REACHED,
    `${limitType} limit reached (${current}/${max})`,
    { limitType, current, max }
  );

export const ValidationError = (field: string, message: string) =>
  new AppError(
    AppErrorCode.VALIDATION_ERROR,
    `Validation error: ${field} - ${message}`,
    { field, message }
  );

export const LLMError = (originalError?: string) =>
  new AppError(
    AppErrorCode.LLM_ERROR,
    "AI service temporarily unavailable. Please try again.",
    { originalError }
  );
