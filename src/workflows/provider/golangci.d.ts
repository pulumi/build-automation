export interface RunConfig {
    timeout: string;
    "skip-files": string[];
}
export interface Linters {
    "enable-all": boolean;
    enable: string[];
}
export declare class PulumiGolangCIConfig {
    constructor(timeout: string);
    run: RunConfig;
    linters: Linters;
}
//# sourceMappingURL=golangci.d.ts.map