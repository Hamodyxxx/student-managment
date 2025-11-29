import { GetVodOutputType, ParseResult, VodCheck } from "./types";
import { VodType } from "./vod-type";

export class VodSet<T extends VodType<any>, ET = GetVodOutputType<T>> extends VodType<Set<ET>> {
    constructor(private valueSchema: T) {
        super();
    }

    protected _parseValue(value: unknown, path: (string | number)[] = []): ParseResult<Set<ET>> {
        let set: Set<ET>;

        if (value instanceof Set) {
            set = value;
        } else {
            return this._fail(path, "Expected Set");
        }

        const result = new Set<ET>();
        for (const val of set.values()) {
            const parsedVal = this.valueSchema.safeParse(val);
            if (!parsedVal.success) return this._fail(
                path,
                parsedVal.error.issues[0].message
            )
            result.add(parsedVal.data);
        }

        return { success: true, data: result };
    }

    protected _runSetCheck(set: Set<ET>, check: VodCheck<Set<ET>>, path: (string | number)[]): ParseResult<Set<ET>> | null {
        switch (check.opr) {
            case "min":
                if (set.size < check.min) {
                    return this._fail(path, check.msg || `Set must have at least ${check.min} entries`);
                }
                break;
            case "max":
                if (set.size > check.max) {
                    return this._fail(path, check.msg || `Set must have at most ${check.max} entries`);
                }
                break;
            case "nonempty":
                if (set.size === 0) {
                    return this._fail(path, check.msg || "Set cannot be empty");
                }
                break;
            case "refinement":
                if (typeof check.fn === "function" && !check.fn(set)) {
                    return this._fail(path, check.msg || "Set refinement failed");
                }
                break;
            default:
                break;
        }
        return null;
    }


    // checkers
    min(min: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "min",
            min,
            msg: msg || `Set must have at least ${min} entries`
        })
    }

    max(max: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "max",
            max,
            msg: msg || `Set must have at most ${max} entries`
        })
    }

    nonempty(msg?: string) {
        return this.addCheck({ 
            kind: "check", 
            opr: "nonempty", 
            msg: msg || "Set cannot be empty" 
        });
    }

    has(value: ET, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "refinement",
            msg: msg || `Set must contain value ${value}`,
            fn: s => s.has(value)
        });
    }

    // transformers
    map(fn: (value: ET) => ET) {
        return this.addTransform(set => new Set([...set].map(fn)));
    }

    filter(fn: (value: ET) => boolean) {
        return this.addTransform(set => new Set([...set].filter(fn)));
    }

    union(other: Set<ET>) {
        return this.addTransform(s => new Set([...s, ...other]));
    }

    intersection(other: Set<ET>) {
        return this.addTransform(s => new Set([...s].filter(x => other.has(x))));
    }

    difference(other: Set<ET>) {
        return this.addTransform(s => new Set([...s].filter(x => !other.has(x))));
    }

    toArray(){
        return this.transform(v => [...v]);
    }
}
