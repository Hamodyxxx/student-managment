import { ParseResult } from "./types";
import { VodType } from "./vod-type";

export class VodPipe<T, R> extends VodType<R> {
    private left: VodType<T>;
    private right: VodType<R>;

    constructor(left: VodType<T>, right: VodType<R>) {
        super();
        this.left = left;
        this.right = right;
    }

    protected _parseValue(value: unknown, path: (string | number)[] = []): ParseResult<R> {
        const leftResult = (this.left as any)._parse(value, path);
        if (!leftResult.success) return leftResult;

        const rightResult = (this.right as any)._parse(leftResult.data, path);
        return rightResult;
    }
}