import { VodType } from "./vod-type";
import { ParseResult } from "./types";

export class VodTransformer<T, R> extends VodType<R> {
    constructor(private transformFn: (value: T) => R) { super() }

    protected _parseValue(value: unknown, path: (string | number)[]): ParseResult<R> {
        try {
            const transformed = this.transformFn(value as T);
            return { success: true, data: transformed };
        } catch (err: any) {
            return this._fail(path, err?.message ?? "VodTransformer transform function failed");
        }
    }
}