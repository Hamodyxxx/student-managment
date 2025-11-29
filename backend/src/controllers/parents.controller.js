import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Parents } from "../models/parents.model.js";

class ParentsController {
  constructor(parentsService) {
    this.parentsService = parentsService;
  }

  async create(req, res) {
    const parseResult = Parents.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.parentsService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid parent id.");

    const item = await this.parentsService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Parent not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.parentsService.findMany({ 
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
      throw new BadRequestError("Invalid parent id.");
    }
    const parseResult = Parents.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.parentsService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Parent not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid parent id.");

    const deleted = await this.parentsService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Parent not found.");
  }
}

export { ParentsController };

