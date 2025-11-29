import { ForbiddenError } from "../lib/errors/http.error.js";

function adminGuard(req, res, next) {
  if (!req.user) {
    throw new ForbiddenError("Authentication required");
  }

  if (req.user.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }

  next();
}

export { adminGuard };

