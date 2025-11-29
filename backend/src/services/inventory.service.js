import { Inventory } from "../models/inventory.model.js";

export class InventoryService {
  constructor() {
    this.coll = Inventory;
  }

  async create({
    itemName,
    itemType,
    description,
    quantity,
    location,
    condition,
    lastAudited,
    minRequired,
    assignedTo
  }) {
    return this.coll.insertOne({
      data: {
        itemName,
        itemType,
        description,
        quantity,
        location,
        condition,
        lastAudited,
        minRequired,
        assignedTo
      }
    });
  }

  async findOneById(id, include) {
    return this.coll.findOne({
      where: { id },
      include,
    });
  }

  async findMany({ where = {}, include, orderBy, limit, skip } = {}) {
    return this.coll.findMany({
      where,
      include,
      orderBy,
      limit,
      skip
    });
  }

  async update(id, {
    itemName,
    itemType,
    description,
    quantity,
    location,
    condition,
    lastAudited,
    minRequired,
    assignedTo
  }) {
    return this.coll.updateOne({
      where: { id },
      data: {
        itemName,
        itemType,
        description,
        quantity,
        location,
        condition,
        lastAudited,
        minRequired,
        assignedTo
      }
    });
  }

  async deleteOneById(id) {
    return this.coll.deleteOne({
      where: { id },
    });
  }
}
