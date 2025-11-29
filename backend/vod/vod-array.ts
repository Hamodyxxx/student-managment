import { VodType } from "./vod-type";
import { GetVodOutputType, ParseResult, VodCheck } from "./types";
import { VodError } from "./vod-error";
import { VodTransformer } from "./vod-transformer";
import { VodString } from "./vod-string";

export class VodArray<T extends VodType<any>, ET = GetVodOutputType<T>> extends VodType<ET[]> {
    constructor(private itemSchema: T) {
        super();
    }

    protected _parseValue(value: unknown): ParseResult<ET[]> {
        if (!Array.isArray(value)) {
            return { success: false, error: new VodError([{ path: [], message: "Expected array" }]) };
        }

        const result: ET[] = [];
        for (let i = 0; i < value.length; i++) {
            const parsed = this.itemSchema.safeParse(value[i]);
            if (!parsed.success) {
                return {
                    success: false,
                    error: new VodError([{
                        path: [i, ...parsed.error.issues[0].path],
                        message: parsed.error.issues[0].message
                    }])
                };
            }
            result.push(parsed.data);
        }

        return { success: true, data: result };
    }

    protected _runCheck(data: ET[], check: VodCheck<ET[]>, path: (string | number)[]) {
        switch (check.opr) {

            case "refinement":
                if (!check.fn(data))
                    return this._fail(path, check.msg);
                break;

            case "min":
                if (data.length < check.min)
                    return this._fail(path, check.msg);
                break;

            case "max":
                if (data.length > check.max)
                    return this._fail(path, check.msg);
                break;

            case "exact":
                if (data.length !== check.value)
                    return this._fail(path, check.msg);
                break;

            case "unique":
                if (new Set(data).size !== data.length)
                    return this._fail(path, check.msg);
                break;

            case "nonempty":
                if (data.length === 0)
                    return this._fail(path, check.msg);
                break;

            case "every":
                for (const item of data) {
                    if (!check.fn(item as any))
                        return this._fail(path, check.msg);
                }
                break;

            case "includes":
                if (typeof check.value === "function") {
                    const fn = check.value as any as ((val: ET) => boolean);
                    const found = data.some(item => fn(item));
                    if (!found) return this._fail(path, check.msg);
                } else {
                    if (!data.includes(check.value as any))
                        return this._fail(path, check.msg);
                }
                break;
        }

        return null;
    }

    // checkers

    min(length: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "min",
            min: length,
            msg: msg || `Array must have at least ${length} items`
        });
        
    }

    max(length: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "max",
            max: length,
            msg: msg || `Array must have at most ${length} items`
        });
        
    }

    exact(length: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "exact",
            value: length,
            msg: msg || `Array must have exactly ${length} items`
        });
        
    }

    unique(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "unique",
            msg: msg || `Array items must be unique`
        });
        
    }

    nonempty(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "nonempty",
            msg: msg || `Array cannot be empty`
        });
        
    }

    every(checkFn: (item: ET) => boolean, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "every",
            fn: checkFn,
            msg: msg || `Array item validation failed`
        });
    }

    includes(valueOrFn: ET | ((item: ET) => boolean), msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "includes",
            value: valueOrFn as any,
            msg: msg || `Array does not include required value`
        });
        
    }

    // transforms
    map(fn: (item: ET, index: number, arr: ET[]) => ET) {
        return this.addTransform(arr => arr.map(fn));
    }

    filter(fn: (item: ET, index: number, arr: ET[]) => boolean) {
        return this.addTransform(arr => arr.filter(fn));
    }

    sort(fn?: (a: ET, b: ET) => number) {
        return this.addTransform(arr => [...arr].sort(fn));
    }

    toUnique() {
        return this.addTransform(arr => Array.from(new Set(arr)));
    }

    asSet() {
        return this.transform(arr => new Set(arr));
    }

    join(separator: string) {
        return this.transform(arr => arr.join(separator));
    }

    flatten(depth = 1) {
        return this.transform(arr => arr.flat(depth));
    }

}
