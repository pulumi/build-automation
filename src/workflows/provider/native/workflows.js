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
exports.EmptyJob = exports.NightlySdkGeneration = exports.WeeklyPulumiUpdate = exports.Arm2PulumiCoverageReport = exports.Arm2PulumiRelease = exports.Cf2PulumiRelease = exports.DocsBuildDispatchJob = exports.TagSDKJob = exports.PublishJavaSDKJob = exports.PublishSDKJob = exports.PublishJob = exports.PublishPrereleaseJob = exports.LintKubernetesJob = exports.TeardownTestClusterJob = exports.BuildTestClusterJob = exports.TestsJob = exports.PrerequisitesJob = exports.BuildSdkJob = exports.Arm2PulumiReleaseWorkflow = exports.Arm2PulumiCoverageReportWorkflow = exports.Cf2PulumiReleaseWorkflow = exports.NightlySdkGenerationWorkflow = exports.WeeklyPulumiUpdateWorkflow = exports.ReleaseWorkflow = exports.PrereleaseWorkflow = exports.BuildWorkflow = exports.RunAcceptanceTestsWorkflow = exports.PullRequestWorkflow = exports.CommandDispatchWorkflow = void 0;
const steps = __importStar(require("./steps"));
const pythonVersion = "3.7";
const goVersion = "1.19.x";
const nodeVersion = "16.x";
const dotnetVersion = "3.1.301";
const javaVersion = "11";
const env = (opts) => Object.assign({
    GITHUB_TOKEN: "${{ secrets.PULUMI_BOT_TOKEN }}",
    PROVIDER: opts.provider,
    PULUMI_ACCESS_TOKEN: "${{ secrets.PULUMI_ACCESS_TOKEN }}",
    PULUMI_LOCAL_NUGET: "${{ github.workspace }}/nuget",
    NPM_TOKEN: "${{ secrets.NPM_TOKEN }}",
    NODE_AUTH_TOKEN: "${{ secrets.NPM_TOKEN }}",
    NUGET_PUBLISH_KEY: "${{ secrets.NUGET_PUBLISH_KEY }}",
    PYPI_PASSWORD: "${{ secrets.PYPI_PASSWORD }}",
    TRAVIS_OS_NAME: "linux",
    SLACK_WEBHOOK_URL: "${{ secrets.SLACK_WEBHOOK_URL }}",
    PULUMI_GO_DEP_ROOT: "${{ github.workspace }}/..",
    PUBLISH_REPO_USERNAME: "${{ secrets.OSSRH_USERNAME }}",
    PUBLISH_REPO_PASSWORD: "${{ secrets.OSSRH_PASSWORD }}",
    SIGNING_KEY_ID: "${{ secrets.JAVA_SIGNING_KEY_ID }}",
    SIGNING_KEY: "${{ secrets.JAVA_SIGNING_KEY }}",
    SIGNING_PASSWORD: "${{ secrets.JAVA_SIGNING_PASSWORD }}",
    GOVERSION: goVersion,
    NODEVERSION: nodeVersion,
    PYTHONVERSION: pythonVersion,
    DOTNETVERSION: dotnetVersion,
    JAVAVERSION: javaVersion,
}, opts.env);
// This section represents GHA files, sub-jobs are in a section below
// Creates command-dispatch.yml
function CommandDispatchWorkflow(name, opts) {
    return {
        name: name,
        on: {
            issue_comment: {
                types: ["created", "edited"],
            },
        },
        env: env(opts),
        jobs: {
            "command-dispatch-for-testing": new EmptyJob("command-dispatch-for-testing")
                .addConditional("${{ github.event.issue.pull_request }}")
                .addStep(steps.CheckoutRepoStep())
                .addStep(steps.CommandDispatchStep(`${opts.provider}`)),
        },
    };
}
exports.CommandDispatchWorkflow = CommandDispatchWorkflow;
// Creates pull-request.yml
function PullRequestWorkflow(name, opts) {
    return {
        name: name,
        on: {
            pull_request_target: {},
        },
        env: env(opts),
        jobs: {
            "comment-on-pr": new EmptyJob("comment-on-pr")
                .addConditional("github.event.pull_request.head.repo.full_name != github.repository")
                .addStep(steps.CheckoutRepoStep())
                .addStep(steps.CommentPRWithSlashCommandStep()),
        },
    };
}
exports.PullRequestWorkflow = PullRequestWorkflow;
// Creates run-acceptance-tests.yml
function RunAcceptanceTestsWorkflow(name, opts) {
    const workflow = {
        name: name,
        on: {
            repository_dispatch: {
                types: ["run-acceptance-tests-command"],
            },
            pull_request: {
                branches: ["master", "main"],
                "paths-ignore": ["CHANGELOG.md"],
            },
            workflow_dispatch: {},
        },
        env: Object.assign(Object.assign({}, env(opts)), { PR_COMMIT_SHA: "${{ github.event.client_payload.pull_request.head.sha }}" }),
        jobs: {
            "comment-notification": new EmptyJob("comment-notification")
                .addConditional("github.event_name == 'repository_dispatch'")
                .addStep(steps.CreateCommentsUrlStep())
                .addStep(steps.UpdatePRWithResultsStep()),
            prerequisites: new PrerequisitesJob("prerequisites", opts).addDispatchConditional(true),
            build_sdks: new BuildSdkJob("build_sdks", opts)
                .addDispatchConditional(true)
                .addRunsOn(opts.provider),
            test: new TestsJob("test", opts).addDispatchConditional(true),
            sentinel: new EmptyJob("sentinel")
                .addConditional("github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository")
                .addStep(steps.EchoSuccessStep())
                .addNeeds(calculateSentinelNeeds(opts.lint, opts.provider)),
        },
    };
    if (opts.provider === "kubernetes") {
        workflow.jobs = Object.assign(workflow.jobs, {
            "build-test-cluster": new BuildTestClusterJob("build-test-cluster", opts).addDispatchConditional(true),
        });
        workflow.jobs = Object.assign(workflow.jobs, {
            "destroy-test-cluster": new TeardownTestClusterJob("teardown-test-cluster", opts).addDispatchConditional(true),
        });
        workflow.jobs = Object.assign(workflow.jobs, {
            lint: new LintKubernetesJob("lint").addDispatchConditional(true),
        });
    }
    return workflow;
}
exports.RunAcceptanceTestsWorkflow = RunAcceptanceTestsWorkflow;
function calculateSentinelNeeds(requiresLint, provider) {
    const needs = ["test"];
    if (requiresLint) {
        needs.push("lint");
    }
    if (provider === "kubernetes") {
        needs.push("destroy-test-cluster");
    }
    return needs;
}
// Creates build.yml
function BuildWorkflow(name, opts) {
    const workflow = {
        name: name,
        on: {
            push: {
                branches: ["master", "main", "feature-**"],
                "paths-ignore": ["CHANGELOG.md"],
                "tags-ignore": ["v*", "sdk/*", "**"],
            },
            workflow_dispatch: {},
        },
        env: env(opts),
        jobs: {
            prerequisites: new PrerequisitesJob("prerequisites", opts),
            build_sdks: new BuildSdkJob("build_sdks", opts).addRunsOn(opts.provider),
            test: new TestsJob("test", opts),
            publish: new PublishPrereleaseJob("publish", opts),
            publish_sdk: new PublishSDKJob("publish_sdk"),
            publish_java_sdk: new PublishJavaSDKJob("publish_java_sdk"),
        },
    };
    if (opts.provider === "kubernetes") {
        workflow.jobs = Object.assign(workflow.jobs, {
            "build-test-cluster": new BuildTestClusterJob("build-test-cluster", opts),
        });
        workflow.jobs = Object.assign(workflow.jobs, {
            "destroy-test-cluster": new TeardownTestClusterJob("teardown-test-cluster", opts),
        });
        workflow.jobs = Object.assign(workflow.jobs, {
            lint: new LintKubernetesJob("lint").addDispatchConditional(true),
        });
    }
    return workflow;
}
exports.BuildWorkflow = BuildWorkflow;
// Creates prerelease.yml
function PrereleaseWorkflow(name, opts) {
    const workflow = {
        name: name,
        on: {
            push: {
                tags: ["v*.*.*-**"],
            },
        },
        env: Object.assign(Object.assign({}, env(opts)), { IS_PRERELEASE: true }),
        jobs: {
            prerequisites: new PrerequisitesJob("prerequisites", opts),
            build_sdks: new BuildSdkJob("build_sdks", opts),
            test: new TestsJob("test", opts),
            publish: new PublishPrereleaseJob("publish", opts),
            publish_sdk: new PublishSDKJob("publish_sdk"),
            publish_java_sdk: new PublishJavaSDKJob("publish_java_sdk"),
        },
    };
    if (opts.provider === "kubernetes") {
        workflow.jobs = Object.assign(workflow.jobs, {
            "build-test-cluster": new BuildTestClusterJob("build-test-cluster", opts),
        });
        workflow.jobs = Object.assign(workflow.jobs, {
            "destroy-test-cluster": new TeardownTestClusterJob("teardown-test-cluster", opts),
        });
    }
    return workflow;
}
exports.PrereleaseWorkflow = PrereleaseWorkflow;
// Creates release.yml
function ReleaseWorkflow(name, opts) {
    const workflow = {
        name: name,
        on: {
            push: {
                tags: ["v*.*.*", "!v*.*.*-**"],
            },
        },
        env: env(opts),
        jobs: {
            prerequisites: new PrerequisitesJob("prerequisites", opts),
            build_sdks: new BuildSdkJob("build_sdks", opts),
            test: new TestsJob("test", opts),
            publish: new PublishJob("publish", opts),
            publish_sdk: new PublishSDKJob("publish_sdks"),
            publish_java_sdk: new PublishJavaSDKJob("publish_java_sdk"),
            tag_sdk: new TagSDKJob("tag_sdk"),
            dispatch_docs_build: new DocsBuildDispatchJob("dispatch_docs_build"),
        },
    };
    if (opts.provider === "kubernetes") {
        workflow.jobs = Object.assign(workflow.jobs, {
            "build-test-cluster": new BuildTestClusterJob("build-test-cluster", opts),
        });
        workflow.jobs = Object.assign(workflow.jobs, {
            "destroy-test-cluster": new TeardownTestClusterJob("teardown-test-cluster", opts),
        });
    }
    return workflow;
}
exports.ReleaseWorkflow = ReleaseWorkflow;
// Creates weekly-pulumi-update.yml
function WeeklyPulumiUpdateWorkflow(name, opts) {
    const workflow = {
        name: name,
        on: {
            schedule: [
                {
                    cron: "35 12 * * 4",
                },
            ],
            workflow_dispatch: {},
        },
        env: env(opts),
        jobs: {
            "weekly-pulumi-update": new WeeklyPulumiUpdate("weekly-pulumi-update", opts),
        },
    };
    return workflow;
}
exports.WeeklyPulumiUpdateWorkflow = WeeklyPulumiUpdateWorkflow;
// creates nightly-sdk-generation.yml
function NightlySdkGenerationWorkflow(name, opts) {
    return {
        name: name,
        on: {
            schedule: [
                {
                    cron: "35 4 * * 1-5",
                },
            ],
            workflow_dispatch: {},
        },
        env: env(opts),
        jobs: {
            "generate-sdk": new NightlySdkGeneration("generate-sdk", opts),
        },
    };
}
exports.NightlySdkGenerationWorkflow = NightlySdkGenerationWorkflow;
// creates cf2pulumi-release.yml
function Cf2PulumiReleaseWorkflow(name, opts) {
    return {
        name: name,
        on: {
            push: {
                tags: ["v*.*.*", "!v*.*.*-**"],
            },
        },
        env: env(opts),
        jobs: {
            release: new Cf2PulumiRelease("release"),
        },
    };
}
exports.Cf2PulumiReleaseWorkflow = Cf2PulumiReleaseWorkflow;
// creates arm2pulumi-coverage-report.yml
function Arm2PulumiCoverageReportWorkflow(name, opts) {
    return {
        name: name,
        on: {
            schedule: [
                {
                    cron: "35 17 * * *",
                },
            ],
            workflow_dispatch: {},
        },
        env: env(opts),
        jobs: {
            "generate-coverage": new Arm2PulumiCoverageReport("coverage-report"),
        },
    };
}
exports.Arm2PulumiCoverageReportWorkflow = Arm2PulumiCoverageReportWorkflow;
// creates arm2pulumi-release.yml
function Arm2PulumiReleaseWorkflow(name, opts) {
    return {
        name: name,
        on: {
            push: {
                tags: ["v*.*.*", "!v*.*.*-**"],
            },
            workflow_dispatch: {
                inputs: {
                    version: {
                        description: "The version of the binary to deploy - do not include the pulumi prefix in the name.",
                        required: true,
                        type: "string",
                    },
                },
            },
        },
        env: env(opts),
        jobs: {
            release: new Arm2PulumiRelease("release"),
        },
    };
}
exports.Arm2PulumiReleaseWorkflow = Arm2PulumiReleaseWorkflow;
// This section represents sub-jobs that may be used in more than one workflow
class BuildSdkJob {
    constructor(name, opts) {
        this.needs = "prerequisites";
        this["runs-on"] = "ubuntu-latest";
        this.strategy = {
            "fail-fast": true,
            matrix: {
                language: [
                    "nodejs",
                    "python",
                    "dotnet",
                    "go",
                    "java"
                ],
            },
        };
        if (opts.provider === "azure-native") {
            this["runs-on"] =
                "${{ matrix.language == 'dotnet' && 'macos-11' || 'ubuntu-latest' }}";
        }
        this.name = name;
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallNodeJS(),
            steps.InstallDotNet(),
            steps.InstallPython(),
            steps.InstallJava(),
            steps.DownloadProviderBinaries(opts.provider, name),
            steps.UnTarProviderBinaries(opts.provider, name),
            steps.RestoreBinaryPerms(opts.provider, name),
            steps.CodegenDuringSDKBuild(opts.provider),
            steps.InitializeSubModules(opts.submodules),
            steps.GenerateSDKs(opts.provider),
            steps.BuildSDKs(opts.provider),
            steps.CheckCleanWorkTree(),
            steps.Porcelain(),
            steps.ZipSDKsStep(),
            steps.UploadSDKs(),
            steps.NotifySlack("Failure while building SDKs"),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
        Object.assign(this, { name });
    }
    addDispatchConditional(isWorkflowDispatch) {
        var _a, _b;
        if (isWorkflowDispatch) {
            this.if =
                "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository";
            this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.filter((step) => step.name !== "Checkout Repo");
            (_b = this.steps) === null || _b === void 0 ? void 0 : _b.unshift(steps.CheckoutRepoStepAtPR());
        }
        return this;
    }
    addRunsOn(provider) {
        if (provider === "azure-native") {
            this["runs-on"] =
                "${{ matrix.language == 'dotnet' && 'macos-11' || 'ubuntu-latest' }}";
        }
        return this;
    }
}
exports.BuildSdkJob = BuildSdkJob;
class PrerequisitesJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.name = name;
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallSchemaChecker(opts.provider),
            steps.BuildK8sgen(opts.provider),
            steps.PrepareOpenAPIFile(opts.provider),
            steps.InitializeSubModules(opts.submodules),
            steps.BuildCodegenBinaries(opts.provider),
            steps.BuildSchema(opts.provider),
            steps.MakeKubernetesProvider(opts.provider),
            steps.CheckSchemaChanges(opts.provider),
            steps.CommentSchemaChangesOnPR(opts.provider),
            steps.LabelIfNoBreakingChanges(opts.provider),
            steps.BuildProvider(opts.provider),
            steps.CheckCleanWorkTree(),
            steps.Porcelain(),
            steps.TarProviderBinaries(),
            steps.UploadProviderBinaries(),
            steps.TestProviderLibrary(),
            steps.NotifySlack("Failure in building provider prerequisites"),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
        Object.assign(this, { name });
    }
    addDispatchConditional(isWorkflowDispatch) {
        var _a, _b;
        if (isWorkflowDispatch) {
            this.if =
                "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository";
            this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.filter((step) => step.name !== "Checkout Repo");
            (_b = this.steps) === null || _b === void 0 ? void 0 : _b.unshift(steps.CheckoutRepoStepAtPR());
        }
        return this;
    }
}
exports.PrerequisitesJob = PrerequisitesJob;
class TestsJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = ["build_sdks"];
        this.strategy = {
            "fail-fast": true,
            matrix: {
                language: [
                    "nodejs",
                    "python",
                    "dotnet",
                    "go",
                    "java"
                ],
            },
        };
        if (opts.provider === "kubernetes") {
            this.needs = ["build_sdks", "build-test-cluster"];
        }
        this.name = name;
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallNodeJS(),
            steps.InstallDotNet(),
            steps.InstallPython(),
            steps.InstallJava(),
            steps.DownloadProviderBinaries(opts.provider, name),
            steps.UnTarProviderBinaries(opts.provider, name),
            steps.RestoreBinaryPerms(opts.provider, name),
            steps.DownloadSDKs(),
            steps.UnzipSDKs(),
            steps.UpdatePath(),
            steps.InstallNodeDeps(),
            steps.SetNugetSource(),
            steps.InstallPythonDeps(),
            steps.InstallSDKDeps(),
            steps.MakeKubeDir(opts.provider),
            steps.DownloadKubeconfig(opts.provider),
            steps.ConfigureAwsCredentialsForTests(opts.aws),
            steps.GoogleAuth(opts.gcp),
            steps.SetupGCloud(opts.gcp),
            steps.InstallKubectl(opts.provider),
            steps.InstallandConfigureHelm(opts.provider),
            steps.SetupGotestfmt(),
            steps.RunTests(opts.provider),
            steps.NotifySlack("Failure in SDK tests"),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
        Object.assign(this, { name });
    }
    addDispatchConditional(isWorkflowDispatch) {
        var _a, _b;
        if (isWorkflowDispatch) {
            this.if =
                "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository";
            this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.filter((step) => step.name !== "Checkout Repo");
            (_b = this.steps) === null || _b === void 0 ? void 0 : _b.unshift(steps.CheckoutRepoStepAtPR());
        }
        return this;
    }
}
exports.TestsJob = TestsJob;
class BuildTestClusterJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.name = name;
        this.outputs = {
            "stack-name": "${{ steps.stackname.outputs.stack-name }}",
        };
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallGo(),
            steps.InstallPulumiCli(),
            steps.InstallNodeJS(),
            steps.GoogleAuth(opts.gcp),
            steps.SetupGCloud(opts.gcp),
            steps.InstallKubectl(opts.provider),
            steps.LoginGoogleCloudRegistry(opts.provider),
            steps.SetStackName(opts.provider),
            steps.CreateTestCluster(opts.provider),
            steps.UploadKubernetesArtifacts(opts.provider),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
        Object.assign(this, { name });
    }
    addDispatchConditional(isWorkflowDispatch) {
        var _a, _b;
        if (isWorkflowDispatch) {
            this.if =
                "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository";
            this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.filter((step) => step.name !== "Checkout Repo");
            (_b = this.steps) === null || _b === void 0 ? void 0 : _b.unshift(steps.CheckoutRepoStepAtPR());
        }
        return this;
    }
}
exports.BuildTestClusterJob = BuildTestClusterJob;
class TeardownTestClusterJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.name = name;
        this.needs = ["build-test-cluster", "test"];
        this.if =
            "${{ always() }} && github.event.pull_request.head.repo.full_name == github.repository";
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallGo(),
            steps.InstallPulumiCli(),
            steps.InstallNodeJS(),
            steps.GoogleAuth(opts.gcp),
            steps.SetupGCloud(opts.gcp),
            steps.InstallKubectl(opts.provider),
            steps.LoginGoogleCloudRegistry(opts.provider),
            steps.DestroyTestCluster(opts.provider),
            steps.DeleteArtifact(opts.provider),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
        Object.assign(this, { name });
    }
    addDispatchConditional(isWorkflowDispatch) {
        var _a, _b;
        if (isWorkflowDispatch) {
            this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.filter((step) => step.name !== "Checkout Repo");
            (_b = this.steps) === null || _b === void 0 ? void 0 : _b.unshift(steps.CheckoutRepoStepAtPR());
        }
        return this;
    }
}
exports.TeardownTestClusterJob = TeardownTestClusterJob;
class LintKubernetesJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.steps = [steps.CheckoutRepoStep(), steps.InstallGo(), steps.GolangciLint()];
        this.name = name;
        Object.assign(this, { name });
    }
    addDispatchConditional(isWorkflowDispatch) {
        if (isWorkflowDispatch) {
            this.if =
                "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository";
            this.steps = this.steps.filter((step) => step.name !== "Checkout Repo");
            this.steps.unshift(steps.CheckoutRepoStepAtPR());
        }
        return this;
    }
}
exports.LintKubernetesJob = LintKubernetesJob;
class PublishPrereleaseJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "test";
        if (opts.provider === "azure-native" || opts.provider === "aws-native") {
            this["runs-on"] = "macos-11";
        }
        this.name = name;
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.ConfigureAwsCredentialsForPublish(),
            steps.SetPreReleaseVersion(),
            steps.RunGoReleaserWithArgs(`-p ${opts.parallel} -f .goreleaser.prerelease.yml --rm-dist --skip-validate --timeout ${opts.timeout}m0s`),
            steps.NotifySlack("Failure in publishing binaries"),
        ];
        Object.assign(this, { name });
    }
}
exports.PublishPrereleaseJob = PublishPrereleaseJob;
class PublishJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "test";
        this.name = name;
        Object.assign(this, { name });
        if (opts.provider === "azure-native" || opts.provider === "aws-native") {
            this["runs-on"] = "macos-11";
        }
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.ConfigureAwsCredentialsForPublish(),
            steps.SetPreReleaseVersion(),
            steps.RunGoReleaserWithArgs(`-p ${opts.parallel} release --rm-dist --timeout ${opts.timeout}m0s`),
            steps.NotifySlack("Failure in publishing binaries"),
        ];
    }
}
exports.PublishJob = PublishJob;
class PublishSDKJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "publish";
        this.name = name;
        Object.assign(this, { name });
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallNodeJS(),
            steps.InstallDotNet(),
            steps.InstallPython(),
            steps.DownloadSpecificSDKStep("python"),
            steps.UnzipSpecificSDKStep("python"),
            steps.DownloadSpecificSDKStep("dotnet"),
            steps.UnzipSpecificSDKStep("dotnet"),
            steps.DownloadSpecificSDKStep("nodejs"),
            steps.UnzipSpecificSDKStep("nodejs"),
            steps.InstallTwine(),
            steps.RunPublishSDK(),
            steps.NotifySlack("Failure in publishing SDK"),
        ];
    }
}
exports.PublishSDKJob = PublishSDKJob;
class PublishJavaSDKJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this["continue-on-error"] = true;
        this.needs = "publish";
        this.name = name;
        Object.assign(this, { name });
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallJava(),
            steps.DownloadSpecificSDKStep("java"),
            steps.UnzipSpecificSDKStep("java"),
            steps.SetPackageVersionToEnv(),
            steps.RunPublishJavaSDK(),
        ];
    }
}
exports.PublishJavaSDKJob = PublishJavaSDKJob;
class TagSDKJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "publish_sdk";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallPulumiCtl(),
            steps.TagSDKTag(),
        ];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.TagSDKJob = TagSDKJob;
class DocsBuildDispatchJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "tag_sdk";
        this.steps = [steps.InstallPulumiCtl(), steps.DispatchDocsBuildEvent()];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.DocsBuildDispatchJob = DocsBuildDispatchJob;
class Cf2PulumiRelease {
    constructor(name) {
        this["runs-on"] = "macos-11";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallPulumiCtl(),
            steps.InstallGo(goVersion),
            steps.RunGoReleaserWithArgs("-p 1 -f .goreleaser.cf2pulumi.yml release --rm-dist --timeout 60m0s"),
            steps.ChocolateyPackageDeployment(),
        ];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.Cf2PulumiRelease = Cf2PulumiRelease;
class Arm2PulumiRelease {
    constructor(name) {
        this["runs-on"] = "macos-11";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallPulumiCtl(),
            steps.InstallGo(goVersion),
            steps.SetVersionIfAvailable(),
            steps.RunGoReleaserWithArgs("-p 1 -f .goreleaser.arm2pulumi.yml release --rm-dist --timeout 60m0s"),
        ];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.Arm2PulumiRelease = Arm2PulumiRelease;
class Arm2PulumiCoverageReport {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallGo(goVersion),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.AzureLogin("azure-native"),
            steps.MakeClean(),
            steps.InitializeSubModules(true),
            steps.BuildCodegenBinaries("azure-native"),
            steps.MakeLocalGenerate(),
            steps.BuildProvider("azure-native"),
            steps.GenerateCoverageReport(),
            steps.TestResultsJSON(),
            steps.AwsCredentialsForArmCoverageReport(),
            steps.UploadArmCoverageToS3(),
        ];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.Arm2PulumiCoverageReport = Arm2PulumiCoverageReport;
class WeeklyPulumiUpdate {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallDotNet(),
            steps.InstallNodeJS(),
            steps.InstallPython(),
            steps.UpdatePulumi(opts.provider),
            steps.InitializeSubModules(opts.submodules),
            steps.ProviderWithPulumiUpgrade(opts.provider),
            steps.CreateUpdatePulumiPR(),
            // steps.SetPRAutoMerge(opts.provider),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
        Object.assign(this, { name });
    }
}
exports.WeeklyPulumiUpdate = WeeklyPulumiUpdate;
class NightlySdkGeneration {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.name = name;
        this.steps = [
            steps.CheckoutRepoStep(),
            // Pass the provider here as an option so that it can be skipped if not needed
            steps.CheckoutTagsStep(opts.provider),
            steps.InstallGo(goVersion),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.ConfigureAwsCredentialsForTests(opts.aws),
            steps.AzureLogin(opts.provider),
            steps.MakeClean(),
            steps.PrepareGitBranchForSdkGeneration(),
            steps.CommitEmptySDK(),
            steps.UpdateSubmodules(opts.provider),
            steps.MakeDiscovery(opts.provider),
            steps.BuildCodegenBinaries(opts.provider),
            steps.MakeLocalGenerate(),
            steps.SetGitSubmoduleCommitHash(opts.provider),
            steps.CommitAutomatedSDKUpdates(opts.provider),
            steps.PullRequestSdkGeneration(opts.provider),
            // steps.SetPRAutoMerge(opts.provider),
            steps.NotifySlack("Failure during automated SDK generation"),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
        Object.assign(this, { name });
    }
}
exports.NightlySdkGeneration = NightlySdkGeneration;
class EmptyJob {
    constructor(name, params) {
        this["runs-on"] = "ubuntu-latest";
        this.name = name;
        this.steps = [];
        Object.assign(this, { name }, params);
    }
    addStep(step) {
        this.steps.push(step);
        return this;
    }
    addStrategy(strategy) {
        this.strategy = strategy;
        return this;
    }
    addConditional(conditional) {
        this.if = conditional;
        return this;
    }
    addNeeds(name) {
        this.needs = name;
        return this;
    }
}
exports.EmptyJob = EmptyJob;
//# sourceMappingURL=workflows.js.map