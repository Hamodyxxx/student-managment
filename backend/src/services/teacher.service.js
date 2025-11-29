import { Teacher } from "../models/teacher.model.js";

export class TeacherService {
  constructor() {
    this.coll = Teacher;
  }

  async create({
    userId,
    firstName,
    lastName,
    email,
    phone,
    nationality,
    hiredAt,
    subjectIds,
    classIds
  }) {
    return this.coll.insertOne({
      data: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        hiredAt,
        subjectIds,
        classIds
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
    email,
    phone,
    nationality,
    hiredAt,
    subjectIds,
    classIds
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        hiredAt,
        subjectIds,
        classIds
      }
    });
  }

  async deleteOneById(id) {
    return this.coll.deleteOne({
      where: { id },
    });
  }

  async assignSubject(teacherId, subjectId) {
    const teacher = await this.findOneById(teacherId);
    if (!teacher) return null;

    const subjectIds = teacher.subjectIds ?? [];
    if (!subjectIds.includes(subjectId)) subjectIds.push(subjectId);

    return this.update(teacherId, { subjectIds });
  }

  async removeSubject(teacherId, subjectId) {
    const teacher = await this.findOneById(teacherId);
    if (!teacher) return null;

    const subjectIds = (teacher.subjectIds ?? []).filter(id => id !== subjectId);

    return this.update(teacherId, { subjectIds });
  }

  async assignClass(teacherId, classId) {
    const teacher = await this.findOneById(teacherId);
    if (!teacher) return null;

    const classIds = teacher.classIds ?? [];
    if (!classIds.includes(classId)) classIds.push(classId);

    return this.update(teacherId, { classIds });
  }

  async removeClass(teacherId, classId) {
    const teacher = await this.findOneById(teacherId);
    if (!teacher) return null;

    const classIds = (teacher.classIds ?? []).filter(id => id !== classId);

    return this.update(teacherId, { classIds });
  }
}
