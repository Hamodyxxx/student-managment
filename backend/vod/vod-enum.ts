import { VodType } from "./vod-type";
import { ParseResult } from "./types";
import { VodError } from "./vod-error";

export class VodEnum<const T extends readonly (string | number | boolean)[]> extends VodType<T[number]> {
    private values: T;

    constructor(values: T) {
        super();
        if (!values || values.length === 0) {
            throw new Error("VodEnum requires at least one value");
        }
        this.values = values;
    }

    protected _parseValue(value: unknown, path: (string | number)[] = []): ParseResult<T[number]> {
        if (!this.values.includes(value as T[number]))  return {
            success: false,
            error: new VodError([{ path, message: `Value must be one of: ${this.values.join(", ")}` }])
        };

        return {
            success: true,
            data: value as T[number],
        }
    }
    
}