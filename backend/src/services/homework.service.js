import { Homework } from "../models/homework.model.js";

export class HomeworkService {
  constructor() {
    this.coll = Homework;
  }

  async create({
    title,
    description,
    subjectId,
    classIds,
    teacherId,
    assignedDate,
    dueDate,
    maxPoints,
    instructions,
    attachments,
    isActive,
    notes
  }) {
    return this.coll.insertOne({
      data: {
        title,
        description,
        subjectId,
        classIds,
        teacherId,
        assignedDate,
        dueDate,
        maxPoints,
        instructions,
        attachments,
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
    title,
    description,
    subjectId,
    classIds,
    teacherId,
    assignedDate,
    dueDate,
    maxPoints,
    instructions,
    attachments,
    isActive,
    notes
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        title,
        description,
        subjectId,
        classIds,
        teacherId,
        assignedDate,
        dueDate,
        maxPoints,
        instructions,
        attachments,
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

