import { z } from "zod";
import { db } from "../config/db/db";
import { belongsTo } from "../lib/db/realations";
import { User } from "./user.model.js";

const parentSchema = {
  userId: z.string().optional(),
  name: z.string(),
  phone: z.string().min(8).max(20),
  email: z.string().email(),
  address: z.string().optional(),
  job: z.string().optional(),
  relation: z.enum(["Father", "Mother", "Guardian"]).default("Guardian"),
  createdAt: z.date().optional(),
};

export const Parents = db.createCollection("parents", parentSchema, {
  user: belongsTo("users", User.schema, "userId", "id"),
});

