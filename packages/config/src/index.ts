import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import { z } from "zod";

export const providersDir = "providers";

const ExamplesConfig = z.object({
  template: z.literal("examples"),
});

const BridgedConfig = z
  .object({
    template: z.literal("bridged"),
    provider: z.string(),
    "generate-nightly-test-workflow": z.boolean().default(false),
    // Workflow options
    env: z.record(z.any()).optional(),
    docker: z.boolean().default(false),
    aws: z.boolean().default(false),
    gcp: z.boolean().default(false),
    lint: z.boolean().default(true),
    "setup-script": z.string().optional(),
    parallel: z.number().default(3),
    timeout: z.number().default(60),
    // Provider options
    "upstream-provider-org": z.string(),
    "upstream-provider-repo": z.string().default(""),
    "fail-on-extra-mapping": z.boolean().default(true),
    "fail-on-missing-mapping": z.boolean().default(true),
    "upstream-provider-major-version": z.string().default(""),
    "provider-default-branch": z.string().default("master"),
    "golangci-timeout": z.string().default("20m"),
    "major-version": z.number().default(2),
    skipTfGen: z.boolean().default(false),
    providerVersion: z.string().default(""),
    skipWindowsArmBuild: z.boolean().default(false),
    // Makefile options
    makeTemplate: z.enum(["none", "bridged", "bridged-v2"]).default("none"),
    plugins: z
      .array(z.object({ name: z.string(), version: z.string() }))
      .optional(),
  })
  .transform((input) => {
    if (input["upstream-provider-repo"] !== "") {
      return input;
    }
    return {
      ...input,
      "upstream-provider-repo": `terraform-provider-${input.provider}`,
    };
  });

export const NativeConfig = z.object({
  template: z.literal("native"),
  provider: z.string(),
  "provider-default-branch": z.string().default("master"),
  "golangci-timeout": z.string().default("20m"),
  "major-version": z.number().default(0),
  customLdFlag: z.string().default(""),
  skipWindowsArmBuild: z.boolean().default(false),
});

  
export type BridgedConfig = z.TypeOf<typeof BridgedConfig>;
export type NativeConfig = z.TypeOf<typeof NativeConfig>;

export const Config = z.union([NativeConfig, BridgedConfig, ExamplesConfig]);
export type Config = z.TypeOf<typeof Config>;

export const parseConfig = (content: string) => {
  const result = Config.safeParse(yaml.parse(content));
  if (!result.success) {
    result.error;
    throw new Error(`Invalid config:\n${result.error}\n${content}`);
  }
  const parsed = result.data;
  if (parsed.template === "bridged") {
    const upstreamProviderRepo =
      parsed["upstream-provider-repo"] ??
      `terraform-provider-${parsed.provider}`;
    return {
      ...parsed,
      "upstream-provider-repo": upstreamProviderRepo,
    };
  }
  return parsed;
};

export const getConfig = (providerConfigFile: string): Config => {
  const content = fs.readFileSync(providerConfigFile, { encoding: "utf-8" });
  return parseConfig(content);
};

export const WorkflowOpts = z.object({
  provider: z.string(),
  env: z.record(z.any()).optional(),
  docker: z.boolean().default(false),
  aws: z.boolean().default(false),
  gcp: z.boolean().default(false),
  submodules: z.boolean().default(false),
  lint: z.boolean().default(true),
  "setup-script": z.string().optional(),
  parallel: z.number().default(3),
  timeout: z.number().default(60),
  providerVersion: z.string().default(""),
  skipCodegen: z.boolean().default(false),
  skipWindowsArmBuild: z.boolean().default(false),
});
export type WorkflowOpts = z.infer<typeof WorkflowOpts>;

export const getNativeProviderConfig = (provider: string) => {
  const configPath = path.join(providersDir, provider, "config.yaml");
  const content = fs.readFileSync(configPath, { encoding: "utf-8" });
  const parsed = z
    .intersection(NativeConfig, WorkflowOpts)
    .parse(yaml.parse(content));
  return {
    ...parsed,
  };
};

