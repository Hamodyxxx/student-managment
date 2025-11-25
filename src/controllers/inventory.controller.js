import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";


class InventoryController {
  constructor(inventoryService) {
    this.inventoryService = inventoryService;
  }

  async create(req, res) {
    const parseResult = createSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.inventoryService.createItem(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid item id.");

    const item = await this.inventoryService.getItem({ id });

    if (item) res.json(item);
    else throw new NotFoundError("Item not found.");
  }

  async list(req, res) {
    const possibleKeys = Object.keys(inventorySchemaShape);
    const filter = {};

    for (const k of possibleKeys) {
      const v = req.query[k];
      if (v !== undefined) filter[k] = v;
    }

    const items = await this.inventoryService.getAllItems(filter);
    res.json(items);
  }

  async update(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw new BadRequestError("Invalid item id.");
    }
    const parseResult = updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.inventoryService.updateItem({ id }, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Item not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid item id.");

    const deleted = await this.inventoryService.deleteItem({ id });

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Item not found.");
  }
}

export { InventoryController };