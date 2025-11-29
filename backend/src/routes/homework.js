import { Router } from "express";
import { HomeworkController } from "../controllers/homework.controller.js";
import { HomeworkService } from "../services/homework.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const homeworkController = new HomeworkController(new HomeworkService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of homework assignments (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => homeworkController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single homework assignment by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => homeworkController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new homework assignment
 * @param {object} req - Express request object; expects the homework details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => homeworkController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a homework assignment by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => homeworkController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a homework assignment by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => homeworkController.delete(req, res));

export default router;

