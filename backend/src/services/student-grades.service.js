import { StudentGrades } from "../models/student-grades.model.js";

export class StudentGradesService {
  constructor() {
    this.coll = StudentGrades;
  }

  async create({
    studentId,
    examId,
    subjectId,
    teacherId,
    grade,
    maxGrade,
    comment,
    dateRecorded
  }) {
    return this.coll.insertOne({
      data: {
        studentId,
        examId,
        subjectId,
        teacherId,
        grade,
        maxGrade,
        comment,
        dateRecorded
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
    studentId,
    examId,
    subjectId,
    teacherId,
    grade,
    maxGrade,
    comment,
    dateRecorded
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        studentId,
        examId,
        subjectId,
        teacherId,
        grade,
        maxGrade,
        comment,
        dateRecorded
      }
    });
  }

  async deleteOneById(id) {
    return this.coll.deleteOne({
      where: { id },
    });
  }
}

