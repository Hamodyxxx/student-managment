import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Admin } from "../models/admin.model.js";

class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  async create(req, res) {
    const parseResult = Admin.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.adminService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid admin id.");

    const item = await this.adminService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Admin not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.adminService.findMany({ 
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
      throw new BadRequestError("Invalid admin id.");
    }
    const parseResult = Admin.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.adminService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Admin not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid admin id.");

    const deleted = await this.adminService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Admin not found.");
  }
}

export { AdminController };

