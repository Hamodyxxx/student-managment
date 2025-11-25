import { VodType } from "./vod-type";
import { ParseResult, SchemaMap } from "./types";
import { VodError } from "./vod-error";
import { VodOptional } from "./vod-optional";


export class VodObject<const T extends SchemaMap> extends VodType<{ [K in keyof T]: T[K]["_output"] }> {
    constructor(public shape: T) {
        super();
    }

    protected _parseValue(value: unknown, path: (string | number)[] = []): ParseResult<{ [K in keyof T]: T[K]["_output"] }> {
        if (typeof value !== "object" || value === null) {
            return { success: false, error: new VodError([{ path, message: "Expected object" }]) };
        }

        const result: any = {};
        for (const key in this.shape) {
            const schema = this.shape[key];
            const parsed = schema.safeParse((value as any)[key]);
            if (!parsed.success) {
                return { 
                    success: false, 
                    error: new VodError([{ path: [...path, key, ...parsed.error.issues[0].path], message: parsed.error.issues[0].message }])
                };
            }
            result[key] = parsed.data;
        }

        return { success: true, data: result };
    }

    // mutations
    partial(): VodObject<{ [K in keyof T]: VodType<T[K]["_output"]> }> {
        const newShape: any = {};
        for (const key in this.shape) {
            newShape[key] = new VodOptional(this.shape[key]);
        }
        return new VodObject(newShape);
    }
    
    pick<Keys extends keyof T>(keys: Keys[]): VodObject<Pick<T, Keys>> {
        const newShape: any = {};
        for (const key of keys) {
            if (key in this.shape) newShape[key] = this.shape[key];
        }
        return new VodObject(newShape);
    }

    omit<Keys extends keyof T>(keys: Keys[]): VodObject<Omit<T, Keys>> {
        const newShape: any = {};
        for (const key in this.shape) {
            if (!keys.includes(key as any)) newShape[key] = this.shape[key];
        }
        return new VodObject(newShape);
    }

    defaults(defaults: Partial<{ [K in keyof T]: T[K]["_output"] }>): VodObject<T> {
        const base = this;
        const newShape: any = {};
        for (const key in this.shape) {
            const schema = this.shape[key];
            const defaultValue = defaults[key as keyof T];
            if (defaultValue !== undefined) {
                newShape[key] = (schema as any).default(defaultValue);
            } else {
                newShape[key] = schema;
            }
        }
        return new VodObject(newShape);
    }
}