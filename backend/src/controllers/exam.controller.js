import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Exam } from "../models/exam.model.js";

class ExamController {
  constructor(examService) {
    this.examService = examService;
  }

  async create(req, res) {
    const parseResult = Exam.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.examService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid exam id.");

    const item = await this.examService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Exam not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.examService.findMany({ 
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
      throw new BadRequestError("Invalid exam id.");
    }
    const parseResult = Exam.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.examService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Exam not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid exam id.");

    const deleted = await this.examService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Exam not found.");
  }

  async assignTeacher(req, res) {
    const { id } = req.params;
    const { teacherId } = req.body;
    if (!id || !teacherId) throw new BadRequestError("Missing parameters.");

    const updated = await this.examService.assignTeacher(id, teacherId);
    if (!updated) throw new NotFoundError("Exam not found.");
    res.json(updated);
  }

  async assignSubject(req, res) {
    const { id } = req.params;
    const { subjectId } = req.body;
    if (!id || !subjectId) throw new BadRequestError("Missing parameters.");

    const updated = await this.examService.assignSubject(id, subjectId);
    if (!updated) throw new NotFoundError("Exam not found.");
    res.json(updated);
  }

  async assignClass(req, res) {
    const { id } = req.params;
    const { classId } = req.body;
    if (!id || !classId) throw new BadRequestError("Missing parameters.");

    const updated = await this.examService.assignClass(id, classId);
    if (!updated) throw new NotFoundError("Exam not found.");
    res.json(updated);
  }
}

export { ExamController };
