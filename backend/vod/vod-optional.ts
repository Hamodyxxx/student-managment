import { ParseResult } from "./types";
import { VodType } from "./vod-type";

export class VodOptional<T> extends VodType<T | undefined> {
    constructor(private inner: VodType<T>) {
      super();
    }
  
    _parseValue(value: unknown, path: (string | number)[]): ParseResult<T | undefined> {
      if (value === undefined) {
        return {
            success: true,
            data: undefined
        };
      }
      return (this.inner as unknown as any)._parse(value, path);
    }
}