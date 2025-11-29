import { ForbiddenError } from "../lib/errors/http.error.js";

function teacherGuard(req, res, next) {
  if (!req.user) {
    throw new ForbiddenError("Authentication required");
  }

  if (req.user.role !== "teacher" && req.user.role !== "admin") {
    throw new ForbiddenError("Teacher access required");
  }

  next();
}

export { teacherGuard };

