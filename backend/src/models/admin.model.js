import { z } from "zod";
import { db } from "../config/db/db";
import { belongsTo } from "../lib/db/realations";
import { User } from "./user.model.js";

const adminSchema = {
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  department: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  notes: z.string().optional(),
};

export const Admin = db.createCollection("admins", adminSchema, {
  user: belongsTo("users", User.schema, "userId", "id"),
});

