"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNativeProviderConfig = exports.WorkflowOpts = exports.getConfig = exports.parseConfig = exports.Config = exports.NativeConfig = exports.providersDir = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("yaml"));
const zod_1 = require("zod");
exports.providersDir = "providers";
const ExamplesConfig = zod_1.z.object({
    template: zod_1.z.literal("examples"),
});
const BridgedConfig = zod_1.z
    .object({
    template: zod_1.z.literal("bridged"),
    provider: zod_1.z.string(),
    "generate-nightly-test-workflow": zod_1.z.boolean().default(false),
    // Workflow options
    env: zod_1.z.record(zod_1.z.any()).optional(),
    docker: zod_1.z.boolean().default(false),
    aws: zod_1.z.boolean().default(false),
    gcp: zod_1.z.boolean().default(false),
    lint: zod_1.z.boolean().default(true),
    "setup-script": zod_1.z.string().optional(),
    parallel: zod_1.z.number().default(3),
    timeout: zod_1.z.number().default(60),
    // Provider options
    "upstream-provider-org": zod_1.z.string(),
    "upstream-provider-repo": zod_1.z.string().default(""),
    "fail-on-extra-mapping": zod_1.z.boolean().default(true),
    "fail-on-missing-mapping": zod_1.z.boolean().default(true),
    "upstream-provider-major-version": zod_1.z.string().default(""),
    "provider-default-branch": zod_1.z.string().default("master"),
    "golangci-timeout": zod_1.z.string().default("20m"),
    "major-version": zod_1.z.number().default(2),
    skipTfGen: zod_1.z.boolean().default(false),
    providerVersion: zod_1.z.string().default(""),
    skipWindowsArmBuild: zod_1.z.boolean().default(false),
    // Makefile options
    makeTemplate: zod_1.z.enum(["none", "bridged", "bridged-v2"]).default("none"),
    plugins: zod_1.z
        .array(zod_1.z.object({ name: zod_1.z.string(), version: zod_1.z.string() }))
        .optional(),
})
    .transform((input) => {
    if (input["upstream-provider-repo"] !== "") {
        return input;
    }
    return Object.assign(Object.assign({}, input), { "upstream-provider-repo": `terraform-provider-${input.provider}` });
});
exports.NativeConfig = zod_1.z.object({
    template: zod_1.z.literal("native"),
    provider: zod_1.z.string(),
    "provider-default-branch": zod_1.z.string().default("master"),
    "golangci-timeout": zod_1.z.string().default("20m"),
    "major-version": zod_1.z.number().default(0),
    customLdFlag: zod_1.z.string().default(""),
    skipWindowsArmBuild: zod_1.z.boolean().default(false),
});
exports.Config = zod_1.z.union([exports.NativeConfig, BridgedConfig, ExamplesConfig]);
const parseConfig = (content) => {
    var _a;
    const result = exports.Config.safeParse(yaml.parse(content));
    if (!result.success) {
        result.error;
        throw new Error(`Invalid config:\n${result.error}\n${content}`);
    }
    const parsed = result.data;
    if (parsed.template === "bridged") {
        const upstreamProviderRepo = (_a = parsed["upstream-provider-repo"]) !== null && _a !== void 0 ? _a : `terraform-provider-${parsed.provider}`;
        return Object.assign(Object.assign({}, parsed), { "upstream-provider-repo": upstreamProviderRepo });
    }
    return parsed;
};
exports.parseConfig = parseConfig;
const getConfig = (providerConfigFile) => {
    const content = fs.readFileSync(providerConfigFile, { encoding: "utf-8" });
    return (0, exports.parseConfig)(content);
};
exports.getConfig = getConfig;
exports.WorkflowOpts = zod_1.z.object({
    provider: zod_1.z.string(),
    env: zod_1.z.record(zod_1.z.any()).optional(),
    docker: zod_1.z.boolean().default(false),
    aws: zod_1.z.boolean().default(false),
    gcp: zod_1.z.boolean().default(false),
    submodules: zod_1.z.boolean().default(false),
    lint: zod_1.z.boolean().default(true),
    "setup-script": zod_1.z.string().optional(),
    parallel: zod_1.z.number().default(3),
    timeout: zod_1.z.number().default(60),
    providerVersion: zod_1.z.string().default(""),
    skipCodegen: zod_1.z.boolean().default(false),
    skipWindowsArmBuild: zod_1.z.boolean().default(false),
});
const getNativeProviderConfig = (provider) => {
    const configPath = path.join(exports.providersDir, provider, "config.yaml");
    const content = fs.readFileSync(configPath, { encoding: "utf-8" });
    const parsed = zod_1.z
        .intersection(exports.NativeConfig, exports.WorkflowOpts)
        .parse(yaml.parse(content));
    return Object.assign({}, parsed);
};
exports.getNativeProviderConfig = getNativeProviderConfig;
//# sourceMappingURL=index.js.map