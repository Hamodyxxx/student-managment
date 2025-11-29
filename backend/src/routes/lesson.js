import { Router } from "express";
import { LessonController } from "../controllers/lesson.controller.js";
import { LessonService } from "../services/lesson.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const lessonController = new LessonController(new LessonService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of lessons (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => lessonController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single lesson by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => lessonController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new lesson
 * @param {object} req - Express request object; expects the lesson details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => lessonController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a lesson by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => lessonController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a lesson by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => lessonController.delete(req, res));

export default router;

