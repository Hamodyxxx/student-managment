import { Request, Response, NextFunction } from "express";
import { InventoryService } from "../services/inventory.service";
import { Inventory } from "../models/inventory.model.js";
import { z } from "zod";
import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error";

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
    res: Response
  ): Promise<void> {
    const parseResult = createSchema.safeParse(req.body);
    if (!parseResult.success) throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.inventoryService.createItem(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(
    req: Request<InventoryIdParam>,
    res: Response
  ): Promise<void> {
    const id = req.params.id;
    if (!id || typeof id !== "string") throw new BadRequestError("Invalid item id.");
    
    const item = await this.inventoryService.getItem({ id });

    if (item) res.json(item);
    else throw new NotFoundError("Item not found.");
  }

  async list(
    req: Request,
    res: Response
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
    res: Response
  ): Promise<void> {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw new BadRequestError("Invalid item id.");
    }
    const parseResult = updateSchema.safeParse(req.body);
    if (!parseResult.success) throw new BadRequestError("Invalid request body", parseResult.error.issues);
    
    const updated = await this.inventoryService.updateItem({ id }, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Item not found.");
  }

  async delete(
    req: Request<InventoryIdParam>,
    res: Response
  ): Promise<void> {
    const id = req.params.id;

    if (!id || typeof id !== "string") throw new BadRequestError("Invalid item id.");

    const deleted = await this.inventoryService.deleteItem({ id });

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Item not found.");
  }
}

export { InventoryController };