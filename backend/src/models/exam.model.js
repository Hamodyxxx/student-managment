import { z } from "zod";
import { db } from "../config/db/db";
import { belongsTo, hasMany } from "../lib/db/realations";
import { Classes } from './classes.model.js';
import { Teacher } from "./teacher.model.js";
import { Subject } from "./subject.model.js";

const examShape = {
  title: z.string(),
  description: z.string().optional(),
  examDate: z.date().optional(),
  durationMinutes: z.number().int().nonnegative().optional(),
  totalMarks: z.number().int().nonnegative().optional(),
  subjectId: z.string().optional(),
  classIds: z.array(z.string()).optional(),
  teacherId: z.string().optional(),
  questionIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  notes: z.string().optional(),
};


export const Exam = db.createCollection("exams", examShape, {
  subject: belongsTo("subjects", Subject.schema, "subjectId", "id"),
  classes: hasMany("classes", Classes.schema, "classIds", "id"),
  teacher: belongsTo("teachers", Teacher.schema, "teacherId", "id"),
});
