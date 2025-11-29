import { z } from "zod";
import { InMemoryStrategy } from "./strategies/memory.strategy";
import { Collection } from "./collection";
import { DBEntry, FindArgs, InsertArgs, UpdateArgs, DeleteArgs, RelationsShape, Where } from "./types/types";
import { FileStrategy } from "./strategies/file.strategy";
import { DBStrategy } from "./types/DBStrategy";

export class Database {
  private strategy: DBStrategy;
  private collections: Record<string, Collection<any, any, any, any>> = {};

  constructor(strategy: DBStrategy = new InMemoryStrategy()) {
    this.strategy = strategy;
  }

  setStrategy(strategy: DBStrategy) {
    this.strategy = strategy;
  }

  private async load<T>(collection: string): Promise<T[]> {
    return await this.strategy.read<T>(collection);
  }

  private async save<T>(collection: string, data: T[]): Promise<void> {
    await this.strategy.write<T>(collection, data);
  }

  private matchesWhere<T extends {}>(item: T, where?: Where<DBEntry<T>>): boolean {
    if (!where) return true;
    return Object.entries(where).every(([key, cond]) => {
      const value = (item as any)[key];

      if (key === "AND") return (cond as any[]).every((c) => this.matchesWhere(item, c));
      if (key === "OR") return (cond as any[]).some((c) => this.matchesWhere(item, c));
      if (key === "NOT") return !(cond as any[]).some((c) => this.matchesWhere(item, c));

      if (typeof cond !== "object" || Array.isArray(cond)) return value === cond;

      if ((cond as any).equals) return value === (cond as any).equals;
      if ((cond as any).in) return (cond as any).in.includes(value);
      if ((cond as any).not) return !this.matchesWhere(item, { [key]: (cond as any).not } as any);
      if ((cond as any).notIn) return !(cond as any).notIn.includes(value);

      if (typeof value === "string") {
        if ((cond as any).contains) return value.includes((cond as any).contains);
        if ((cond as any).startsWith) return value.startsWith((cond as any).startsWith);
        if ((cond as any).endsWith) return value.endsWith((cond as any).endsWith);
      }

      if (typeof value === "number") {
        if ((cond as any).lt !== undefined) return value < (cond as any).lt;
        if ((cond as any).lte !== undefined) return value <= (cond as any).lte;
        if ((cond as any).gt !== undefined) return value > (cond as any).gt;
        if ((cond as any).gte !== undefined) return value >= (cond as any).gte;
      }

      if (Array.isArray(value)) {
        if ((cond as any).arrayContains !== undefined) return value.includes((cond as any).arrayContains);
        if ((cond as any).arrayHasSome !== undefined) return value.some((v: any) => (cond as any).arrayHasSome.includes(v));
        if ((cond as any).arrayHasEvery !== undefined) return (cond as any).arrayHasEvery.every((v: any) => value.includes(v));
      }

      if (typeof value === "object" && value !== null) {
        return this.matchesWhere(value, cond);
      }

      return true;
    });
  }

  private applySelect<T extends {}>(item: T, select?: Partial<Record<keyof T, boolean>>): Partial<T> | T {
    if (!select) return item;
    const out: Partial<T> = {};
    for (const k of Object.keys(select) as (keyof T)[]) {
      if (select[k]) out[k] = item[k];
    }
    return out;
  }

