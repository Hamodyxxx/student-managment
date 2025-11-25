import { VodType } from "./vod-type";
import { ParseResult, VodCheck } from "./types";
import { VodError } from "./vod-error";

export class VodDate extends VodType<Date> {

    protected _parseValue(value: unknown, path: (string | number)[] = []): ParseResult<Date> {
        let d: Date | null = null;

        if (value instanceof Date) {
            d = value;
        } else {
            return this._fail(path, "Invalid date");
        }

        if (!d || isNaN(d.getTime())) {
            return this._fail(path, "Invalid date");
        }

        return { success: true, data: d };
    }

    protected _runCheck(data: Date, check: VodCheck<Date>, path: (string | number)[]) {
        if (check.opr === "refinement") {
            if (!check.fn(data)) return this._fail(path, check.msg);
            return null;
        }

        const t = data.getTime();

        switch (check.opr) {
            case "min": {
                const minDate = check.value;
                if (!(minDate instanceof Date) || isNaN(minDate.getTime())) {
                    return this._fail(path, check.msg || "Invalid minimum date");
                }
                if (t < minDate.getTime()) return this._fail(path, check.msg);
                break;
            }
            case "max": {
                const maxDate = check.value;
                if (!(maxDate instanceof Date) || isNaN(maxDate.getTime())) {
                    return this._fail(path, check.msg || "Invalid maximum date");
                }
                if (t > maxDate.getTime()) return this._fail(path, check.msg);
                break;
            }
            case "before": {
                const beforeDate = check.value;
                if (!(beforeDate instanceof Date) || isNaN(beforeDate.getTime())) {
                    return this._fail(path, check.msg || "Invalid date");
                }
                if (!(t < beforeDate.getTime())) return this._fail(path, check.msg);
                break;
            }
            case "after": {
                const afterDate = check.value;
                if (!(afterDate instanceof Date) || isNaN(afterDate.getTime())) {
                    return this._fail(path, check.msg || "Invalid date");
                }
                if (!(t > afterDate.getTime())) return this._fail(path, check.msg);
                break;
            }
            case "between": {
                const { min, max } = check;
                if (!(min instanceof Date) || isNaN(min.getTime()) || !(max instanceof Date) || isNaN(max.getTime())) {
                    return this._fail(path, check.msg || "Invalid between dates");
                }
                if (!(t >= min.getTime() && t <= max.getTime())) return this._fail(path, check.msg);
                break;
            }
            case "past": {
                if (!(t < Date.now())) return this._fail(path, check.msg);
                break;
            }
            case "future": {
                if (!(t > Date.now())) return this._fail(path, check.msg);
                break;
            }
            default:
                break;
        }

        return null;
    }

    // checkers
    min(date: Date, msg?: string) {
        return this.addCheck({ 
            kind: "check",
            opr: "min", 
            value: date, 
            msg: msg || `Date must be >= ${date.toISOString()}` 
        });
    }

    max(date: Date, msg?: string) {
        return this.addCheck({ 
            kind: "check",
            opr: "max", 
            value: date, 
            msg: msg || `Date must be <= ${date.toISOString()}` 
        });
    }

    before(date: Date, msg?: string) {
        return this.addCheck({ 
            kind: "check", 
            opr: "before", 
            value: date, 
            msg: msg || `Date must be before ${date.toISOString()}` 
        });
    }

    after(date: Date, msg?: string) {
        return this.addCheck({ 
            kind: "check", 
            opr: "after", 
            value: date, 
            msg: msg || `Date must be after ${date.toISOString()}` 
        });
    }

    between(min: Date, max: Date, msg?: string) {
        return this.addCheck({ 
            kind: "check", 
            opr: "between", 
            min: min, 
            max: max, 
            msg: msg || `Date must be between ${min.toISOString()} and ${max.toISOString()}` 
        });
    }

    past(msg?: string) {
        return this.addCheck({ 
            kind: "check", 
            opr: "past", 
            msg: msg || "Date must be in the past" 
        });
    }

    future(msg?: string) {
        return this.addCheck({ 
            kind: "check", 
            opr: "future", 
            msg: msg || "Date must be in the future" 
        });
    }

    // transforms
    startOf(unit: "day" | "month" | "year") {
        this.addTransform(d => {
            const out = new Date(d.getTime());
            if (unit === "day") {
                out.setHours(0, 0, 0, 0);
            } else if (unit === "month") {
                out.setDate(1);
                out.setHours(0, 0, 0, 0);
            } else if (unit === "year") {
                out.setMonth(0, 1);
                out.setHours(0, 0, 0, 0);
            }
            return out;
        });
        return this;
    }

    endOf(unit: "day" | "month" | "year") {
        this.addTransform(d => {
            const out = new Date(d.getTime());
            if (unit === "day") {
                out.setHours(23, 59, 59, 999);
            } else if (unit === "month") {
                out.setDate(1);
                out.setMonth(out.getMonth() + 1);
                out.setDate(0); 
                out.setHours(23, 59, 59, 999);
            } else if (unit === "year") {
                out.setMonth(11, 31);
                out.setHours(23, 59, 59, 999);
            }
            return out;
        });
        return this;
    }

    add(ms: number) {
        return this.addTransform(d => new Date(d.getTime() + ms));
    }

    subtract(ms: number) {
        return this.addTransform(d => new Date(d.getTime() - ms));
    }

    toISOString() {
        return this.transform(d => d.toISOString());
    }

    timestamp() {
        return this.transform(d => d.getTime());
    }

}
