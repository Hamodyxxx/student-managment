import { UnauthorizedError } from "../lib/errors/http.error.js";
import { UserService } from "../services/user.service.js";

const userService = new UserService();

async function authMiddleware(req, res, next) {
  try {
    const userId = req.headers["x-user-id"] || req.headers["user-id"];
    
    if (!userId) {
      throw new UnauthorizedError("Authentication required");
    }

    const user = await userService.findOneById(userId);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedError("Invalid or inactive user");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export { authMiddleware };

