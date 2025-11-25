import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { InventoryService } from "../services/inventory.service";

const router = Router();
const inventoryController = new InventoryController(new InventoryService());

// Create a new inventory item
router.post("/", (req, res) => inventoryController.create(req, res));

// Get a list of inventory items (with optional query filters)
router.get("/", (req, res) => inventoryController.list(req, res));

// Get a single inventory item by id
router.get("/:id", (req, res) => inventoryController.getOneById(req, res));

// Update an inventory item by id
router.put("/:id", (req, res) => inventoryController.update(req, res));

// Delete an inventory item by id
router.delete("/:id", (req, res, next) => inventoryController.delete(req, res, next));

export default router;
