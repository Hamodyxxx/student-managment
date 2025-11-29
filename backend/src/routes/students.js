import { Router } from "express";
import { StudentsController } from "../controllers/students.controller.js";
import { StudentService } from "../services/student.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const studentsController = new StudentsController(new StudentService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of students (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => studentsController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single student by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => studentsController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new student
 * @param {object} req - Express request object; expects the student details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => studentsController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a student by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => studentsController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a student by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => studentsController.delete(req, res));

export default router;

