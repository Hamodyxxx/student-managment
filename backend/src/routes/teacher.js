import { Router } from "express";
import { TeacherController } from "../controllers/teacher.controller.js";
import { TeacherService } from "../services/teacher.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const teacherController = new TeacherController(new TeacherService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of teachers (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => teacherController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single teacher by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => teacherController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new teacher
 * @param {object} req - Express request object; expects the teacher details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => teacherController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a teacher by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => teacherController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a teacher by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => teacherController.delete(req, res));

/**
 * @route POST /:id/subject
 * @summary Assign a subject to a teacher
 * @param {object} req - Express request object; expects { id } param and { subjectId } in body
 * @param {object} res - Express response object
 */
router.post("/:id/subject", (req, res) => teacherController.assignSubject(req, res));

/**
 * @route DELETE /:id/subject
 * @summary Remove a subject from a teacher
 * @param {object} req - Express request object; expects { id } param and { subjectId } in body
 * @param {object} res - Express response object
 */
router.delete("/:id/subject", (req, res) => teacherController.removeSubject(req, res));

/**
 * @route POST /:id/class
 * @summary Assign a class to a teacher
 * @param {object} req - Express request object; expects { id } param and { classId } in body
 * @param {object} res - Express response object
 */
router.post("/:id/class", (req, res) => teacherController.assignClass(req, res));

/**
 * @route DELETE /:id/class
 * @summary Remove a class from a teacher
 * @param {object} req - Express request object; expects { id } param and { classId } in body
 * @param {object} res - Express response object
 */
router.delete("/:id/class", (req, res) => teacherController.removeClass(req, res));

export default router;

