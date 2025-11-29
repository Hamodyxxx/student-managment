import { Router } from "express";
import { ParentsController } from "../controllers/parents.controller.js";
import { ParentsService } from "../services/parents.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const parentsController = new ParentsController(new ParentsService());

router.use(authMiddleware);

/**
 * @route GET /
 * @summary Get a list of parents (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => parentsController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single parent by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => parentsController.getOneById(req, res));

/**a
 * @route POST /
 * @summary Create a new parent
 * @param {object} req - Express request object; expects the parent details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => parentsController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update a parent by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => parentsController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete a parent by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => parentsController.delete(req, res));

export default router;

