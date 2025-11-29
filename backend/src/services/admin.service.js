import { Admin } from "../models/admin.model.js";

export class AdminService {
  constructor() {
    this.coll = Admin;
  }

  async create({
    userId,
    firstName,
    lastName,
    phone,
    department,
    permissions,
    notes
  }) {
    return this.coll.insertOne({
      data: {
        userId,
        firstName,
        lastName,
        phone,
        department,
        permissions,
        notes
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
    userId,
    firstName,
    lastName,
    phone,
    department,
    permissions,
    notes
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        userId,
        firstName,
        lastName,
        phone,
        department,
        permissions,
        notes
      }
    });
  }

  async deleteOneById(id) {
    return this.coll.deleteOne({
      where: { id },
    });
  }
}

