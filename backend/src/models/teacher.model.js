import { z } from "zod";
import { db } from "../config/db/db";
import { hasMany, belongsTo } from "../lib/db/realations"; 
import { Classes } from './classes.model.js';
import { Subject } from "./subject.model.js";
import { User } from "./user.model.js";

const teacherSchema = {
  userId: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  hiredAt: z.date().optional(),
  subjectIds: z.array(z.string()).optional(),
  classIds: z.array(z.string()).optional(),
};


export const Teacher = db.createCollection("teachers", teacherSchema, {
    user: belongsTo("users", User.schema, "userId", "id"),
    subjects: hasMany("subjects", Subject.schema, "subjectIds", "id"),
    classes: hasMany("classes", Classes.schema, "classIds", "id"),
});
