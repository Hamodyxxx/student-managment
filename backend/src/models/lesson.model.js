import { z } from "zod";
import { db } from "../config/db/db";
import { belongsTo } from "../lib/db/realations";
import { Subject } from "./subject.model.js";
import { Classes } from "./classes.model.js";
import { Teacher } from "./teacher.model.js";

const lessonSchema = {
  title: z.string(),
  description: z.string().optional(),
  subjectId: z.string().optional(),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
  lessonDate: z.date().optional(),
  durationMinutes: z.number().int().nonnegative().optional(),
  materials: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  notes: z.string().optional(),
};

export const Lesson = db.createCollection("lessons", lessonSchema, {
  subject: belongsTo("subjects", Subject.schema, "subjectId", "id"),
  class: belongsTo("classes", Classes.schema, "classId", "id"),
  teacher: belongsTo("teachers", Teacher.schema, "teacherId", "id"),
});

