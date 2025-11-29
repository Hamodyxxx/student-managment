import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Teacher } from "../models/teacher.model.js";

class TeacherController {
  constructor(teacherService) {
    this.teacherService = teacherService;
  }

  async create(req, res) {
    const parseResult = Teacher.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.teacherService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid teacher id.");

    const item = await this.teacherService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Teacher not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.teacherService.findMany({ 
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
      throw new BadRequestError("Invalid teacher id.");
    }
    const parseResult = Teacher.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.teacherService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Teacher not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid teacher id.");

    const deleted = await this.teacherService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Teacher not found.");
  }

  async assignSubject(req, res) {
    const { id } = req.params;
    const { subjectId } = req.body;
    if (!id || !subjectId) throw new BadRequestError("Missing parameters.");

    const updated = await this.teacherService.assignSubject(id, subjectId);
    if (!updated) throw new NotFoundError("Teacher not found.");
    res.json(updated);
  }

  async removeSubject(req, res) {
    const { id } = req.params;
    const { subjectId } = req.body;
    if (!id || !subjectId) throw new BadRequestError("Missing parameters.");

    const updated = await this.teacherService.removeSubject(id, subjectId);
    if (!updated) throw new NotFoundError("Teacher not found.");
    res.json(updated);
  }

  async assignClass(req, res) {
    const { id } = req.params;
    const { classId } = req.body;
    if (!id || !classId) throw new BadRequestError("Missing parameters.");

    const updated = await this.teacherService.assignClass(id, classId);
    if (!updated) throw new NotFoundError("Teacher not found.");
    res.json(updated);
  }

  async removeClass(req, res) {
    const { id } = req.params;
    const { classId } = req.body;
    if (!id || !classId) throw new BadRequestError("Missing parameters.");

    const updated = await this.teacherService.removeClass(id, classId);
    if (!updated) throw new NotFoundError("Teacher not found.");
    res.json(updated);
  }
}

export { TeacherController };
