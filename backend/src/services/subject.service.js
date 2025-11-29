import { Subject } from "../models/subject.model.js";

export class SubjectService {
  constructor() {
    this.coll = Subject;
  }

  async create({
    name,
    code,
    description,
    gradeLevel,
    creditHours,
    department,
    isActive,
    notes
  }) {
    return this.coll.insertOne({
      data: {
        name,
        code,
        description,
        gradeLevel,
        creditHours,
        department,
        isActive,
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
    name,
    code,
    description,
    gradeLevel,
    creditHours,
    department,
    isActive,
    notes
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        name,
        code,
        description,
        gradeLevel,
        creditHours,
        department,
        isActive,
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

