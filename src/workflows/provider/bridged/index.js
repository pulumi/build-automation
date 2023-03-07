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
exports.generateThirdpartyProviderFiles = exports.generateProviderFiles = void 0;
const path = __importStar(require("path"));
const lint = __importStar(require("../golangci"));
const goreleaser = __importStar(require("./goreleaser"));
const shared = __importStar(require("../shared-workflows"));
const wf = __importStar(require("./workflows"));
const makefiles_1 = require("../makefiles");
function generateProviderFiles(config) {
    const githubWorkflowsDir = path.join(path.join(".github", "workflows"));
    const files = [
        {
            path: path.join(githubWorkflowsDir, "run-acceptance-tests.yml"),
            data: wf.RunAcceptanceTestsWorkflow("run-acceptance-tests", config),
        },
        {
            path: path.join(githubWorkflowsDir, "pull-request.yml"),
            data: wf.PullRequestWorkflow("pull-request", config),
        },
        {
            path: path.join(githubWorkflowsDir, "master.yml"),
            data: wf.DefaultBranchWorkflow("master", config),
        },
        {
            path: path.join(githubWorkflowsDir, "main.yml"),
            data: wf.DefaultBranchWorkflow("main", config),
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
            path: path.join(githubWorkflowsDir, "artifact-cleanup.yml"),
            data: new shared.ArtifactCleanupWorkflow(),
        },
        {
            path: path.join(githubWorkflowsDir, "command-dispatch.yml"),
            data: wf.CommandDispatchWorkflow("command-dispatch", config),
        },
        {
            path: path.join(githubWorkflowsDir, "update-bridge.yml"),
            data: wf.UpdatePulumiTerraformBridgeWorkflow({
                providerDefaultBranch: config["provider-default-branch"],
            }),
        },
        {
            path: path.join(githubWorkflowsDir, "resync-build.yml"),
            data: wf.ResyncBuildWorkflow(config),
        },
        {
            path: path.join(githubWorkflowsDir, "update-upstream-provider.yml"),
            data: wf.UpdateUpstreamProviderWorkflow(config),
        },
        {
            path: path.join(githubWorkflowsDir, "community-moderation.yml"),
            data: wf.ModerationWorkflow("warn-codegen", config),
        },
        {
            path: ".goreleaser.prerelease.yml",
            data: new goreleaser.PulumiGoreleaserPreConfig(config),
        },
        {
            path: ".goreleaser.yml",
            data: new goreleaser.PulumiGoreleaserConfig(config),
        },
        {
            path: ".golangci.yml",
            data: new lint.PulumiGolangCIConfig(config["golangci-timeout"]),
        },
        ...(config["generate-nightly-test-workflow"]
            ? [
                {
                    path: path.join(githubWorkflowsDir, "nightly-test.yml"),
                    data: wf.NightlyCronWorkflow("cron", config),
                },
            ]
            : []),
    ];
    if (config.makeTemplate !== "none") {
        files.push({
            path: "Makefile",
            data: (0, makefiles_1.buildMakefile)(config),
        });
        if (config.makeTemplate === "bridged-v2") {
            files.push({
                path: ".version.pulumictl.txt",
                data: "v0.0.32",
            }, {
                path: ".version.javagen.txt",
                data: "v0.5.4",
            });
        }
    }
    return files;
}
exports.generateProviderFiles = generateProviderFiles;
function generateThirdpartyProviderFiles(config) {
    const githubWorkflowsDir = path.join(path.join(".github", "workflows"));
    const files = [
        {
            path: path.join(githubWorkflowsDir, "main.yml"),
            data: wf.ThirdPartyDefaultBranchWorkflow("main", config),
        },
        {
            path: path.join(githubWorkflowsDir, "release.yml"),
            data: wf.ThirdpartyReleaseWorkflow("release", config),
        },
    ];
    return files;
}
exports.generateThirdpartyProviderFiles = generateThirdpartyProviderFiles;
//# sourceMappingURL=index.js.map