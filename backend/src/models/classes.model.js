import { z } from "zod";
import { db } from "../config/db/db";
import { belongsTo } from "../lib/db/realations";
import { Teacher } from "./teacher.model.js";

const classesSchema = {
  className: z.string(),
  gradeLevel: z.number().int().nonnegative(),
  homeroomTeacherId: z.string().optional(),
  capacity: z.number().int().nonnegative(),
  roomNumber: z.string().optional(),
  description: z.string().optional(),
};

export const Classes = db.createCollection("classes", classesSchema);

