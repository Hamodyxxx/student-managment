import { z } from "zod";
import { db } from "../config/db/db";

const userSchema = {
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["admin", "teacher", "student", "parent"]),
  isActive: z.boolean().optional().default(true),
  lastLogin: z.date().optional(),
  emailVerified: z.boolean().optional().default(false),
};

export const User = db.createCollection("users", userSchema);

