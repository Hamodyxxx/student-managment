import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Classes } from "../models/classes.model.js";

class ClassesController {
  constructor(classesService) {
    this.classesService = classesService;
  }

  async create(req, res) {
    const parseResult = Classes.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.classesService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid class id.");

    const item = await this.classesService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Class not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.classesService.findMany({ 
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
      throw new BadRequestError("Invalid class id.");
    }
    const parseResult = Classes.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.classesService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Class not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid class id.");

    const deleted = await this.classesService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Class not found.");
  }
}

export { ClassesController };

