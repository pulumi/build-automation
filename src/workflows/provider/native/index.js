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
exports.buildProviderFiles = void 0;
const path = __importStar(require("path"));
const shared = __importStar(require("../shared-workflows"));
const wf = __importStar(require("./workflows"));
const goreleaser = __importStar(require("./goreleaser"));
const config_1 = require("../../../config");
const buildProviderFiles = (provider) => {
    const config = (0, config_1.getNativeProviderConfig)(provider);
    const githubWorkflowsDir = path.join(path.join(".github", "workflows"));
    const files = [
        {
            path: path.join(githubWorkflowsDir, "artifact-cleanup.yml"),
            data: new shared.ArtifactCleanupWorkflow(),
        },
        {
            path: path.join(githubWorkflowsDir, "command-dispatch.yml"),
            data: wf.CommandDispatchWorkflow("command-dispatch", config),
        },
        {
            path: path.join(githubWorkflowsDir, "pull-request.yml"),
            data: wf.PullRequestWorkflow("pull-request", config),
        },
        {
            path: path.join(githubWorkflowsDir, "run-acceptance-tests.yml"),
            data: wf.RunAcceptanceTestsWorkflow("run-acceptance-tests", config),
        },
        {
            path: path.join(githubWorkflowsDir, "weekly-pulumi-update.yml"),
            data: wf.WeeklyPulumiUpdateWorkflow("weekly-pulumi-update", config),
        },
        {
            path: path.join(githubWorkflowsDir, "build.yml"),
            data: wf.BuildWorkflow("build", config),
        },
        {
            path: path.join(githubWorkflowsDir, "prerelease.yml"),
            data: wf.PrereleaseWorkflow("prerelease", config),
        },
        {
            path: path.join(githubWorkflowsDir, "release.yml"),
            data: wf.ReleaseWorkflow("release", config),
        },
        {
            path: ".goreleaser.prerelease.yml",
            data: new goreleaser.PulumiGoreleaserPreConfig(config),
        },
        {
            path: ".goreleaser.yml",
            data: new goreleaser.PulumiGoreleaserConfig(config),
        },
    ];
    // Add files that are unique to providers
    if (config.provider === "aws-native") {
        files.push({
            path: path.join(githubWorkflowsDir, "cf2pulumi-release.yml"),
            data: wf.Cf2PulumiReleaseWorkflow("cf2pulumi-release", config),
        }, {
            path: path.join(githubWorkflowsDir, "nightly-sdk-generation.yml"),
            data: wf.NightlySdkGenerationWorkflow("nightly-sdk-generation", config),
        });
    }
    if (config.provider === "azure-native") {
        files.push({
            path: path.join(githubWorkflowsDir, "arm2pulumi-release.yml"),
            data: wf.Arm2PulumiReleaseWorkflow("arm2pulumi-release", config),
        }, {
            path: path.join(githubWorkflowsDir, "arm2pulumi-coverage-report.yml"),
            data: wf.Arm2PulumiCoverageReportWorkflow("generate-coverage", config),
        }, {
            path: path.join(githubWorkflowsDir, "nightly-sdk-generation.yml"),
            data: wf.NightlySdkGenerationWorkflow("nightly-sdk-generation", config),
        });
    }
    if (config.provider === "google-native") {
        files.push({
            path: path.join(githubWorkflowsDir, "nightly-sdk-generation.yml"),
            data: wf.NightlySdkGenerationWorkflow("nightly-sdk-generation", config),
        });
    }
    return files;
};
exports.buildProviderFiles = buildProviderFiles;
//# sourceMappingURL=index.js.map