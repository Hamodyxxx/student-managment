import { VodType } from "./vod-type";
import { GetVodOutputType, ParseResult, VodCheck } from "./types";

export class VodMap<
        K extends VodType<any>, 
        V extends VodType<any>,
        EK = GetVodOutputType<K>,
        EV = GetVodOutputType<V>
    > 
    extends VodType<Map<EK, EV>> 
{
    constructor(private keySchema: K, private valueSchema: V) {
        super();
    }

    protected _parseValue(value: unknown, path: (string | number)[] = []): ParseResult<Map<EK, EV>> {
        let map: Map<EK, EV>;

        if (value instanceof Map) {
            map = value;
        } else {
            return this._fail(path, "Expected Map");
        }

        const result = new Map<EK, EV>();
        for (const [key, val] of map.entries()) {
            const parsedKey = this.keySchema.safeParse(key);
            if (!parsedKey.success) return this._fail([...path, `${key}`],  "Invalid key" );


            const parsedVal = this.valueSchema.safeParse(val);

            if (!parsedVal.success)return this._fail([...path, `${key}`],  parsedVal.error.issues[0].message );


            result.set(parsedKey.data, parsedVal.data);
        }

        return { success: true, data: result };
    }

    protected _runCheck(data: Map<EK, EV>, check: VodCheck<Map<EK, EV>>, path: (string | number)[]) {
        if (check.opr === "refinement") {
            if (!check.fn(data)) return this._fail(path, check.msg);
            return null;
        }

        switch (check.opr) {
            case "min": {
                const min = check.min;
                if (data.size < min)
                    return this._fail(path, check.msg || `Map must have at least ${min} entries`);
                break;
            }
            case "max": {
                const max = check.max;
                if (data.size > max)
                    return this._fail(path, check.msg || `Map must have no more than ${max} entries`);
                break;
            }
            case "nonempty": {
                if (data.size === 0)
                    return this._fail(path, check.msg || "Map must not be empty");
                break;
            }
            default:
                break;
        }

        return null;
    }

    // transformers
    mapKeys(fn: (key: EK) => EK) {
        return this.transform(map => {
            const newMap = new Map<EK, EV>();
            for (const [k, v] of map.entries()) newMap.set(fn(k), v);
            return newMap;
        });
    }

    mapValues(fn: (value: EV) => EV) {
        return this.transform(map => {
            const newMap = new Map<EK, EV>();
            for (const [k, v] of map.entries()) newMap.set(k, fn(v));
            return newMap;
        });
    }

    filter(fn: (key: EK, value: EV) => boolean) {
        return this.addTransform(map => {
            const newMap = new Map<EK, EV>();
            for (const [k, v] of map.entries()) if (fn(k, v)) newMap.set(k, v);
            return newMap;
        });
    }

    pickKeys(keys: EK[]) {
        return this.addTransform(m => {
            const result = new Map<EK, EV>();
            for (const k of keys) if (m.has(k)) result.set(k, m.get(k)!);
            return result;
        });
    }

    omitKeys(keys: EK[]) {
        return this.addTransform(m => {
            const result = new Map<EK, EV>();
            for (const [k, v] of m.entries()) if (!keys.includes(k)) result.set(k, v);
            return result;
        });
    }

    sort(compareFn?: (a: EK, b: EK) => number) {
        return this.addTransform(map => {
            const sorted = new Map<EK, EV>([...map.entries()].sort(([ka], [kb]) => compareFn ? compareFn(ka, kb) : 0));
            return sorted;
        });
    }

    merge(other: Map<EK, EV>) {
        return this.addTransform(m => new Map([...m, ...other]));
    }

    // checkers
    hasKey(key: EK, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "refinement",
            msg: msg || `Map must contain key ${key}`,
            fn: (m) => m.has(key)
        });
    }

    hasValue(value: EV, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "refinement",
            msg: msg || `Map must contain value ${value}`,
            fn: (m) => Array.from(m.values()).includes(value)
        });
    }

    min(min: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "min",
            min,
            msg: msg || `Map must have at least ${min} entries`
        })
    }

    max(max: number, msg?: string) {
        return this.addCheck({
            kind: "check",
            opr: "max",
            max,
            msg: msg || `Map must have at most ${max} entries`
        })
    }

    nonempty(msg?: string) {
        return this.addCheck({ 
            kind: "check", 
            opr: "nonempty", 
            msg: msg || "Map cannot be empty" 
        });
    }
}
