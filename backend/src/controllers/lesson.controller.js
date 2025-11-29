import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { Lesson } from "../models/lesson.model.js";

class LessonController {
  constructor(lessonService) {
    this.lessonService = lessonService;
  }

  async create(req, res) {
    const parseResult = Lesson.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.lessonService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid lesson id.");

    const item = await this.lessonService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("Lesson not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.lessonService.findMany({ 
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
      throw new BadRequestError("Invalid lesson id.");
    }
    const parseResult = Lesson.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.lessonService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("Lesson not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid lesson id.");

    const deleted = await this.lessonService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("Lesson not found.");
  }
}

export { LessonController };

