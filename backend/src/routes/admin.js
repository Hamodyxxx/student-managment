import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { AdminService } from "../services/admin.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminGuard } from "../middlewares/admin.guard.middleware.js";

const router = Router();
const adminController = new AdminController(new AdminService());

router.use(authMiddleware);
router.use(adminGuard);

/**
 * @route GET /
 * @summary Get a list of admins (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => adminController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single admin by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => adminController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new admin
 * @param {object} req - Express request object; expects the admin details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => adminController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update an admin by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => adminController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete an admin by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => adminController.delete(req, res));

export default router;

