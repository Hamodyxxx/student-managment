import { z } from "zod";
import { db } from "../config/db/db";
import { belongsTo } from "../lib/db/realations";
import { Students } from "./student.model.js";
import { Exam } from "./exam.model.js";
import { Subject } from "./subject.model.js";
import { Teacher } from "./teacher.model.js";

const studentGradesSchema = {
  studentId: z.string(),
  examId: z.string(),
  subjectId: z.string(),
  teacherId: z.string().optional(),
  grade: z.number().min(0),
  maxGrade: z.number().min(1),
  comment: z.string().optional(),
  dateRecorded: z.date().optional(),
};

export const StudentGrades = db.createCollection("student-grades", studentGradesSchema, {
  student: belongsTo("students", Students.schema, "studentId", "id"),
  exam: belongsTo("exams", Exam.schema, "examId", "id"),
  subject: belongsTo("subjects", Subject.schema, "subjectId", "id"),
  teacher: belongsTo("teachers", Teacher.schema, "teacherId", "id"),
});

