import { ParseResult, UnionOutput } from "./types";
import { VodError } from "./vod-error";
import { VodType } from "./vod-type";



export class VodUnion<T extends VodType<any>[]>
    extends VodType<UnionOutput<T>> 
{
    private inner: T;

    constructor(...schemas: T) {
        super();
        this.inner = schemas;
    }

    protected _parseValue(value: unknown, path: (string | number)[] = []): ParseResult<UnionOutput<T>> {
        const allIssues: { path: (string | number)[]; message: string }[] = [];

        for (const schema of this.inner) {
            const result = (schema as any)._parse(value, path);
            if (result.success) return result;

            if (result.error instanceof VodError) {
                allIssues.push(...result.error.issues);
            } else {
                allIssues.push({ path, message: result.error.message });
            }
        }

        return {
            success: false,
            error: new VodError(allIssues),
        };
    }
}
