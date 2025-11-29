import { Lesson } from "../models/lesson.model.js";

export class LessonService {
  constructor() {
    this.coll = Lesson;
  }

  async create({
    title,
    description,
    subjectId,
    classId,
    teacherId,
    lessonDate,
    durationMinutes,
    materials,
    objectives,
    notes
  }) {
    return this.coll.insertOne({
      data: {
        title,
        description,
        subjectId,
        classId,
        teacherId,
        lessonDate,
        durationMinutes,
        materials,
        objectives,
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
    classId,
    teacherId,
    lessonDate,
    durationMinutes,
    materials,
    objectives,
    notes
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        title,
        description,
        subjectId,
        classId,
        teacherId,
        lessonDate,
        durationMinutes,
        materials,
        objectives,
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

