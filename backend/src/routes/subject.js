import { Router } from "express";
import { SubjectController } from "../controllers/subject.controller.js";
import { SubjectService } from "../services/subject.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const subjectController = new SubjectController(new SubjectService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of subjects (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => subjectController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single subject by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => subjectController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new subject
 * @param {object} req - Express request object; expects the subject details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => subjectController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a subject by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => subjectController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a subject by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => subjectController.delete(req, res));

export default router;

