import { z } from "zod";
export declare const providersDir = "providers";
declare const BridgedConfig: z.ZodEffects<z.ZodObject<{
    template: z.ZodLiteral<"bridged">;
    provider: z.ZodString;
    "generate-nightly-test-workflow": z.ZodDefault<z.ZodBoolean>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    docker: z.ZodDefault<z.ZodBoolean>;
    aws: z.ZodDefault<z.ZodBoolean>;
    gcp: z.ZodDefault<z.ZodBoolean>;
    lint: z.ZodDefault<z.ZodBoolean>;
    "setup-script": z.ZodOptional<z.ZodString>;
    parallel: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
    "upstream-provider-org": z.ZodString;
    "upstream-provider-repo": z.ZodDefault<z.ZodString>;
    "fail-on-extra-mapping": z.ZodDefault<z.ZodBoolean>;
    "fail-on-missing-mapping": z.ZodDefault<z.ZodBoolean>;
    "upstream-provider-major-version": z.ZodDefault<z.ZodString>;
    "provider-default-branch": z.ZodDefault<z.ZodString>;
    "golangci-timeout": z.ZodDefault<z.ZodString>;
    "major-version": z.ZodDefault<z.ZodNumber>;
    skipTfGen: z.ZodDefault<z.ZodBoolean>;
    providerVersion: z.ZodDefault<z.ZodString>;
    skipWindowsArmBuild: z.ZodDefault<z.ZodBoolean>;
    makeTemplate: z.ZodDefault<z.ZodEnum<["none", "bridged", "bridged-v2"]>>;
    plugins: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    template: "bridged";
    provider: string;
    "generate-nightly-test-workflow": boolean;
    docker: boolean;
    aws: boolean;
    gcp: boolean;
    lint: boolean;
    parallel: number;
    timeout: number;
    "upstream-provider-org": string;
    "upstream-provider-repo": string;
    "fail-on-extra-mapping": boolean;
    "fail-on-missing-mapping": boolean;
    "upstream-provider-major-version": string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipTfGen: boolean;
    providerVersion: string;
    skipWindowsArmBuild: boolean;
    makeTemplate: "bridged" | "none" | "bridged-v2";
    env?: Record<string, any> | undefined;
    "setup-script"?: string | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
}, {
    template: "bridged";
    provider: string;
    "upstream-provider-org": string;
    "generate-nightly-test-workflow"?: boolean | undefined;
    env?: Record<string, any> | undefined;
    docker?: boolean | undefined;
    aws?: boolean | undefined;
    gcp?: boolean | undefined;
    lint?: boolean | undefined;
    "setup-script"?: string | undefined;
    parallel?: number | undefined;
    timeout?: number | undefined;
    "upstream-provider-repo"?: string | undefined;
    "fail-on-extra-mapping"?: boolean | undefined;
    "fail-on-missing-mapping"?: boolean | undefined;
    "upstream-provider-major-version"?: string | undefined;
    "provider-default-branch"?: string | undefined;
    "golangci-timeout"?: string | undefined;
    "major-version"?: number | undefined;
    skipTfGen?: boolean | undefined;
    providerVersion?: string | undefined;
    skipWindowsArmBuild?: boolean | undefined;
    makeTemplate?: "bridged" | "none" | "bridged-v2" | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
}>, {
    template: "bridged";
    provider: string;
    "generate-nightly-test-workflow": boolean;
    docker: boolean;
    aws: boolean;
    gcp: boolean;
    lint: boolean;
    parallel: number;
    timeout: number;
    "upstream-provider-org": string;
    "upstream-provider-repo": string;
    "fail-on-extra-mapping": boolean;
    "fail-on-missing-mapping": boolean;
    "upstream-provider-major-version": string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipTfGen: boolean;
    providerVersion: string;
    skipWindowsArmBuild: boolean;
    makeTemplate: "bridged" | "none" | "bridged-v2";
    env?: Record<string, any> | undefined;
    "setup-script"?: string | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
}, {
    template: "bridged";
    provider: string;
    "upstream-provider-org": string;
    "generate-nightly-test-workflow"?: boolean | undefined;
    env?: Record<string, any> | undefined;
    docker?: boolean | undefined;
    aws?: boolean | undefined;
    gcp?: boolean | undefined;
    lint?: boolean | undefined;
    "setup-script"?: string | undefined;
    parallel?: number | undefined;
    timeout?: number | undefined;
    "upstream-provider-repo"?: string | undefined;
    "fail-on-extra-mapping"?: boolean | undefined;
    "fail-on-missing-mapping"?: boolean | undefined;
    "upstream-provider-major-version"?: string | undefined;
    "provider-default-branch"?: string | undefined;
    "golangci-timeout"?: string | undefined;
    "major-version"?: number | undefined;
    skipTfGen?: boolean | undefined;
    providerVersion?: string | undefined;
    skipWindowsArmBuild?: boolean | undefined;
    makeTemplate?: "bridged" | "none" | "bridged-v2" | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
}>;
export declare const NativeConfig: z.ZodObject<{
    template: z.ZodLiteral<"native">;
    provider: z.ZodString;
    "provider-default-branch": z.ZodDefault<z.ZodString>;
    "golangci-timeout": z.ZodDefault<z.ZodString>;
    "major-version": z.ZodDefault<z.ZodNumber>;
    customLdFlag: z.ZodDefault<z.ZodString>;
    skipWindowsArmBuild: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    template: "native";
    provider: string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipWindowsArmBuild: boolean;
    customLdFlag: string;
}, {
    template: "native";
    provider: string;
    "provider-default-branch"?: string | undefined;
    "golangci-timeout"?: string | undefined;
    "major-version"?: number | undefined;
    customLdFlag?: string | undefined;
    skipWindowsArmBuild?: boolean | undefined;
}>;
export type BridgedConfig = z.TypeOf<typeof BridgedConfig>;
export type NativeConfig = z.TypeOf<typeof NativeConfig>;
export declare const Config: z.ZodUnion<[z.ZodObject<{
    template: z.ZodLiteral<"native">;
    provider: z.ZodString;
    "provider-default-branch": z.ZodDefault<z.ZodString>;
    "golangci-timeout": z.ZodDefault<z.ZodString>;
    "major-version": z.ZodDefault<z.ZodNumber>;
    customLdFlag: z.ZodDefault<z.ZodString>;
    skipWindowsArmBuild: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    template: "native";
    provider: string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipWindowsArmBuild: boolean;
    customLdFlag: string;
}, {
    template: "native";
    provider: string;
    "provider-default-branch"?: string | undefined;
    "golangci-timeout"?: string | undefined;
    "major-version"?: number | undefined;
    customLdFlag?: string | undefined;
    skipWindowsArmBuild?: boolean | undefined;
}>, z.ZodEffects<z.ZodObject<{
    template: z.ZodLiteral<"bridged">;
    provider: z.ZodString;
    "generate-nightly-test-workflow": z.ZodDefault<z.ZodBoolean>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    docker: z.ZodDefault<z.ZodBoolean>;
    aws: z.ZodDefault<z.ZodBoolean>;
    gcp: z.ZodDefault<z.ZodBoolean>;
    lint: z.ZodDefault<z.ZodBoolean>;
    "setup-script": z.ZodOptional<z.ZodString>;
    parallel: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
    "upstream-provider-org": z.ZodString;
    "upstream-provider-repo": z.ZodDefault<z.ZodString>;
    "fail-on-extra-mapping": z.ZodDefault<z.ZodBoolean>;
    "fail-on-missing-mapping": z.ZodDefault<z.ZodBoolean>;
    "upstream-provider-major-version": z.ZodDefault<z.ZodString>;
    "provider-default-branch": z.ZodDefault<z.ZodString>;
    "golangci-timeout": z.ZodDefault<z.ZodString>;
    "major-version": z.ZodDefault<z.ZodNumber>;
    skipTfGen: z.ZodDefault<z.ZodBoolean>;
    providerVersion: z.ZodDefault<z.ZodString>;
    skipWindowsArmBuild: z.ZodDefault<z.ZodBoolean>;
    makeTemplate: z.ZodDefault<z.ZodEnum<["none", "bridged", "bridged-v2"]>>;
    plugins: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    template: "bridged";
    provider: string;
    "generate-nightly-test-workflow": boolean;
    docker: boolean;
    aws: boolean;
    gcp: boolean;
    lint: boolean;
    parallel: number;
    timeout: number;
    "upstream-provider-org": string;
    "upstream-provider-repo": string;
    "fail-on-extra-mapping": boolean;
    "fail-on-missing-mapping": boolean;
    "upstream-provider-major-version": string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipTfGen: boolean;
    providerVersion: string;
    skipWindowsArmBuild: boolean;
    makeTemplate: "bridged" | "none" | "bridged-v2";
    env?: Record<string, any> | undefined;
    "setup-script"?: string | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
}, {
    template: "bridged";
    provider: string;
    "upstream-provider-org": string;
    "generate-nightly-test-workflow"?: boolean | undefined;
    env?: Record<string, any> | undefined;
    docker?: boolean | undefined;
    aws?: boolean | undefined;
    gcp?: boolean | undefined;
    lint?: boolean | undefined;
    "setup-script"?: string | undefined;
    parallel?: number | undefined;
    timeout?: number | undefined;
    "upstream-provider-repo"?: string | undefined;
    "fail-on-extra-mapping"?: boolean | undefined;
    "fail-on-missing-mapping"?: boolean | undefined;
    "upstream-provider-major-version"?: string | undefined;
    "provider-default-branch"?: string | undefined;
    "golangci-timeout"?: string | undefined;
    "major-version"?: number | undefined;
    skipTfGen?: boolean | undefined;
    providerVersion?: string | undefined;
    skipWindowsArmBuild?: boolean | undefined;
    makeTemplate?: "bridged" | "none" | "bridged-v2" | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
}>, {
    template: "bridged";
    provider: string;
    "generate-nightly-test-workflow": boolean;
    docker: boolean;
    aws: boolean;
    gcp: boolean;
    lint: boolean;
    parallel: number;
    timeout: number;
    "upstream-provider-org": string;
    "upstream-provider-repo": string;
    "fail-on-extra-mapping": boolean;
    "fail-on-missing-mapping": boolean;
    "upstream-provider-major-version": string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipTfGen: boolean;
    providerVersion: string;
    skipWindowsArmBuild: boolean;
    makeTemplate: "bridged" | "none" | "bridged-v2";
    env?: Record<string, any> | undefined;
    "setup-script"?: string | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
}, {
    template: "bridged";
    provider: string;
    "upstream-provider-org": string;
    "generate-nightly-test-workflow"?: boolean | undefined;
    env?: Record<string, any> | undefined;
    docker?: boolean | undefined;
    aws?: boolean | undefined;
    gcp?: boolean | undefined;
    lint?: boolean | undefined;
    "setup-script"?: string | undefined;
    parallel?: number | undefined;
    timeout?: number | undefined;
    "upstream-provider-repo"?: string | undefined;
    "fail-on-extra-mapping"?: boolean | undefined;
    "fail-on-missing-mapping"?: boolean | undefined;
    "upstream-provider-major-version"?: string | undefined;
    "provider-default-branch"?: string | undefined;
    "golangci-timeout"?: string | undefined;
    "major-version"?: number | undefined;
    skipTfGen?: boolean | undefined;
    providerVersion?: string | undefined;
    skipWindowsArmBuild?: boolean | undefined;
    makeTemplate?: "bridged" | "none" | "bridged-v2" | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
}>, z.ZodObject<{
    template: z.ZodLiteral<"examples">;
}, "strip", z.ZodTypeAny, {
    template: "examples";
}, {
    template: "examples";
}>]>;
export type Config = z.TypeOf<typeof Config>;
export declare const parseConfig: (content: string) => {
    template: "examples";
} | {
    template: "native";
    provider: string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipWindowsArmBuild: boolean;
    customLdFlag: string;
} | {
    "upstream-provider-repo": string;
    template: "bridged";
    provider: string;
    "generate-nightly-test-workflow": boolean;
    docker: boolean;
    aws: boolean;
    gcp: boolean;
    lint: boolean;
    parallel: number;
    timeout: number;
    "upstream-provider-org": string;
    "fail-on-extra-mapping": boolean;
    "fail-on-missing-mapping": boolean;
    "upstream-provider-major-version": string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipTfGen: boolean;
    providerVersion: string;
    skipWindowsArmBuild: boolean;
    makeTemplate: "bridged" | "none" | "bridged-v2";
    env?: Record<string, any> | undefined;
    "setup-script"?: string | undefined;
    plugins?: {
        name: string;
        version: string;
    }[] | undefined;
};
export declare const getConfig: (providerConfigFile: string) => Config;
export declare const WorkflowOpts: z.ZodObject<{
    provider: z.ZodString;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    docker: z.ZodDefault<z.ZodBoolean>;
    aws: z.ZodDefault<z.ZodBoolean>;
    gcp: z.ZodDefault<z.ZodBoolean>;
    submodules: z.ZodDefault<z.ZodBoolean>;
    lint: z.ZodDefault<z.ZodBoolean>;
    "setup-script": z.ZodOptional<z.ZodString>;
    parallel: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
    providerVersion: z.ZodDefault<z.ZodString>;
    skipCodegen: z.ZodDefault<z.ZodBoolean>;
    skipWindowsArmBuild: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    provider: string;
    docker: boolean;
    aws: boolean;
    gcp: boolean;
    lint: boolean;
    parallel: number;
    timeout: number;
    providerVersion: string;
    skipWindowsArmBuild: boolean;
    submodules: boolean;
    skipCodegen: boolean;
    env?: Record<string, any> | undefined;
    "setup-script"?: string | undefined;
}, {
    provider: string;
    env?: Record<string, any> | undefined;
    docker?: boolean | undefined;
    aws?: boolean | undefined;
    gcp?: boolean | undefined;
    submodules?: boolean | undefined;
    lint?: boolean | undefined;
    "setup-script"?: string | undefined;
    parallel?: number | undefined;
    timeout?: number | undefined;
    providerVersion?: string | undefined;
    skipCodegen?: boolean | undefined;
    skipWindowsArmBuild?: boolean | undefined;
}>;
export type WorkflowOpts = z.infer<typeof WorkflowOpts>;
export declare const getNativeProviderConfig: (provider: string) => {
    template: "native";
    provider: string;
    "provider-default-branch": string;
    "golangci-timeout": string;
    "major-version": number;
    skipWindowsArmBuild: boolean;
    customLdFlag: string;
    docker: boolean;
    aws: boolean;
    gcp: boolean;
    lint: boolean;
    parallel: number;
    timeout: number;
    providerVersion: string;
    submodules: boolean;
    skipCodegen: boolean;
    env?: Record<string, any> | undefined;
    "setup-script"?: string | undefined;
};
export {};
//# sourceMappingURL=index.d.ts.map