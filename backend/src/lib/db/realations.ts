import { z } from "zod";
import { RelationDescriptor } from "./types/types";
export function hasMany<
  TargetSchema extends z.ZodObject<any>,
  TargetName extends string,
  LocalKey extends string,
  ForeignKey extends string
>(
  targetName: TargetName,
  targetSchema: TargetSchema,
  localKey: LocalKey,
  foreignKey: ForeignKey
): RelationDescriptor<TargetSchema, TargetName, LocalKey, ForeignKey, "hasMany"> {
  return {
    kind: "hasMany",
    target: targetName,
    targetSchema,
    localKey,
    foreignKey,
  };
}

export function belongsTo<
  TargetSchema extends z.ZodObject<any>,
  TargetName extends string,
  LocalKey extends string,
  ForeignKey extends string
>(
  targetName: TargetName,
  targetSchema: TargetSchema,
  localKey: LocalKey,
  foreignKey: ForeignKey
): RelationDescriptor<TargetSchema, TargetName, LocalKey, ForeignKey, "belongsTo"> {
  return {
    kind: "belongsTo",
    target: targetName,
    targetSchema,
    localKey,
    foreignKey,
  };
}
