import { SchemaMap } from "./types";
import { VodArray } from "./vod-array";
import { VodBoolean } from "./vod-bool";
import { VodArrayCoerce, VodBooleanCoerce, VodDateCoerce, VodMapCoerce, VodNumberCoerce, VodSetCoerce, VodStringCoerce } from "./vod-coerced";
import { VodDate } from "./vod-date";
import { VodEnum } from "./vod-enum";
import { VodLiteral } from "./vod-literal";
import { VodMap } from "./vod-map";
import { VodNullable } from "./vod-nullable";
import { VodNumber } from "./vod-number";
import { VodObject } from "./vod-object";
import { VodOptional } from "./vod-optional";
import { VodRecord } from "./vod-record";
import { VodSet } from "./vod-set";
import { VodString } from "./vod-string";
import { VodTransformer } from "./vod-transformer";
import { VodType } from "./vod-type";
import { VodUnion } from "./vod-union";

function record<T extends VodType<any>>(valueSchema: T): VodRecord<string | number | symbol, T>;
function record<K extends string | number | symbol, T extends VodType<any>>(keySchema: VodType<K>, valueSchema: T): VodRecord<K, T>;
function record<K extends string | number | symbol, T extends VodType<any>>(
    arg1: VodType<any>,
    arg2?: VodType<T>
): VodRecord<K, T> {
    if (arg2) {
        return new VodRecord(arg1, arg2) as VodRecord<K, T>;
    } else {
        return new VodRecord(arg1 as VodType<T>) as unknown as VodRecord<K, T>;
    }
}

export const v = {
    string: () => new VodString(),
    bool: () => new VodBoolean() as VodBoolean,
    number: () => new VodNumber(),
    date: () => new VodDate(),
    literal: (value: any) => new VodLiteral(value),
    transformer: <T, R>(fn: (value: T) => R) => new VodTransformer(fn),
    union: <T extends VodType<any>[]>(...schemas: T) => new VodUnion<T>(...schemas),
    nullable: <T>(inner: VodType<T>) => new VodNullable(inner),
    optional: <T>(inner: VodType<T>) => new VodOptional(inner),
    enum: <const T extends readonly (string | number | boolean)[]>(values: T) => new VodEnum(values),
    array: <T extends VodType<any>>(itemSchema: T) => new VodArray(itemSchema),
    set: <T extends VodType<any>>(itemSchema: T) => new VodSet(itemSchema),
    record: record,
    map: <K extends VodType<any>, T extends VodType<any>>(keySchema: K,valueSchema: T) => new VodMap(keySchema, valueSchema),
    object: <T extends SchemaMap>(shape: T) => new VodObject(shape),
    coerce: {
        string: () => new VodStringCoerce(),
        bool: () => new VodBooleanCoerce(),
        number: () => new VodNumberCoerce(),
        date: () => new VodDateCoerce(),
        map: <K extends VodType<any>, T extends VodType<any>>(keySchema: K,valueSchema: T) => new VodMapCoerce(keySchema, valueSchema),
        set: <T extends VodType<any>>(itemSchema: T) => new VodSetCoerce(itemSchema),
        array: <T extends VodType<any>>(itemSchema: T) => new VodArrayCoerce(itemSchema),
    },
};