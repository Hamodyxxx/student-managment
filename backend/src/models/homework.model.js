import { z } from "zod";
import { db } from "../config/db/db";
import { belongsTo, hasMany } from "../lib/db/realations";
import { Subject } from "./subject.model.js";
import { Classes } from "./classes.model.js";
import { Teacher } from "./teacher.model.js";

const homeworkSchema = {
  title: z.string(),
  description: z.string().optional(),
  subjectId: z.string().optional(),
  classIds: z.array(z.string()).optional(),
  teacherId: z.string().optional(),
  assignedDate: z.date().optional(),
  dueDate: z.date().optional(),
  maxPoints: z.number().int().nonnegative().optional(),
  instructions: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  notes: z.string().optional(),
};

export const Homework = db.createCollection("homework", homeworkSchema, {
  subject: belongsTo("subjects", Subject.schema, "subjectId", "id"),
  classes: hasMany("classes", Classes.schema, "classIds", "id"),
  teacher: belongsTo("teachers", Teacher.schema, "teacherId", "id"),
});

