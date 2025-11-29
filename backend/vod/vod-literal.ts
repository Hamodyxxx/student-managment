import { VodType } from "./vod-type";
import { ParseResult } from "./types";
import { VodError } from "./vod-error";

export class VodLiteral<T extends string | number | boolean> extends VodType<T> {
    constructor(private value: T) {
        super();
    }

    protected _parseValue(input: unknown, path: (string | number)[] = []): ParseResult<T> {
        if (input === this.value) {
            return { success: true, data: this.value };
        }
        return { 
            success: false, 
            error: new VodError([{ path, message: `Expected literal ${this.value}` }])
        };
    }
}
