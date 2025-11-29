import { VodType } from "./vod-type";
import { ParseResult, VodCheck } from "./types";

export class VodNumber extends VodType<number> {

    protected _parseValue(value: unknown, path: (string | number)[]): ParseResult<number> {
        if (typeof value !== "number" || Number.isNaN(value)) {
            return this._fail(path, "Expected number");
        }

        return { success: true, data: value };
    }

    protected _runCheck(data: number, check: VodCheck<number>, path: (string | number)[]) {
        switch (check.opr) {
            case "min":
                if (check.min <= data) {
                    return this._fail(path, check.msg);
                }
                break;
            case "max":
                if (check.max >= data) {
                    return this._fail(path, check.msg);
                }
                break;
            case "positive":
                if (!(data > 0)) {
                    return this._fail(path, check.msg);
                }
                break;
            case "negative":
                if (!(data < 0)) {
                    return this._fail(path, check.msg);
                }
                break;
            case "nonnegative":
                if (data < 0) {
                    return this._fail(path, check.msg);
                }
                break;
            case "nonpositive":
                if (data > 0) {
                    return this._fail(path, check.msg);
                }
                break;
            case "finite":
                if (!Number.isFinite(data)) {
                    return this._fail(path, check.msg);
                }
                break;
            case "multipleof": 
                const EPS = 1e-10; 
                if (Math.abs(data % check.base) > EPS) {
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

    // Checkers
    min(n: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "min",
            min: n,
            msg: msg || `Must be >= ${n}`,
        });
        
    }

    max(n: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "max",
            max: n,
            msg: msg || `Must be <= ${n}`,
        });
        
    }

    int(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "refinement",
            fn: (v: number) => Number.isInteger(v),
            msg: msg || "Must be an integer",
        });
        
    }

    multipleOf(value: number, msg?:string){
        return this.addCheck({
            kind: "check",
            opr: "multipleof",
            base: value,
            msg: msg || `value must be multiple of ${value}`
        })
    }

    positive(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "positive",
            msg: msg || "Must be positive",
        });
        
    }

    negative(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "negative",
            msg: msg || "Must be negative",
        });
        
    }

    nonnegative(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "nonnegative",
            msg: msg || "Must be >= 0",
        });
        
    }

    nonpositive(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "nonpositive",
            msg: msg || "Must be <= 0",
        });
        
    }

    finite(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "finite",
            msg: msg || "Must be a finite number",
        });
        
    }

    // transformers
    toInt() {
        return this.addTransform(n => Math.trunc(n));
    }
    
    round() {
        return this.addTransform(n => Math.round(n));
    }

    floor() {
        return this.addTransform(n => Math.floor(n));
    }

    ceil() {
        return this.addTransform(n => Math.ceil(n));
    }

    abs() {
        return this.addTransform(n => Math.abs(n));
    }

    clamp(min: number, max: number) {
        return this.addTransform(n => Math.min(Math.max(n, min), max));
    }
}
