import { Inventory } from "../models/inventory.model.js";

class InventoryService {
  async createItem(item) {
    const created = await Inventory.insertOne({ data: item });
    return created;
  }

  async getItem(where) {
    const result = await Inventory.findOne({ where });
    return result;
  }

  async getAllItems(filter = {}) {
    const results = await Inventory.findMany({ where: filter });
    return results;
  }

  async updateItem(where, data) {
    const updated = await Inventory.updateOne({ where, data });
    return updated;
  }

  async deleteItem(where) {
    const deleted = await Inventory.deleteOne({ where });
    return deleted;
  }

  async deleteManyItems(where){
    const count = await Inventory.deleteMany({ where });
    return count;
  }

  async count(filter = {}) {
    const items = await Inventory.findMany({ where: filter });
    return items.length;
  }
}

export { InventoryService };
