import { User } from "../models/user.model.js";

export class UserService {
  constructor() {
    this.coll = User;
  }

  async create({
    username,
    email,
    password,
    role,
    isActive,
    lastLogin,
    emailVerified
  }) {
    return this.coll.insertOne({
      data: {
        username,
        email,
        password,
        role,
        isActive,
        lastLogin,
        emailVerified
      }
    });
  }

  async findOneById(id, include) {
    return this.coll.findOne({
      where: { id },
      include,
    });
  }

  async findMany({ where = {}, include, orderBy, limit, skip } = {}) {
    return this.coll.findMany({
      where,
      include,
      orderBy,
      limit,
      skip
    });
  }

  async update(id, {
    username,
    email,
    password,
    role,
    isActive,
    lastLogin,
    emailVerified
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        username,
        email,
        password,
        role,
        isActive,
        lastLogin,
        emailVerified
      }
    });
  }

  async deleteOneById(id) {
    return this.coll.deleteOne({
      where: { id },
    });
  }

  async findByEmail(email) {
    return this.coll.findOne({
      where: { email },
    });
  }

  async findByUsername(username) {
    return this.coll.findOne({
      where: { username },
    });
  }
}

