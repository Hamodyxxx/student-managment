import { z } from "zod";
import { Database } from "./database";
import { DBEntry, InsertArgs, FindArgs, UpdateArgs, DeleteArgs, RelationsShape, Include } from "./types/types";
import { RelationDescriptor } from "./types/types";

type InferRelationResult<R extends RelationsShape, K extends keyof R> =
  R[K] extends RelationDescriptor<infer TS, infer TN, infer LK, infer FK, infer Kind>
    ? Kind extends "hasMany"
      ? Array<z.infer<TS>>
      : z.infer<TS>
    : never;

type WithIncluded<TBase, R extends RelationsShape, I extends Include<R> | undefined> =
  I extends undefined ? TBase :
  TBase & {
    [K in keyof I & keyof R]:
      I[K] extends true ? InferRelationResult<R, K> : never;
  };

export class Collection<
  Shape extends z.ZodRawShape,
  Schema extends z.ZodObject<Shape> = z.ZodObject<Shape>,
  T extends {} = z.infer<Schema>,
  R extends RelationsShape = {}
> {
  public schema: Schema;
  public updateSchema: ReturnType<Schema["partial"]>;
  public relations: R;

  constructor(private db: Database, private name: string, shape: Shape, relations?: R) {
    this.schema = z.object(shape) as Schema;
    this.updateSchema = this.schema.partial() as ReturnType<Schema["partial"]>;
    this.relations = (relations ?? ({} as R)) as R;
  }

  private parseInput(data: unknown): T {
    const parsed = this.schema.safeParse(data);
    if (!parsed.success) throw parsed.error;
    return parsed.data as T;
  }

  private parseUpdateInput(data: unknown): Partial<T> {
    const parsed = this.updateSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;
    return parsed.data as Partial<T>;
  }

  private async hydrate<U extends DBEntry<T>, I extends Include<R> | undefined>(item: U, include?: I): Promise<WithIncluded<U, R, I>> {
    if (!include) return item as any;
    const out: any = { ...item };

    for (const relKey of Object.keys(include) as (keyof I)[]) {
      if (!((include)[relKey])) continue;

      const rel = this.relations[relKey as string] as RelationDescriptor<any, any, any, any, any> | undefined;
      if (!rel) continue;

      const targetCollection = this.db.getCollection<any, any, any>(rel.target);

      if (rel.kind === "belongsTo") {
        const localVal = (item as any)[rel.localKey];
        const t = await targetCollection.findOne({ where: { [rel.foreignKey]: localVal } } as any);
        out[relKey] = t;
      } else {
        const localVal = (item as any)[rel.localKey];
        if (Array.isArray(localVal)) {
          out[relKey] = await targetCollection.findMany({ where: { [rel.foreignKey]: { in: localVal } } } as any);
        } else {
          out[relKey] = await targetCollection.findMany({ where: { [rel.foreignKey]: (item as any).id } } as any);
        }
      }
    }

    return out as WithIncluded<U, R, I>;
  }

  // CRUD wrappers

  insertOne(args: InsertArgs<T>): Promise<DBEntry<T>> {
    const payload = this.parseInput(args.data);
    return this.db.insert<T>(this.name, { data: payload });
  }

  insertMany(args: { data: T[] }): Promise<DBEntry<T>[]> {
    const payloads = args.data.map(d => this.parseInput(d));
    return this.db.insertMany<T>(this.name, { data: payloads });
  }

  async findOne<I extends Include<R> | undefined = undefined>(args: FindArgs<T> & { include?: I }): Promise<WithIncluded<Partial<DBEntry<T>>, R, I> | null> {
    const row = await this.db.findOne<T>(this.name, args);
    if (!row) return null;
    return this.hydrate(row as DBEntry<T>, args.include) as any;
  }

  async findMany<I extends Include<R> | undefined = undefined>(args: FindArgs<T> & { include?: I }): Promise<WithIncluded<Partial<DBEntry<T>>, R, I>[]> {
    const rows = await this.db.findMany<T>(this.name, args);
    return Promise.all(rows.map(r => this.hydrate(r as DBEntry<T>, args.include))) as any;
  }

  updateOne(args: UpdateArgs<T>): Promise<DBEntry<T> | null> {
    const data = this.parseUpdateInput(args.data);
    return this.db.updateOne<T>(this.name, { where: args.where, data } );
  }

  updateMany(args: UpdateArgs<T>): Promise<number> {
    const data = this.parseUpdateInput(args.data);
    return this.db.updateMany<T>(this.name, { where: args.where, data } );
  }

  deleteOne(args: DeleteArgs<T>): Promise<boolean> {
    return this.db.deleteOne<T>(this.name, args);
  }

  deleteMany(args: DeleteArgs<T>): Promise<number> {
    return this.db.deleteMany<T>(this.name, args);
  }


  addRelation<K extends string, Rel extends RelationDescriptor<any, string, string, string, any>>(key: K, relation: Rel): void {
    if (!this.relations) this.relations = {} as R;
    
    (this.relations as any)[key] = relation;
  }
}
