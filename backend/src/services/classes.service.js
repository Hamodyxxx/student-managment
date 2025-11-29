import { Classes } from "../models/classes.model.js";

export class ClassesService {
  constructor() {
    this.coll = Classes;
  }

  async create({
    className,
    gradeLevel,
    homeroomTeacherId,
    capacity,
    roomNumber,
    description
  }) {
    return this.coll.insertOne({
      data: {
        className,
        gradeLevel,
        homeroomTeacherId,
        capacity,
        roomNumber,
        description
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
    className,
    gradeLevel,
    homeroomTeacherId,
    capacity,
    roomNumber,
    description
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        className,
        gradeLevel,
        homeroomTeacherId,
        capacity,
        roomNumber,
        description
      }
    });
  }

  async deleteOneById(id) {
    return this.coll.deleteOne({
      where: { id },
    });
  }
}

