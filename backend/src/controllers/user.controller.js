import {
  BadRequestError,
  NotFoundError,
} from "../lib/errors/http.error.js";
import { parseQuery } from "../lib/parseQuery.js";
import { User } from "../models/user.model.js";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async create(req, res) {
    const parseResult = User.schema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const item = await this.userService.create(parseResult.data);
    res.status(201).json(item);
  }

  async getOneById(req, res) {
    const id = req.params.id;
    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid user id.");

    const item = await this.userService.findOneById(id);

    if (item) res.json(item);
    else throw new NotFoundError("User not found.");
  }

  async list(req, res) {
    const {
      filter,
      skip,
      limit,
      orderBy
    } = parseQuery(req.query);

    const items = await this.userService.findMany({ 
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
      throw new BadRequestError("Invalid user id.");
    }
    const parseResult = User.updateSchema.safeParse(req.body);
    if (!parseResult.success)
      throw new BadRequestError("Invalid request body", parseResult.error.issues);

    const updated = await this.userService.update(id, parseResult.data);

    if (updated) res.json(updated);
    else throw new NotFoundError("User not found.");
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id || typeof id !== "string")
      throw new BadRequestError("Invalid user id.");

    const deleted = await this.userService.deleteOneById(id);

    if (deleted) res.json({ success: true });
    else throw new NotFoundError("User not found.");
  }
}

export { UserController };

