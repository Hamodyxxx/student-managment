import { z } from "zod";
import { db } from "../config/db/db";

const inventorySchema = {
  itemName: z.string(), 
  itemType: z.enum(["Book", "Supply", "Equipment", "Uniform", "Other"]), 
  description: z.string().optional(),
  quantity: z.number().int().nonnegative(),
  location: z.string().optional(),
  condition: z.enum(["New", "Good", "Fair", "Poor"]).optional(),
  lastAudited: z.date().optional(),
  minRequired: z.number().int().nonnegative().optional(),
  assignedTo: z.string().optional(),
};

export const Inventory = db.createCollection("inventory", inventorySchema);