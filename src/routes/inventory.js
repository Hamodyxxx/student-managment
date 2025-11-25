import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { InventoryService } from "../services/inventory.service";

const router = Router();
const inventoryController = new InventoryController(new InventoryService());


/**
 * @route GET /
 * @summary Get a list of inventory items (supports optional query filters)
 * @param {object} req - Express request object; can include query params for filtering
 * @param {object} res - Express response object
 */
router.get("/", (req, res) => inventoryController.list(req, res));

/**
 * @route GET /:id
 * @summary Get a single inventory item by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 */
router.get("/:id", (req, res) => inventoryController.getOneById(req, res));

/**
 * @route POST /
 * @summary Create a new inventory item
 * @param {object} req - Express request object; expects the item details in body
 * @param {object} res - Express response object
 */
router.post("/", (req, res) => inventoryController.create(req, res));

/**
 * @route PUT /:id
 * @summary Update an inventory item by id
 * @param {object} req - Express request object; expects { id } param and update data in body
 * @param {object} res - Express response object
 */
router.put("/:id", (req, res) => inventoryController.update(req, res));

/**
 * @route DELETE /:id
 * @summary Delete an inventory item by id
 * @param {object} req - Express request object; expects { id } param
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
router.delete("/:id", (req, res) => inventoryController.delete(req, res));

export default router;
