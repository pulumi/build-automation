export type AssignmentType = "simple" | "conditional" | "recursive";
type Assignment = string | {
    value: string;
    /** Assignment type:
     * - simple `:=`
     * - conditional `?=`
     * - recursive `=`
     * @default "simple" */
    type?: AssignmentType;
};
export type Variables = Record<string, Assignment>;
export type Target = {
    /** Name of the target */
    name: string;
    /** Names or references of dependencies */
    dependencies?: (string | Target)[];
    /** Target-specific variable assignments */
    variables?: Variables;
    /** List of commands to execute
     *  Items which are arrays, will be concatenated with `&&`
     */
    commands?: (string | string[])[];
    /** Auto-emit .PHONY target */
    phony?: boolean;
    /** Auto-touch file on completion */
    autoTouch?: boolean;
};
export type Makefile = {
    variables?: Variables;
    targets?: Target[];
    defaultTarget?: Target | string;
};
export declare function render(makefile: Makefile): string;
export {};
//# sourceMappingURL=make.d.ts.map