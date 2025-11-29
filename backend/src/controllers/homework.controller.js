import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Homework } from "../models/homework.model.js";

class HomeworkController {
  constructor(homeworkService) {
    this.homeworkService = homeworkService;
  }

  async create(req, res) {
    const parseResult = Homework.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.homeworkService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid homework id.");

    const item = await this.homeworkService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Homework not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.homeworkService.findMany({ 
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
      throw new BadRequestError("Invalid homework id.");
    }
    const parseResult = Homework.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.homeworkService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Homework not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid homework id.");

    const deleted = await this.homeworkService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Homework not found.");
  }
}

export { HomeworkController };

