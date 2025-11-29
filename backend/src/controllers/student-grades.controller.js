import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { StudentGrades } from "../models/student-grades.model.js";

class StudentGradesController {
  constructor(studentGradesService) {
    this.studentGradesService = studentGradesService;
  }

  async create(req, res) {
    const parseResult = StudentGrades.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.studentGradesService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid grade id.");

    const item = await this.studentGradesService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Grade not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.studentGradesService.findMany({ 
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
      throw new BadRequestError("Invalid grade id.");
    }
    const parseResult = StudentGrades.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.studentGradesService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Grade not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid grade id.");

    const deleted = await this.studentGradesService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Grade not found.");
  }
}

export { StudentGradesController };

