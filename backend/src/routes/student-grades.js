import { Router } from "express";
import { StudentGradesController } from "../controllers/student-grades.controller.js";
import { StudentGradesService } from "../services/student-grades.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const studentGradesController = new StudentGradesController(new StudentGradesService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of student grades (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => studentGradesController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single student grade by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => studentGradesController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new student grade
 * @param {object} req - Express request object; expects the grade details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => studentGradesController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a student grade by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => studentGradesController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a student grade by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => studentGradesController.delete(req, res));

export default router;

