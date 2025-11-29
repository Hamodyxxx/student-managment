import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Inventory } from "../models/inventory.model.js";

class InventoryController {
  constructor(inventoryService) {
    this.inventoryService = inventoryService;
  }

  async create(req, res) {
    const parseResult = Inventory.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.inventoryService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid item id.");

    const item = await this.inventoryService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Item not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.inventoryService.findMany({ 
      where: filter,
      skip,
      limit,
      orderBy
    });
    res.json(items);
  }

  async update(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw new BadRequestError("Invalid item id.");
    }
    const parseResult = Inventory.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.inventoryService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Item not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid item id.");

    const deleted = await this.inventoryService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Item not found.");
  }
}

export { InventoryController };
