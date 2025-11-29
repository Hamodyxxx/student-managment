import { Parents } from "../models/parents.model.js";

export class ParentsService {
  constructor() {
    this.coll = Parents;
  }

  async create({
    userId,
    name,
    phone,
    email,
    address,
    job,
    relation,
    createdAt
  }) {
    return this.coll.insertOne({
      data: {
        userId,
        name,
        phone,
        email,
        address,
        job,
        relation,
        createdAt
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
    name,
    phone,
    email,
    address,
    job,
    relation,
    createdAt
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        userId,
        name,
        phone,
        email,
        address,
        job,
        relation,
        createdAt
      }
    });
  }

  async deleteOneById(id) {
    return this.coll.deleteOne({
      where: { id },
    });
  }
}

