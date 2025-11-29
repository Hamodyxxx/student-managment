import { VodNumber } from "./vod-number";
import { VodString } from "./vod-string";
import { VodBoolean } from "./vod-bool";
import { VodDate } from "./vod-date";
import { VodMap } from "./vod-map";
import { VodSet } from "./vod-set";
import { VodArray } from "./vod-array";
import { VodType } from "./vod-type";

export class VodNumberCoerce extends VodNumber {
    protected _coerce(value: unknown) {
        return Number(value);
    }
}

export class VodStringCoerce extends VodString {
    protected _coerce(value: unknown) {
        return String(value);
    }
}

export class VodBooleanCoerce extends VodBoolean {
    protected _coerce(value: unknown) {
        return Boolean(value);
    }
}

export class VodDateCoerce extends VodDate {
    protected _coerce(value: unknown) {
        return new Date(value as string);
    }
}

export class VodMapCoerce<K extends VodType<any>, V extends VodType<any>> extends VodMap<K, V> {
    protected _coerce(value: unknown) {
        if (value instanceof Map) return value;
        if (typeof value === "object" && value !== null) {
            return new Map(Object.entries(value));
        }
        return;
    }
}

export class VodSetCoerce<T extends VodType<any>> extends VodSet<T> {
    protected _coerce(value: unknown) {
        if (value instanceof Set) return value;
        if (Array.isArray(value)) return new Set(value);
        return;
    }
}

export class VodArrayCoerce<T extends VodType<any>> extends VodArray<T> {
    protected _coerce(value: unknown) {
        if (Array.isArray(value)) return value;
        if (value instanceof Set) return Array.from(value);
        if (value == null) return [];
        return [value];
    }
}
