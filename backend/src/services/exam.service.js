import { Exam } from "../models/exam.model.js";

export class ExamService {
  constructor() {
    this.coll = Exam;
  }

  async create({ 
    title, 
    description, 
    examDate, 
    durationMinutes, 
    totalMarks,
    subjectId,
    classIds,
    teacherId,
    questionIds,
    isActive,
    notes
  }) {
    return this.coll.insertOne({
      data: {
        title, 
        description, 
        examDate, 
        durationMinutes, 
        totalMarks,
        subjectId,
        classIds,
        teacherId,
        questionIds,
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
    examDate, 
    durationMinutes, 
    totalMarks,
    subjectId,
    classIds,
    teacherId,
    questionIds,
    isActive,
    notes
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        title, 
        description, 
        examDate, 
        durationMinutes, 
        totalMarks,
        subjectId,
        classIds,
        teacherId,
        questionIds,
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

  async assignTeacher(examId, teacherId) {
    const exam = await this.findOneById(examId);
    if (!exam) return null;
    return this.update(examId, { teacherId });
  }

  async assignSubject(examId, subjectId) {
    const exam = await this.findOneById(examId);
    if (!exam) return null;
    return this.update(examId, { subjectId });
  }

  async assignClass(examId, classId) {
    const exam = await this.findOneById(examId);
    if (!exam) return null;
    return this.update(examId, { classId });
  }
}