  async insert<T extends {}>(collection: string, args: InsertArgs<T>): Promise<DBEntry<T>> {
    const all = await this.load<DBEntry<T>>(collection);
    const entry: DBEntry<T> = {
      ...(args.data as any),
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    all.push(entry);
    await this.save(collection, all);
    return entry;
  }

  async insertMany<T extends {}>(collection: string, args: { data: T[] }): Promise<DBEntry<T>[]> {
    const all = await this.load<DBEntry<T>>(collection);
    const entries = args.data.map(d => ({
      ...(d as any),
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as DBEntry<T>[];
    all.push(...entries);
    await this.save(collection, all);
    return entries;
  }

  async findOne<T extends {}>(collection: string, args: FindArgs<T>): Promise<Partial<DBEntry<T>> | null> {
    const all = await this.load<DBEntry<T>>(collection);
    const found = all.find(item => this.matchesWhere(item, args.where));
    return found ? (this.applySelect(found, args.select) as Partial<DBEntry<T>>) : null;
  }

  async findMany<T extends {}>(collection: string, args: FindArgs<T>): Promise<Partial<DBEntry<T>>[]> {
    const all = await this.load<DBEntry<T>>(collection);
    let filtered = all.filter(item => this.matchesWhere(item, args.where));

    if (args.orderBy) {
      const orderFields = Object.entries(args.orderBy) as [keyof DBEntry<T>, "asc" | "desc"][];
      filtered.sort((a, b) => {
        for (const [field, direction] of orderFields) {
          const av = a[field];
          const bv = b[field];
          if (av == null && bv == null) continue;
          if (av == null) return direction === "asc" ? 1 : -1;
          if (bv == null) return direction === "asc" ? -1 : 1;
          if (av < bv) return direction === "asc" ? -1 : 1;
          if (av > bv) return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    let skip = typeof args.skip === "number" && args.skip > 0 ? args.skip : 0;
    let limit = typeof args.limit === "number" && args.limit >= 0 ? args.limit : undefined;

    if (skip > 0 || limit !== undefined) {
      filtered = filtered.slice(skip, limit !== undefined ? skip + limit : undefined);
    }
    

    return filtered.map(item => this.applySelect(item, args.select) as Partial<DBEntry<T>>);
  }

  async updateOne<T extends {}>(collection: string, args: UpdateArgs<T>): Promise<DBEntry<T> | null> {
    const all = await this.load<DBEntry<T>>(collection);
    const idx = all.findIndex(item => this.matchesWhere(item, args.where));
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...(args.data as any), updatedAt: new Date() } as DBEntry<T>;
    await this.save(collection, all);
    return all[idx];
  }

  async updateMany<T extends {}>(collection: string, args: UpdateArgs<T>): Promise<number> {
    const all = await this.load<DBEntry<T>>(collection);
    let count = 0;
    const updated = all.map(item => {
      if (this.matchesWhere(item, args.where)) {
        count++;
        return { ...item, ...(args.data as any), updatedAt: new Date() } as DBEntry<T>;
      }
      return item;
    });
    await this.save(collection, updated);
    return count;
  }

  async deleteOne<T extends {}>(collection: string, args: DeleteArgs<T>): Promise<boolean> {
    const all = await this.load<DBEntry<T>>(collection);
    const idx = all.findIndex(item => this.matchesWhere(item, args.where));
    if (idx === -1) return false;
    all.splice(idx, 1);
    await this.save(collection, all);
    return true;
  }

  async deleteMany<T extends {}>(collection: string, args: DeleteArgs<T>): Promise<number> {
    const all = await this.load<DBEntry<T>>(collection);
    const remaining = all.filter(item => !this.matchesWhere(item, args.where));
    const removed = all.length - remaining.length;
    await this.save(collection, remaining);
    return removed;
  }


  createCollection<
    Name extends string,
    Shape extends z.ZodRawShape,
    R extends RelationsShape = {}
  >(
    name: Name,
    shape: Shape,
    relations?: R
  ): Collection<Shape, z.ZodObject<Shape>, z.infer<z.ZodObject<Shape>>, R> {
    const coll = new Collection<Shape, z.ZodObject<Shape>, z.infer<z.ZodObject<Shape>>, R>(this, name, shape, relations);
    this.collections[name] = coll;
    return coll;
  }

  getCollection<
    Shape extends z.ZodRawShape = any,
    T extends {} = any,
    R extends RelationsShape = {}
  >(name: string): Collection<Shape, z.ZodObject<Shape>, T, R> {
    return this.collections[name] as Collection<Shape, z.ZodObject<Shape>, T, R>;
  }
}
