import { Router } from "express";
import { ExamController } from "../controllers/exam.controller.js";
import { ExamService } from "../services/exam.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const examController = new ExamController(new ExamService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of exams (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => examController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single exam by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => examController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new exam
 * @param {object} req - Express request object; expects the exam details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => examController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update an exam by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => examController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete an exam by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => examController.delete(req, res));

/**
 * @route POST /:id/teacher
 * @summary Assign a teacher to an exam
 * @param {object} req - Express request object; expects { id } param and { teacherId } in body
 * @param {object} res - Express response object
 */
router.post("/:id/teacher", (req, res) => examController.assignTeacher(req, res));

/**
 * @route POST /:id/subject
 * @summary Assign a subject to an exam
 * @param {object} req - Express request object; expects { id } param and { subjectId } in body
 * @param {object} res - Express response object
 */
router.post("/:id/subject", (req, res) => examController.assignSubject(req, res));

/**
 * @route POST /:id/class
 * @summary Assign a class to an exam
 * @param {object} req - Express request object; expects { id } param and { classId } in body
 * @param {object} res - Express response object
 */
router.post("/:id/class", (req, res) => examController.assignClass(req, res));

export default router;

