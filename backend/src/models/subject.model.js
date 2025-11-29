import { z } from "zod";
import { db } from "../config/db/db";

const subjectSchema = {
  name: z.string(),
  code: z.string().optional(),
  description: z.string().optional(),
  gradeLevel: z.number().int().nonnegative().optional(),
  creditHours: z.number().int().nonnegative().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  notes: z.string().optional(),
};

export const Subject = db.createCollection("subjects", subjectSchema);

