import { VodType } from "./vod-type";
import { ParseResult, VodCheck } from "./types";

export class VodBoolean extends VodType<boolean> {
    protected _parseValue(value: unknown, path: (string | number)[]): ParseResult<boolean> {
        if (typeof value !== "boolean") {
            return this._fail(path, "Expected boolean");
        }
        return { success: true, data: value };
    }

    protected _runCheck(data: boolean, check: VodCheck<boolean>, path: (string | number)[]) {
        switch (check.opr) {
            case "istrue":
                if (data !== true) return this._fail(path, check.msg);
                break;
            case "isfalse":
                if (data !== false) return this._fail(path, check.msg);
                break;
            case "refinement":
                if (!check.fn(data as never)) return this._fail(path, check.msg);
                break;
            default:
                break;
        }
        return null;
    }

    // checkers
    isTrue(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "istrue",
            msg: msg || "Must be true"
        });
        
    }

    isFalse(msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "isfalse",
            msg: msg || "Must be false"
        });
        
    } 

    // transforms
    toNumber(){
        return this.transform(val => Number(val));
    }

    asString(){
        return this.transform(val => `${val}`);
    }
}
