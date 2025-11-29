import { Students } from "../models/student.model.js";

export class StudentService {
  constructor() {
    this.coll = Students;
  }

  async create({
    userId,
    studentId,
    firstName,
    lastName,
    grade,
    section,
    age,
    gender,
    address,
    parentName,
    parentPhone,
    enrollmentDate,
    status,
    notes
  }) {
    return this.coll.insertOne({
      data: {
        userId,
        studentId,
        firstName,
        lastName,
        grade,
        section,
        age,
        gender,
        address,
        parentName,
        parentPhone,
        enrollmentDate,
        status,
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
    studentId,
    firstName,
    lastName,
    grade,
    section,
    age,
    gender,
    address,
    parentName,
    parentPhone,
    enrollmentDate,
    status,
    notes
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        userId,
        studentId,
        firstName,
        lastName,
        grade,
        section,
        age,
        gender,
        address,
        parentName,
        parentPhone,
        enrollmentDate,
        status,
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

