import { VodType } from "./vod-type";
import { GetVodOutputType, ParseResult } from "./types";
import { VodError } from "./vod-error";

export class VodRecord<
        K extends string | number | symbol,
        T extends VodType<any>,
        ET = GetVodOutputType<T>
    > 
extends VodType<Record<K, ET>> {
    private valueSchema: T;
    private keySchema?: VodType<K>;

    constructor(valueSchema: T);
    constructor(keySchema: VodType<K>, valueSchema: T);
    constructor(arg1: VodType<any>, arg2?: T) {
        super();
        if (arg2) {
            this.keySchema = arg1;
            this.valueSchema = arg2;
        } else {
            this.valueSchema = arg1 as T;
        }
    }

    protected _parseValue(value: unknown, path: (string | number)[] = []): ParseResult<Record<K, ET>> {
        if (typeof value !== "object" || value === null) {
            return { success: false, error: new VodError([{ path, message: "Expected object" }]) };
        }

        const result: Record<K, ET> = {} as Record<K, ET>;
        for (const key in value as object) {
            if (this.keySchema) {
                const parsedKey = this.keySchema.safeParse(key as unknown);
                if (!parsedKey.success) return {
                    success: false,
                    error: new VodError([{ path: [...path, key], message: "Invalid key type" }])
                };
                
            }

            const parsedValue = this.valueSchema.safeParse((value as any)[key]);
            if (!parsedValue.success) return {
                success: false,
                error: new VodError([{ path: [...path, key, ...parsedValue.error.issues[0].path], message: parsedValue.error.issues[0].message }])
            };

            result[key as K] = parsedValue.data;
        }

        return { success: true, data: result };
    }

    

    // mutations
    pick<Keys extends K[]>(keys: readonly [...Keys]): VodRecord<Keys[number], T> {
        const base = this;
        const newSchema = new VodRecord<Keys[number], T>(this.valueSchema);

        newSchema._parseValue = function(value: unknown, path: (string | number)[] = []) {
            const parsed = base._parseValue(value, path);
            if (!parsed.success) return parsed;

            const picked: Record<Keys[number], ET> = {} as any;
            for (const key of keys) {
                if (key in parsed.data) picked[key] = parsed.data[key];
            }
            return { success: true, data: picked  as Record<Keys[number], GetVodOutputType<T>> };
        };

        return newSchema;
    }

    omit<Keys extends K[]>(keys: readonly [...Keys]): VodRecord<Exclude<K, Keys[number]>, T> {
        const base = this;
        const newSchema = new VodRecord<Exclude<K, Keys[number]>, T>(this.valueSchema);

        newSchema._parseValue = function(value: unknown, path: (string | number)[] = []) {
            const parsed = base._parseValue(value, path);
            if (!parsed.success) return parsed;

            const omitted: Record<Exclude<K, Keys[number]>, ET> = {} as any;
            for (const key in parsed.data) {
                if (!keys.includes(key as any)) omitted[key as unknown as Exclude<K, Keys[number]>] = parsed.data[key];
            }

            return { success: true, data: omitted as Record<Exclude<K, Keys[number]>, GetVodOutputType<T>> };
        };

        return newSchema;
    }

    // checkers
    min(count: number, msg?: string) {
        return this.refine(obj => Object.keys(obj).length >= count, msg || `Must have at least ${count} keys`);
    }

    max(count: number, msg?: string) {
        return this.refine(
            obj => Object.keys(obj).length <= count, 
            msg || `Must have at most ${count} keys`
        );
    }

    nonempty(msg?: string) {
        return this.refine(obj => Object.keys(obj).length > 0, msg || "Record cannot be empty");
    }
}
