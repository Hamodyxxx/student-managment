import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { UserService } from "../services/user.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const userController = new UserController(new UserService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of users (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => userController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single user by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => userController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new user
 * @param {object} req - Express request object; expects the user details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => userController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a user by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => userController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a user by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => userController.delete(req, res));

export default router;

