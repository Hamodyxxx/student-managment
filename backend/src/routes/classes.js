import { Router } from "express";
import { ClassesController } from "../controllers/classes.controller.js";
import { ClassesService } from "../services/classes.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const classesController = new ClassesController(new ClassesService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of classes (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => classesController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single class by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => classesController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new class
 * @param {object} req - Express request object; expects the class details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => classesController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a class by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => classesController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a class by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => classesController.delete(req, res));

export default router;

