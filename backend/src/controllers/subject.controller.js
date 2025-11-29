import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Subject } from "../models/subject.model.js";

class SubjectController {
  constructor(subjectService) {
    this.subjectService = subjectService;
  }

  async create(req, res) {
    const parseResult = Subject.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.subjectService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid subject id.");

    const item = await this.subjectService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Subject not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.subjectService.findMany({ 
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
      throw new BadRequestError("Invalid subject id.");
    }
    const parseResult = Subject.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.subjectService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Subject not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid subject id.");

    const deleted = await this.subjectService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Subject not found.");
  }
}

export { SubjectController };

