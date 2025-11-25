import { Inventory } from "../models/inventory.model.js";
import { z } from "zod";
import { Where } from "../lib/db/types/types";

type InventoryInput = z.infer<typeof Inventory.schema>;
type InventoryUpdate = z.infer<typeof Inventory.updateSchema>;
type InventoryEntry = typeof Inventory extends { schema: z.ZodObject<any> }
  ? z.infer<(typeof Inventory)["schema"]> & { id: string }
  : unknown;

class InventoryService {
  async createItem(item: InventoryInput): Promise<InventoryEntry> {
    const created = await Inventory.insertOne({ data: item });
    return created as InventoryEntry;
  }

  async getItem(where: Where<InventoryEntry>): Promise<InventoryEntry | null> {
    const result = await Inventory.findOne({ where });
    return result as InventoryEntry | null;
  }

  async getAllItems(filter: Where<InventoryEntry> = {}): Promise<InventoryEntry[]> {
    const results = await Inventory.findMany({ where: filter });
    return results as InventoryEntry[];
  }

  async updateItem(where: Where<InventoryEntry>, data: InventoryUpdate): Promise<InventoryEntry | null> {
    const updated = await Inventory.updateOne({ where, data });
    return updated as InventoryEntry | null;
  }

  async deleteItem(where: Where<InventoryEntry>): Promise<boolean> {
    const deleted = await Inventory.deleteOne({ where });
    return deleted;
  }

  async deleteManyItems(where: Where<InventoryEntry>): Promise<number> {
    const count = await Inventory.deleteMany({ where });
    return count;
  }

  async count(filter: Where<InventoryEntry> = {}): Promise<number> {
    const items = await Inventory.findMany({ where: filter });
    return items.length;
  }
}

export { InventoryService };
