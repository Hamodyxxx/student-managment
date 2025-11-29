import { VodError } from "./vod-error";
import { VodType } from "./vod-type";

export type ParseIssue = { path: (string | number)[]; message: string };

export type ParseResult<T> = { success: true; data: T } | { success: false; error: VodError };

export type SchemaMap = {
  [key: string]: VodType<any>;
};

export type UnionOutput<T extends VodType<any>[]> = {
  [K in keyof T]: T[K] extends VodType<infer U> ? U : never;
}[number];

export type GetVodOutputType<V> = V extends VodType<infer T> ? T : never;

// --------------------------
// Base payload
// --------------------------
type VodCheckPayload<T extends {}, K extends string> = T & {
    kind: "check";
    opr: K;
    msg: string;
};
  

export type VodRefinementCheck<T> = VodCheckPayload<{ fn: (val: T) => boolean }, "refinement">;
export type VodMinCheck<T> = VodCheckPayload<{ min: number }, "min">;
export type VodMaxCheck<T> = VodCheckPayload<{ max: number }, "max">;
export type VodIncludesCheck<T> = VodCheckPayload<{ value: T }, "includes">;
export type VodStartsWithCheck<T> = VodCheckPayload<{ value: T }, "startswith">;
export type VodEndsWithCheck<T> = VodCheckPayload<{ value: T }, "endswith">;
export type VodPositiveCheck = VodCheckPayload<{}, "positive">;
export type VodNegativeCheck = VodCheckPayload<{}, "negative">;
export type VodNonNegativeCheck = VodCheckPayload<{}, "nonnegative">;
export type VodNonPositiveCheck = VodCheckPayload<{}, "nonpositive">;
export type VodFiniteCheck = VodCheckPayload<{}, "finite">;
export type VodExactCheck = VodCheckPayload<{ value: number }, "exact">;
export type VodUniqueCheck<T> = VodCheckPayload<{}, "unique">;
export type VodNonEmptyCheck<T> = VodCheckPayload<{}, "nonempty">;
export type VodEveryCheck<T extends unknown[]> = VodCheckPayload<{ fn: (val: T[number]) => boolean }, "every">;
export type VodIsTrueCheck = VodCheckPayload<{}, "istrue">;
export type VodIsFalseCheck = VodCheckPayload<{}, "isfalse">;
export type VodMultipleOfCheck = VodCheckPayload<{
  base: number;
}, "multipleof">;

// Date checks
export type VodDateMinCheck = VodCheckPayload<{ value: Date }, "min">;
export type VodDateMaxCheck = VodCheckPayload<{ value: Date }, "max">;
export type VodDateBeforeCheck = VodCheckPayload<{ value: Date }, "before">;
export type VodDateAfterCheck = VodCheckPayload<{ value: Date }, "after">;
export type VodDateBetweenCheck = VodCheckPayload<{ min: Date; max: Date }, "between">;
export type VodDatePastCheck = VodCheckPayload<{}, "past">;
export type VodDateFutureCheck = VodCheckPayload<{}, "future">;

export type VodDateCheck =
    | VodDateMinCheck
    | VodDateMaxCheck
    | VodDateBeforeCheck
    | VodDateAfterCheck
    | VodDateBetweenCheck
    | VodDatePastCheck
    | VodDateFutureCheck
    | VodRefinementCheck<Date>;

// Set checks
export type VodSetMinCheck<T> = VodCheckPayload<{ min: number }, "min">;
export type VodSetMaxCheck<T> = VodCheckPayload<{ max: number }, "max">;
export type VodSetNonEmptyCheck<T> = VodCheckPayload<{}, "nonempty">;
export type VodSetRefinementCheck<T> = VodRefinementCheck<Set<T>>;

// Map checks
export type VodMapMinCheck<K, V> = VodCheckPayload<{ min: number }, "min">;
export type VodMapMaxCheck<K, V> = VodCheckPayload<{ max: number }, "max">;
export type VodMapNonEmptyCheck<K, V> = VodCheckPayload<{}, "nonempty">;
export type VodMapRefinementCheck<K, V> = VodRefinementCheck<Map<K, V>>;

export type VodNumericCheck<T extends number> =
    | VodMinCheck<T>
    | VodMaxCheck<T>
    | VodPositiveCheck
    | VodNegativeCheck
    | VodNonNegativeCheck
    | VodNonPositiveCheck
    | VodFiniteCheck
    | VodExactCheck
    | VodRefinementCheck<T>
    | VodMultipleOfCheck;
  
