import { ParseResult } from "./types";
import { VodType } from "./vod-type";

export class VodNullable<T> extends VodType<T | null> {
    constructor(private inner: VodType<T>) {
      super();
    }
  
    _parseValue(value: unknown, path: (string | number)[]): ParseResult<T | null> {
      if (value === null) {
        return {
            success: true,
            data: null
        };
      }
      return (this.inner as unknown as any)._parse(value, path);
    }
}