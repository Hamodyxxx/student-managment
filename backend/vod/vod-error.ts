import { ParseIssue } from "./types";

export class VodError extends Error {
    issues: ParseIssue[];

    constructor(issues: ParseIssue[]) {
        super(issues.map(i => `[${i.path.join('.')}] ${i.message}`).join("; "));
        this.issues = issues;

        Object.setPrototypeOf(this, VodError.prototype);
    }
}