import { AppError } from "./app.error";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details) {
    super(message, 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", details) {
    super(message, 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details) {
    super(message, 409, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", details) {
    super(message, 500, details);
  }
}
