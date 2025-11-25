import { ParseResult, VodCheck, VodPayload, VodTransform, VodTransforms } from "./types";
import { VodArray } from "./vod-array";
import { VodError } from "./vod-error";
import { VodNullable } from "./vod-nullable";
import { VodOptional } from "./vod-optional";
import { VodPipe } from "./vod-pipe";
import { VodTransformer } from "./vod-transformer";
import { VodUnion } from "./vod-union";

export abstract class VodType<T> {
    readonly _output!: T;
    protected _operations: VodPayload<T>[] = [];  
    protected abstract _parseValue(value: unknown, path: (string | number)[]): ParseResult<T>;

    parse(value: unknown): T {
        const res = this._parse(value, []);
        if (!res.success) throw res.error;
        return res.data;
    }

    safeParse(value: unknown): ParseResult<T> {
        return this._parse(value, []);
    }

    protected _coerce?(value: unknown): unknown;

    protected _fail(path: (string | number)[], message: string): ParseResult<T> {
        return { success: false, error: new VodError([{ path, message }]) };
    }

    protected _parse(value: unknown, path: (string | number)[] = []): ParseResult<T> {
        let coerced = value;
        if(this._coerce) coerced = this._coerce(value);

        const parsed = this._parseValue(coerced, path);
        if (!parsed.success) return parsed;

        for (const opr of this._operations) {
            if(opr.kind === "transform") {
                parsed.data = opr.fn(parsed.data as any);
                continue;
            }

            const result = this._runCheck(parsed.data, opr as unknown as VodCheck<T>, path);
            if (result) return result;
        }
        return { success: true, data: parsed.data };
    }

    protected _runCheck(data: T, check: VodCheck<T>, path: (string | number)[]) {
        if (check.opr === "refinement") {
            if (!check.fn(data as any)) {
                return this._fail(path, check.msg);
            }
        }
        return null;
    }

    static isVodType(obj: any): obj is VodType<any> {
        return obj instanceof VodType;
    }

    protected addCheck(check: VodCheck<T>) {
        this._operations.push(check as unknown as VodPayload<T>);
        return this;
    }

    protected addTransform(fn: (val: T) => T) {
        this._operations.push({
            kind: "transform",
            fn
        } as VodTransforms<T>);
        return this;
    }

    refine(check: (value: T) => boolean, msg: string): this {
        return this.addCheck({
            opr: "refinement",
            msg: msg,
            fn: check
        } as VodCheck<T>);
    }

    pipe<R>(target: VodType<R>): VodPipe<T, R> {
        return new VodPipe(this, target);
    }

    transform<R>(fn: (value: T) => R): VodPipe<T, R> {
        return this.pipe(new VodTransformer(fn));
    }

    optional() {
        return new VodOptional(this);
    }

    nullable() {
        return new VodNullable(this);
    }

    array() {
        return new VodArray<VodType<T>>(this);
    }

    or<U extends VodType<any>>(other: U): VodUnion<[this, U]> {
        return new VodUnion(this, other);
    }

}