export type VodArrayCheck<T extends unknown[]> =
    | VodMinCheck<T>
    | VodMaxCheck<T>
    | VodExactCheck
    | VodUniqueCheck<T>
    | VodNonEmptyCheck<T>
    | VodEveryCheck<T>
    | VodIncludesCheck<T>
    | VodRefinementCheck<T>;
  
export type VodStringCheck<T extends string> =
    | VodMinCheck<T>
    | VodMaxCheck<T>
    | VodIncludesCheck<T>
    | VodStartsWithCheck<T>
    | VodNonEmptyCheck<T>
    | VodEndsWithCheck<T>
    | VodRefinementCheck<T>;
  
export type VodBooleanCheck<T extends boolean> =
    | VodIsTrueCheck
    | VodIsFalseCheck
    | VodRefinementCheck<T>;
  
export type VodSetCheck<T> =
    | VodSetMinCheck<T>
    | VodSetMaxCheck<T>
    | VodSetNonEmptyCheck<T>
    | VodSetRefinementCheck<T>;

export type VodMapCheck<K, V> =
    | VodMapMinCheck<K, V>
    | VodMapMaxCheck<K, V>
    | VodMapNonEmptyCheck<K, V>
    | VodMapRefinementCheck<K, V>;

export type VodGeneralCheck<T> =
    | VodRefinementCheck<T>;
  
// Add type for DateValue
export type VodCheck<T> =
    T extends string
      ? VodStringCheck<T>
    : T extends number
      ? VodNumericCheck<T>
    : T extends boolean
      ? VodBooleanCheck<T>
    : T extends any[]
      ? VodArrayCheck<T>
    : T extends Date
      ? VodDateCheck
    : T extends Set<infer S>
      ? VodSetCheck<S>
    : T extends Map<infer K, infer V>
      ? VodMapCheck<K, V>
    : VodGeneralCheck<T>;

export type VodTransform<T = any, R = any> = {
    kind: "transform";
    fn: (value: T) => R;
};

export type VodArrayTransform<T extends unknown[]> = VodTransform<T, any>;
export type VodStringTransform<T extends string> = VodTransform<T, any>;
export type VodNumericTransform<T extends number> = VodTransform<T, any>;
export type VodBooleanTransform<T extends boolean> = VodTransform<T, any>;
export type VodDateTransform = VodTransform<Date, any>;
export type VodSetTransform<T> = VodTransform<Set<T>, any>;
export type VodMapTransform<K, V> = VodTransform<Map<K, V>, any>;
export type VodGeneralTransform<T> = VodTransform<T, any>;

// PAYLOAD TYPES
export type VodArrayPayload<T extends unknown[]> =
    | VodArrayCheck<T>
    | VodArrayTransform<T>;

export type VodStringPayload<T extends string> =
    | VodStringCheck<T>
    | VodStringTransform<T>;

export type VodNumericPayload<T extends number> =
    | VodNumericCheck<T>
    | VodNumericTransform<T>;

export type VodBooleanPayload<T extends boolean> =
    | VodBooleanCheck<T>
    | VodBooleanTransform<T>;

export type VodDatePayload =
    | VodDateCheck
    | VodDateTransform;

export type VodSetPayload<T> =
    | VodSetCheck<T>
    | VodSetTransform<T>;

export type VodMapPayload<K, V> =
    | VodMapCheck<K, V>
    | VodMapTransform<K, V>;

export type VodGeneralPayload<T> =
    | VodGeneralCheck<T>
    | VodGeneralTransform<T>;

export type VodTransforms<T> =
    T extends string
        ? VodStringTransform<T>
    : T extends number
        ? VodNumericTransform<T>
    : T extends boolean
        ? VodBooleanTransform<T>
    : T extends Date
        ? VodDateTransform
    : T extends Set<infer S>
        ? VodSetTransform<S>
    : T extends Map<infer K, infer V>
        ? VodMapTransform<K, V>
    : T extends any[]
        ? VodArrayTransform<T>
    : VodGeneralTransform<T>;

export type VodPayload<T> =
    T extends string
      ? VodStringPayload<T>
    : T extends number
      ? VodNumericPayload<T>
    : T extends boolean
      ? VodBooleanPayload<T>
    : T extends Date
      ? VodDatePayload
    : T extends Set<infer S>
      ? VodSetPayload<S>
    : T extends Map<infer K, infer V>
      ? VodMapPayload<K, V>
    : T extends any[]
      ? VodArrayPayload<T>
    : VodGeneralPayload<T>;