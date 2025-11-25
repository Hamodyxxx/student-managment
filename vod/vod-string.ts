import { VodType } from "./vod-type";
import { ParseResult, VodCheck } from "./types";

export class VodString extends VodType<string> {

    protected _parseValue(value: unknown, path: (string | number)[]): ParseResult<string> {
        if (typeof value !== "string") return this._fail(path, "Expected string");
        
        return { success: true, data: value };
    }

    protected _runCheck(data: string, check: VodCheck<string>, path: (string | number)[]) {
        switch (check.opr) {
            case "min":
                if (data.length < check.min) {
                    return this._fail(path, check.msg);
                }
                break;
            case "max":
                if (data.length > check.max) {
                    return this._fail(path, check.msg);
                }
                break;
            case "nonempty":
                if (data.length === 0) {
                    return this._fail(path, check.msg);
                }
                break;
            case "includes":
                if (!data.includes(check.value)) {
                    return this._fail(path, check.msg);
                }
                break;
            case "refinement":
                if (!check.fn(data)) {
                    return this._fail(path, check.msg);
                }
                break;
            default:
                break;
        }
        return null;
    }

    // checkers
    min(len: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "min",
            min: len,
            msg: msg || `Must be >= ${len} chars`
        });
    }

    max(len: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "max",
            max: len,
            msg: msg || `Must be <= ${len} chars`
        });
    }

    length(len: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "refinement",
            fn: v => v.length === len,
            msg: msg || `Must be = ${len} chars`
        });
        
    }

    regex(pattern: RegExp, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "refinement",
            fn: v => pattern.test(v),
            msg: msg || `Invalid format`
        });
        
    }

    nonempty(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "nonempty",
            msg: msg || "Cannot be empty"
        });
        
    }

    includes(s: string, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "includes",
            value: s,
            msg: msg || `Must include "${s}"`
        });
        
    }

    startsWith(s: string, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "startswith",
            value: s,
            msg: msg || `Must start with "${s}"`
        });
    }

    endsWith(s: string, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "endswith",
            value: s,
            msg: msg || `Must end with "${s}"`
        });
    }

    // transforms
    trim() {
        return this.addTransform(v => v.trim());
    }

    toLowerCase() {
        return this.addTransform(v => v.toLowerCase());
    }

    toUpperCase() {
        return this.addTransform(v => v.toUpperCase());
    }

    replace(searchValue: string | RegExp, replaceValue: string) {
        return this.addTransform(s => s.replace(searchValue, replaceValue));
    }

    strip(chars: string) {
        const pattern = new RegExp(`[${chars}]`, "g");
        return this.addTransform(s => s.replace(pattern, ""));
    }

    split(pattern: string | RegExp){
        return this.transform(s => s.split(pattern));
    }
}   
