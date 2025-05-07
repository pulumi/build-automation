export interface Build {
    id?: string;
    dir?: string;
    main?: string;
    binary?: string;
    flags?: string[];
    asmflags?: string[];
    gcflags?: string[];
    ldflags?: string[];
    env?: string[];
    goos?: string[];
    goarch?: string[];
    goarm?: string[];
    skip?: boolean;
    ignore?: Ignores[];
}
export interface FormatOverride {
    goos?: string;
    format?: string;
}
export interface Archive {
    id?: string;
    name_template?: string;
    builds?: string[];
    wrap_in_directory?: boolean;
    format?: string;
    format_overrides?: FormatOverride[];
    replacements?: {
        [k: string]: string;
    };
}
export interface Ignores {
    goos?: string;
    goarch?: string;
}
export interface Before {
    hooks?: string[];
}
export interface Snapshot {
    name_template?: string;
}
export interface Changelog {
    skip?: boolean;
    use?: string;
    sort?: string;
    filters?: Filters;
}
export interface Filters {
    exclude?: string[];
}
export interface Release {
    disable?: boolean;
    prerelease?: boolean;
}
export interface Blob {
    provider?: string;
    region?: string;
    bucket?: string;
    folder?: string;
    ids?: string[];
}
export interface GoreleaserConfig {
    name?: string;
    builds: Build[];
    archives: Archive[];
    before?: Before;
    snapshot: Snapshot;
    changelog: Changelog;
    release: Release;
    blobs: Blob[];
}
interface GoReleaserOpts {
    provider: string;
    skipWindowsArmBuild: boolean;
    "major-version": number;
    providerVersion: string;
    skipTfGen: boolean;
}
export declare class PulumiGoreleaserPreConfig implements GoreleaserConfig {
    name?: string;
    before?: Before;
    builds: Build[];
    archives: Archive[];
    snapshot: Snapshot;
    changelog: Changelog;
    release: Release;
    blobs: Blob[];
    constructor(opts: GoReleaserOpts);
}
export declare class PulumiGoreleaserConfig extends PulumiGoreleaserPreConfig {
    constructor(opts: GoReleaserOpts);
}
export {};
//# sourceMappingURL=goreleaser.d.ts.map