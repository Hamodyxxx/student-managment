import { Request, Response, NextFunction } from "express";
import { InventoryService } from "../services/inventory.service";
import { Inventory } from "../models/inventory.model.js";
import { z } from "zod";

type InventoryCreateInput = z.infer<typeof Inventory.schema>;
type InventoryUpdateInput = z.infer<typeof Inventory.updateSchema>;
type InventoryIdParam = { id: string };

const inventorySchemaShape = Inventory.schema.shape;
const createSchema = Inventory.schema;
const updateSchema = Inventory.updateSchema;

class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  async create(
    req: Request<{}, {}, InventoryCreateInput>,
    res: Response,
  ): Promise<void> {
    const parseResult = createSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
      return;
    }

    const item = await this.inventoryService.createItem(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(
    req: Request<InventoryIdParam>,
    res: Response,
  ): Promise<void> {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Invalid item id." });
      return;
    }

    const item = await this.inventoryService.getItem({ id });

    if (item) res.json(item);
    else res.status(404).json({ error: "Item not found." });
  }

  async list(
    req: Request,
    res: Response,
  ): Promise<void> {
    const possibleKeys = Object.keys(inventorySchemaShape);
    const filter: Record<string, unknown> = {};

    for (const k of possibleKeys) {
      const v = req.query[k];
      if (v !== undefined) filter[k] = v;
    }

    const items = await this.inventoryService.getAllItems(filter);
    res.json(items);
  }

  async update(
    req: Request<InventoryIdParam, {}, InventoryUpdateInput>,
    res: Response,
  ): Promise<void> {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Invalid item id." });
      return;
    }
    const parseResult = updateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
      return;
    }

    const updated = await this.inventoryService.updateItem({ id }, parseResult.data);

    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: "Item not found." });
    }
  }

  async delete(
    req: Request<InventoryIdParam>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Invalid item id." });
      return;
    }

    const deleted = await this.inventoryService.deleteItem({ id });

    if (deleted) res.json({ success: true });
    else res.status(404).json({
      error: "Item not found.",
      success: false
    });
  }
}

export { InventoryController };