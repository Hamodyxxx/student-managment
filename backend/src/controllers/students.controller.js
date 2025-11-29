import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Students } from "../models/student.model.js";

class StudentsController {
  constructor(studentsService) {
    this.studentsService = studentsService;
  }

  async create(req, res) {
    const parseResult = Students.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.studentsService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid student id.");

    const item = await this.studentsService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Student not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.studentsService.findMany({ 
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
      throw new BadRequestError("Invalid student id.");
    }
    const parseResult = Students.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.studentsService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Student not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid student id.");

    const deleted = await this.studentsService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Student not found.");
  }
}

export { StudentsController };

