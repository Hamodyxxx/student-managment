import { z } from "zod";

export type DBEntry<T extends {}> = T & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RelationDescriptor<
  TargetSchema extends z.ZodObject<any>,
  TargetName extends string,
  LocalKey extends string,
  ForeignKey extends string,
  Kind extends "hasMany" | "belongsTo"
> = {
  kind: Kind;
  target: TargetName;
  targetSchema: TargetSchema;
  localKey: LocalKey;
  foreignKey: ForeignKey;
};

export type RelationsShape = Record<string, RelationDescriptor<any, string, string, string, any>>;

export type Include<R extends RelationsShape> = {
  [K in keyof R]?: boolean;
};

export type Select<T> = Partial<Record<keyof T, boolean>>;


export type Primitive = string | number | boolean | Date | null | undefined;

export type WhereField<T> =
  | T
  | {
      equals?: T;
      in?: T[];
      not?: WhereField<T>;
      // string ops
      contains?: T extends string ? string : never;
      startsWith?: T extends string ? string : never;
      endsWith?: T extends string ? string : never;
      // number / date
      gt?: T extends number | Date ? T : never;
      gte?: T extends number | Date ? T : never;
      lt?: T extends number | Date ? T : never;
      lte?: T extends number | Date ? T : never;
      // arrays
      arrayContains?: T extends Array<infer U> ? U : never;
      arrayHasSome?: T extends Array<infer U> ? U[] : never;
      arrayHasEvery?: T extends Array<infer U> ? U[] : never;
    }
  | Where<T>;

export type Where<T> = {
  [K in keyof T]?: WhereField<T[K]>;
} & {
  AND?: Where<T>[];
  OR?: Where<T>[];
  NOT?: Where<T>[];
};

export interface InsertArgs<T> {
  data: T;
}

export interface FindArgs<T extends {}> {
  where?: Where<DBEntry<T>>;
  select?: Select<DBEntry<T>>;
}

export interface UpdateArgs<T extends {}> {
  where: Where<DBEntry<T>>;
  data: Partial<T>;
}

export interface DeleteArgs<T extends {}> {
  where: Where<DBEntry<T>>;
}
