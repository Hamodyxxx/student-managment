import { z } from "zod";
import { db } from "../config/db/db";
import { belongsTo } from "../lib/db/realations";
import { User } from "./user.model.js";

const studentSchema = {
  userId: z.string().optional(),
  studentId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  grade: z.number().int().nonnegative(),
  section: z.string().optional(),
  age: z.number().int().nonnegative(),
  gender: z.enum(["Male", "Female"]),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  enrollmentDate: z.date().optional(),
  status: z.enum(["Active", "Graduated", "Dropped"]).optional(),
  notes: z.string().optional(),
};

export const Students = db.createCollection("students", studentSchema, {
  user: belongsTo("users", User.schema, "userId", "id"),
});

