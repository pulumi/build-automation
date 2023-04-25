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
exports.ThirdpartyReleaseWorkflow = exports.ThirdpartyPublishSDKJob = exports.ThirdpartyPublishJob = exports.ThirdPartyDefaultBranchWorkflow = exports.ThirdpartyBuildSdkJob = exports.ThirdpartyPrerequisitesJob = exports.ModerationWorkflow = exports.WarnCodegenJob = exports.GenerateCoverageDataJob = exports.LintSDKJob = exports.LintProviderJob = exports.PublishJavaSDKJob = exports.PublishSDKJob = exports.TagSDKJob = exports.DocsBuildJob = exports.PublishJob = exports.PublishPrereleaseJob = exports.TestsJob = exports.PrerequisitesJob = exports.BuildSdkJob = exports.EmptyJob = exports.CommandDispatchWorkflow = exports.UpdateUpstreamProviderWorkflow = exports.ResyncBuildWorkflow = exports.UpdatePulumiTerraformBridgeWorkflow = exports.PullRequestWorkflow = exports.RunAcceptanceTestsWorkflow = exports.PrereleaseWorkflow = exports.ReleaseWorkflow = exports.NightlyCronWorkflow = exports.DefaultBranchWorkflow = void 0;
const steps = __importStar(require("./steps"));
const pythonVersion = "3.9";
const goVersion = "1.19.x";
const nodeVersion = "16.x";
const dotnetVersion = "3.1.301";
const javaVersion = "11";
const env = (opts) => Object.assign({
    GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
    PROVIDER: opts.provider,
    PULUMI_ACCESS_TOKEN: "${{ secrets.PULUMI_ACCESS_TOKEN }}",
    PULUMI_API: "https://api.pulumi-staging.io",
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
function DefaultBranchWorkflow(name, opts) {
    const workflow = {
        name,
        on: {
            push: {
                branches: [name],
                "tags-ignore": ["v*", "sdk/*", "**"],
                "paths-ignore": ["**.md"],
            },
        },
        env: env(opts),
        jobs: {
            prerequisites: new PrerequisitesJob("prerequisites"),
            build_sdk: new BuildSdkJob("build_sdk"),
            test: new TestsJob("test", opts),
            publish: new PublishPrereleaseJob("publish", opts),
            publish_sdk: new PublishSDKJob("publish_sdk"),
            publish_java_sdk: new PublishJavaSDKJob("publish_java_sdk"),
            generate_coverage_data: new GenerateCoverageDataJob("generate_coverage_data"),
        },
    };
    if (opts.lint) {
        workflow.jobs = Object.assign(workflow.jobs, {
            lint: new LintProviderJob("lint"),
            lint_sdk: new LintSDKJob("lint-sdk", opts),
        });
    }
    return workflow;
}
exports.DefaultBranchWorkflow = DefaultBranchWorkflow;
function NightlyCronWorkflow(name, opts) {
    return {
        name: name,
        on: {
            schedule: [
                {
                    cron: "0 6 * * *",
                },
            ],
        },
        env: env(opts),
        jobs: {
            prerequisites: new PrerequisitesJob("prerequisites"),
            build_sdk: new BuildSdkJob("build_sdk"),
            test: new TestsJob("test", opts),
        },
    };
}
exports.NightlyCronWorkflow = NightlyCronWorkflow;
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
            prerequisites: new PrerequisitesJob("prerequisites"),
            build_sdk: new BuildSdkJob("build_sdk"),
            test: new TestsJob("test", opts),
            publish: new PublishJob("publish", opts),
            publish_sdk: new PublishSDKJob("publish_sdk"),
            publish_java_sdk: new PublishJavaSDKJob("publish_java_sdk"),
            tag_sdk: new TagSDKJob("tag_sdk"),
            create_docs_build: new DocsBuildJob("create_docs_build"),
        },
    };
    if (opts.lint) {
        workflow.jobs = Object.assign(workflow.jobs, {
            lint: new LintProviderJob("lint"),
            lint_sdk: new LintSDKJob("lint-sdk", opts),
        });
    }
    return workflow;
}
exports.ReleaseWorkflow = ReleaseWorkflow;
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
            prerequisites: new PrerequisitesJob("prerequisites"),
            build_sdk: new BuildSdkJob("build_sdk"),
            test: new TestsJob("test", opts),
            publish: new PublishPrereleaseJob("publish", opts),
            publish_sdk: new PublishSDKJob("publish_sdk"),
            publish_java_sdk: new PublishJavaSDKJob("publish_java_sdk"),
        },
    };
    if (opts.lint) {
        workflow.jobs = Object.assign(workflow.jobs, {
            lint: new LintProviderJob("lint"),
            lint_sdk: new LintSDKJob("lint-sdk", opts),
        });
    }
    return workflow;
}
exports.PrereleaseWorkflow = PrereleaseWorkflow;
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
        },
        env: Object.assign(Object.assign({}, env(opts)), { PR_COMMIT_SHA: "${{ github.event.client_payload.pull_request.head.sha }}" }),
        jobs: {
            "comment-notification": new EmptyJob("comment-notification")
                .addConditional("github.event_name == 'repository_dispatch'")
                .addStep(steps.CreateCommentsUrlStep())
                .addStep(steps.UpdatePRWithResultsStep()),
            prerequisites: new PrerequisitesJob("prerequisites").addDispatchConditional(true),
            build_sdk: new BuildSdkJob("build_sdk").addDispatchConditional(true),
            test: new TestsJob("test", opts).addDispatchConditional(true),
            sentinel: new EmptyJob("sentinel")
                .addConditional("github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository")
                .addStep(steps.EchoSuccessStep())
                .addNeeds(calculateSentinelNeeds(opts.lint)),
        },
    };
    if (opts.lint) {
        workflow.jobs = Object.assign(workflow.jobs, {
            lint: new LintProviderJob("lint").addDispatchConditional(true),
            lint_sdk: new LintSDKJob("lint-sdk", opts).addDispatchConditional(true),
        });
    }
    return workflow;
}
exports.RunAcceptanceTestsWorkflow = RunAcceptanceTestsWorkflow;
function calculateSentinelNeeds(requiresLint) {
    const needs = ["test"];
    if (requiresLint) {
        needs.push("lint", "lint_sdk");
    }
    return needs;
}
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
function UpdatePulumiTerraformBridgeWorkflow(args) {
    return {
        name: "Update pulumi-terraform-bridge",
        on: {
            workflow_dispatch: {
                inputs: {
                    bridge_version: {
                        required: true,
                        description: "The version of pulumi/pulumi-terraform-bridge to update to. Do not include the 'v' prefix. Must be major version 3.",
                        type: "string",
                    },
                    sdk_version: {
                        required: true,
                        description: "The version of pulumi/pulumi/sdk to update to. Do not include the 'v' prefix. Must be major version 3.",
                        type: "string",
                    },
                    automerge: {
                        description: "Mark created PR for auto-merging?",
                        required: true,
                        type: "boolean",
                        default: false,
                    },
                },
            },
        },
        env: {
            GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
            // If there are missing or extra mappings, they can not have been
            // introduced by updating the bridge, so for this workflow we'll
            // ignore mapping errors.
            PULUMI_EXTRA_MAPPING_ERROR: false,
            PULUMI_MISSING_MAPPING_ERROR: false,
        },
        jobs: {
            update_bridge: new EmptyJob("update-bridge")
                .addStep(steps.CheckoutRepoStep())
                .addStep(steps.CheckoutTagsStep())
                .addStep(steps.InstallGo())
                .addStep(steps.InstallPulumiCtl())
                .addStep(steps.InstallPulumiCli())
                .addStep(steps.InstallDotNet())
                .addStep(steps.InstallNodeJS())
                .addStep(steps.InstallPython())
                .addStep({
                name: "Update pulumi-terraform-bridge",
                run: "cd provider && go mod edit -require github.com/pulumi/pulumi-terraform-bridge/v3@v${{ github.event.inputs.bridge_version }} && go mod tidy",
            })
                .addStep({
                name: "Update Pulumi SDK (provider/go.mod)",
                run: "cd provider && go mod edit -require github.com/pulumi/pulumi/sdk/v3@v${{ github.event.inputs.sdk_version }} && go mod tidy",
            })
                .addStep({
                name: "Update Pulumi SDK (sdk/go.mod)",
                run: "cd sdk && go mod edit -require github.com/pulumi/pulumi/sdk/v3@v${{ github.event.inputs.sdk_version }} && go mod tidy",
            })
                .addStep(steps.RunCommand("make tfgen"))
                .addStep(steps.RunCommand("make build_sdks"))
                .addStep({
                name: "Create PR",
                id: "create-pr",
                uses: "peter-evans/create-pull-request@v3.12.0",
                with: {
                    "commit-message": "Update pulumi-terraform-bridge to v${{ github.event.inputs.bridge_version }}",
                    committer: "pulumi-bot <bot@pulumi.com>",
                    author: "pulumi-bot <bot@pulumi.com>",
                    branch: "pulumi-bot/bridge-v${{ github.event.inputs.bridge_version }}-${{ github.run_id}}",
                    base: args.providerDefaultBranch,
                    labels: "impact/no-changelog-required",
                    title: "Update pulumi-terraform-bridge to v${{ github.event.inputs.bridge_version }}",
                    body: "This pull request was generated automatically by the update-bridge workflow in this repository.",
                    "team-reviewers": "platform-integrations",
                    token: "${{ secrets.PULUMI_BOT_TOKEN }}",
                },
            })
                .addStep({
                if: "steps.create-pr.outputs.pull-request-operation == 'created' && github.event.inputs.automerge == 'true'",
                run: "gh pr merge --auto --squash ${{ steps.create-pr.outputs.pull-request-number }}",
            }),
        },
    };
}
exports.UpdatePulumiTerraformBridgeWorkflow = UpdatePulumiTerraformBridgeWorkflow;
function ResyncBuildWorkflow(opts) {
    const prStepOptions = {
        "commit-message": "Resync build for pulumi-${{ env.PROVIDER }}",
        committer: "pulumi-bot <bot@pulumi.com>",
        author: "pulumi-bot <bot@pulumi.com>",
        branch: "pulumi-bot/resync-${{ github.run_id}}",
        base: opts["provider-default-branch"],
        labels: "impact/no-changelog-required",
        title: "Fix up build for pulumi-${{ env.PROVIDER }}",
        body: "This pull request was generated automatically by the resync-build workflow in this repository.",
        "team-reviewers": "platform-integrations",
        token: "${{ secrets.PULUMI_BOT_TOKEN }}",
    };
    return {
        name: "Resync build",
        on: {
            workflow_dispatch: {
                inputs: {
                    automerge: {
                        description: "Mark created PR for auto-merging?",
                        required: true,
                        type: "boolean",
                        default: false,
                    },
                },
            },
        },
        env: Object.assign(Object.assign({}, env(opts)), { PULUMI_EXTRA_MAPPING_ERROR: opts["fail-on-extra-mapping"], PULUMI_MISSING_MAPPING_ERROR: opts["fail-on-missing-mapping"] }),
        jobs: {
            resync_build: new EmptyJob("resync-build")
                .addStep(steps.CheckoutRepoStep())
                .addStep(steps.CheckoutRepoStep({
                repo: "pulumi/ci-mgmt",
                path: "ci-mgmt",
            }))
                .addStep({
                id: "run-url",
                name: "Create URL to the run output",
                run: "echo ::set-output name=run-url::https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID",
            })
                .addStep(steps.CheckoutTagsStep())
                .addStep(steps.InstallGo())
                .addStep(steps.InstallPulumiCtl())
                .addStep(steps.InstallPulumiCli())
                .addStep(steps.InstallDotNet())
                .addStep(steps.InstallNodeJS())
                .addStep(steps.InstallPython())
                .addStep({
                name: "Sync with ci-mgmt",
                run: `cp -r ci-mgmt/provider-ci/providers/$PROVIDER/repo/. .`,
            })
                .addStep({
                name: "Remove ci-mgmt directory",
                run: "rm -rf ci-mgmt",
            })
                // Ensure .gitignore includes java stuff
                .addStep({
                name: "Required entries for gitignore",
                shell: "bash",
                run: `cat <<- EOF > $RUNNER_TEMP/gitignore
sdk/java/build
sdk/java/.gradle
sdk/java/gradle
sdk/java/gradlew
sdk/java/gradlew.bat
EOF`,
            })
                .addStep({
                name: "Adding missing lines to .gitignore",
                shell: "bash",
                run: "comm -23 <(sort $RUNNER_TEMP/gitignore) <(sort .gitignore) >> .gitignore",
            })
                .addStep({
                name: "Build",
                run: "make build",
            })
                .addStep({
                name: "Create PR (no linked issue)",
                uses: "peter-evans/create-pull-request@v3.12.0",
                with: Object.assign(Object.assign({}, prStepOptions), { body: "This pull request was generated automatically by the resync-build workflow in this repository." }),
            }),
        },
    };
}
exports.ResyncBuildWorkflow = ResyncBuildWorkflow;
function UpdateUpstreamProviderWorkflow(opts) {
    const prStepOptions = {
        "commit-message": "Update ${{ env.UPSTREAM_PROVIDER_REPO }} to v${{ github.event.inputs.version }}",
        committer: "pulumi-bot <bot@pulumi.com>",
        author: "pulumi-bot <bot@pulumi.com>",
        branch: "pulumi-bot/v${{ github.event.inputs.version }}-${{ github.run_id}}",
        base: opts["provider-default-branch"],
        // TODO: Add auto-merge.
        labels: "impact/no-changelog-required",
        title: "Update ${{ env.UPSTREAM_PROVIDER_REPO }} to v${{ github.event.inputs.version }}",
        body: "This pull request was generated automatically by the update-upstream-provider workflow in this repository.",
        "team-reviewers": "platform-integrations",
        token: "${{ secrets.PULUMI_BOT_TOKEN }}",
    };
    return {
        name: "Update upstream provider",
        on: {
            workflow_dispatch: {
                inputs: {
                    version: {
                        required: true,
                        description: "The new version of the upstream provider. Do not include the 'v' prefix.",
                        type: "string",
                    },
                    linked_issue_number: {
                        required: false,
                        description: "The issue number of a PR in this repository to which the generated pull request should be linked.",
                        type: "string",
                    },
                    automerge: {
                        description: "Mark created PR for auto-merging?",
                        required: true,
                        type: "boolean",
                        default: false,
                    },
                },
            },
        },
        env: Object.assign(Object.assign({}, env(opts)), { PULUMI_EXTRA_MAPPING_ERROR: opts["fail-on-extra-mapping"], PULUMI_MISSING_MAPPING_ERROR: opts["fail-on-missing-mapping"], UPSTREAM_PROVIDER_ORG: opts["upstream-provider-org"], UPSTREAM_PROVIDER_REPO: opts["upstream-provider-repo"], UPSTREAM_PROVIDER_MAJOR_VERSION: opts["upstream-provider-major-version"] }),
        jobs: {
            update_upstream_provider: new EmptyJob("update-upstream_provider")
                .addStep({
                id: "run-url",
                name: "Create URL to the run output",
                run: "echo ::set-output name=run-url::https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID",
            })
                .addStep(steps.CheckoutRepoStep())
                .addStep(steps.CheckoutTagsStep())
                .addStep(steps.InstallGo())
                .addStep(steps.InstallPulumiCtl())
                .addStep(steps.InstallPulumiCli())
                .addStep(steps.InstallDotNet())
                .addStep(steps.InstallNodeJS())
                .addStep(steps.InstallPython())
                .addStep({
                name: "Get upstream provider sha",
                run: 'echo "UPSTREAM_PROVIDER_SHA=$(curl -L https://api.github.com/repos/${{ env.UPSTREAM_PROVIDER_ORG }}/${{ env.UPSTREAM_PROVIDER_REPO }}/git/ref/tags/v${{ github.event.inputs.version }} | jq .object.sha -r)" >> $GITHUB_ENV',
            })
                .addStep({
                name: "Update shim/go.mod",
                if: "${{ hashFiles('provider/shim/go.mod') != '' }}",
                run: "cd provider/shim && go mod edit -require github.com/${{ env.UPSTREAM_PROVIDER_ORG }}/${{ env.UPSTREAM_PROVIDER_REPO }}${{ env.UPSTREAM_PROVIDER_MAJOR_VERSION }}@${{ env.UPSTREAM_PROVIDER_SHA }} && go mod tidy",
            })
                .addStep({
                name: "Update go.mod",
                run: "cd provider && go mod edit -require github.com/${{ env.UPSTREAM_PROVIDER_ORG }}/${{ env.UPSTREAM_PROVIDER_REPO }}${{ env.UPSTREAM_PROVIDER_MAJOR_VERSION }}@${{ env.UPSTREAM_PROVIDER_SHA }} && go mod tidy",
            })
                .addStep(steps.RunCommand("make tfgen"))
                .addStep(steps.RunCommand("make build_sdks"))
                .addStep({
                name: "Create PR (no linked issue)",
                uses: "peter-evans/create-pull-request@v3.12.0",
                if: "${{ !github.event.inputs.linked_issue_number }}",
                with: Object.assign(Object.assign({}, prStepOptions), { body: "This pull request was generated automatically by the update-upstream-provider workflow in this repository." }),
            })
                // Identical to the previous step, except that it links to the
                // issue if one is suppled:
                .addStep({
                name: "Create PR (with linked issue)",
                uses: "peter-evans/create-pull-request@v3.12.0",
                if: "${{ github.event.inputs.linked_issue_number }}",
                with: Object.assign(Object.assign({}, prStepOptions), { body: "Fixes #${{ github.event.inputs.linked_issue_number }}\n\nThis pull request was generated automatically by the update-upstream-provider workflow in this repository." }),
            })
                .addStep({
                name: "Comment on failed attempt",
                if: "${{ failure() && github.event.inputs.linked_issue_number }}",
                uses: "jungwinter/comment@v1",
                with: {
                    type: "create",
                    issue_number: "${{ github.event.inputs.linked_issue_number }}",
                    token: "${{ secrets.PULUMI_BOT_TOKEN }}",
                    body: "Failed to automatically update upstream provider (probably because of new resources or data sources, which must be mapped manually).\n\nFor more details, see: ${{ steps.run-url.outputs.run-url }}",
                },
            }),
        },
    };
}
exports.UpdateUpstreamProviderWorkflow = UpdateUpstreamProviderWorkflow;
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
                .addStep(steps.CheckoutRepoStep())
                .addStep(steps.CommandDispatchStep(`${opts.provider}`)),
        },
    };
}
exports.CommandDispatchWorkflow = CommandDispatchWorkflow;
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
class BuildSdkJob {
    constructor(name) {
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
                    //"java"
                ],
            },
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
            steps.DownloadProviderStep(),
            steps.UnzipProviderBinariesStep(),
            steps.InstallPlugins(),
            steps.SetProvidersToPATH(),
            steps.SetPackageVersionToEnv(),
            steps.BuildSdksStep(),
            steps.CheckCleanWorkTreeStep(),
            steps.ZipSDKsStep(),
            steps.UploadSdkStep(),
            steps.NotifySlack("Failure in building ${{ matrix.language }} sdk"),
        ];
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
exports.BuildSdkJob = BuildSdkJob;
class PrerequisitesJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallSchemaChecker(),
            steps.BuildBinariesStep(),
            steps.CheckSchemaChanges(),
            steps.CommentSchemaChangesOnPR(),
            steps.ZipProviderBinariesStep(),
            steps.UploadProviderBinariesStep(),
            steps.NotifySlack("Failure in building provider prerequisites"),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
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
exports.PrerequisitesJob = PrerequisitesJob;
class TestsJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "build_sdk";
        this.strategy = {
            "fail-fast": true,
            matrix: {
                language: [
                    "nodejs",
                    "python",
                    "dotnet",
                    "go",
                    // "java"
                ],
            },
        };
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
            steps.DownloadProviderStep(),
            steps.UnzipProviderBinariesStep(),
            steps.SetNugetSource(),
            steps.DownloadSDKsStep(),
            steps.UnzipSDKsStep(),
            steps.SetProvidersToPATH(),
            steps.InstallPythonDeps(),
            steps.RunDockerComposeStep(opts.docker),
            steps.RunSetUpScriptStep(opts["setup-script"]),
            steps.ConfigureAwsCredentialsForTests(opts.aws),
            steps.GoogleAuth(opts.gcp),
            steps.SetupGCloud(opts.gcp),
            steps.InstallSDKDeps(),
            steps.SetupGotestfmt(),
            steps.RunTests(),
            steps.NotifySlack("Failure in running ${{ matrix.language }} tests"),
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
class PublishPrereleaseJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "test";
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
class DocsBuildJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "tag_sdk";
        this.steps = [steps.InstallPulumiCtl(), steps.DispatchDocsBuildEvent()];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.DocsBuildJob = DocsBuildJob;
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
class PublishSDKJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "publish";
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
            steps.RunCommand("python -m pip install pip twine"),
            steps.RunPublishSDK(),
            steps.NotifySlack("Failure in publishing SDK"),
        ];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.PublishSDKJob = PublishSDKJob;
class PublishJavaSDKJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this["continue-on-error"] = true;
        this.needs = "publish";
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
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.PublishJavaSDKJob = PublishJavaSDKJob;
class LintProviderJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.container = "golangci/golangci-lint:latest";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.RunCommand("make lint_provider"),
            steps.NotifySlack("Failure in linting provider"),
        ];
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
exports.LintProviderJob = LintProviderJob;
class LintSDKJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "build_sdk";
        this.container = "golangci/golangci-lint:latest";
        this.name = name;
        Object.assign(this, { name });
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.RunCommand(`cd sdk/go/${opts.provider} && golangci-lint run -c ../../../.golangci.yml`),
            steps.NotifySlack("Failure in linting go sdk"),
        ];
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
exports.LintSDKJob = LintSDKJob;
class GenerateCoverageDataJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this["continue-on-error"] = true;
        this.needs = "prerequisites";
        this.env = {
            COVERAGE_OUTPUT_DIR: "${{ secrets.COVERAGE_OUTPUT_DIR }}",
        };
        this.steps = [
            // Setting up prerequisites needed to run the coverage tracker
            steps.CheckoutRepoStep(),
            steps.ConfigureAwsCredentialsForCoverageDataUpload(),
            steps.CheckoutScriptsRepoStep(),
            steps.CheckoutTagsStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallSchemaChecker(),
            // Generating and summarizing coverage data
            steps.EchoCoverageOutputDirStep(),
            steps.GenerateCoverageDataStep(),
            steps.PrintCoverageDataStep(),
            // Uploading coverage data
            steps.UploadCoverageDataStep(),
        ];
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
exports.GenerateCoverageDataJob = GenerateCoverageDataJob;
class WarnCodegenJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.SchemaFileChanged(),
            steps.SdkFilesChanged(),
            steps.SendCodegenWarnCommentPr(),
        ];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.WarnCodegenJob = WarnCodegenJob;
function ModerationWorkflow(name, opts) {
    const workflow = {
        name,
        on: {
            pull_request_target: {
                branches: ["main", "master"],
                types: ["opened"],
            },
        },
        env: {
            GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
        },
        jobs: {
            warn_codegen: new WarnCodegenJob("warn_codegen"),
        },
    };
    return workflow;
}
exports.ModerationWorkflow = ModerationWorkflow;
// --- Third party provider workflows & jobs
const thirdPartyEnv = (opts) => Object.assign({
    GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
    NODE_AUTH_TOKEN: "${{ secrets.NPM_TOKEN }}",
    NPM_TOKEN: "${{ secrets.NPM_TOKEN }}",
    NUGET_PUBLISH_KEY: "${{ secrets.NUGET_PUBLISH_KEY }}",
    PROVIDER: opts.provider,
    PULUMI_GO_DEP_ROOT: "${{ github.workspace }}/..",
    PULUMI_LOCAL_NUGET: "${{ github.workspace }}/nuget",
    PYPI_PASSWORD: "${{ secrets.PYPI_PASSWORD }}",
    TRAVIS_OS_NAME: "linux",
    GOVERSION: goVersion,
    NODEVERSION: nodeVersion,
    PYTHONVERSION: pythonVersion,
    DOTNETVERSION: dotnetVersion,
    JAVAVERSION: javaVersion,
}, opts.env);
class ThirdpartyPrerequisitesJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.steps = [
            steps.CheckoutRepoStep({
                fetchDepth: 0,
            }),
            steps.CheckoutScriptsRepoStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.BuildBinariesStep(),
            steps.ZipProviderBinariesStep(),
            steps.UploadProviderBinariesStep(),
        ].filter((step) => step.uses !== undefined || step.run !== undefined);
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
exports.ThirdpartyPrerequisitesJob = ThirdpartyPrerequisitesJob;
class ThirdpartyBuildSdkJob {
    constructor(name) {
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
                    //"java"
                ],
            },
        };
        this.steps = [
            steps.CheckoutRepoStep({
                fetchDepth: 0,
            }),
            steps.CheckoutScriptsRepoStep(),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.InstallNodeJS(),
            steps.InstallDotNet(),
            steps.InstallPython(),
            steps.DownloadProviderStep(),
            steps.UnzipProviderBinariesStep(),
            steps.InstallPlugins(),
            steps.SetProvidersToPATH(),
            steps.SetPackageVersionToEnv(),
            steps.BuildSdksStep(),
            steps.CheckCleanWorkTreeStep(),
            steps.ZipSDKsStep(),
            steps.UploadSdkStep(),
        ];
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
exports.ThirdpartyBuildSdkJob = ThirdpartyBuildSdkJob;
function ThirdPartyDefaultBranchWorkflow(name, opts) {
    const workflow = {
        name,
        on: {
            push: {
                branches: [name],
                "tags-ignore": ["v*", "sdk/*", "**"],
                "paths-ignore": ["**.md"],
            },
            pull_request: {
                branches: [name],
                "paths-ignore": ["**.md"],
            },
        },
        env: thirdPartyEnv(opts),
        jobs: {
            prerequisites: new ThirdpartyPrerequisitesJob("prerequisites"),
            build_sdk: new ThirdpartyBuildSdkJob("build_sdk"),
        },
    };
    if (opts.lint) {
        workflow.jobs = Object.assign(workflow.jobs, {
            lint: new LintProviderJob("lint"),
            lint_sdk: new LintSDKJob("lint-sdk", opts),
        });
    }
    return workflow;
}
exports.ThirdPartyDefaultBranchWorkflow = ThirdPartyDefaultBranchWorkflow;
class ThirdpartyPublishJob {
    constructor(name, opts) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "test";
        this.name = name;
        Object.assign(this, { name });
        this.steps = [
            steps.CheckoutRepoStep({
                fetchDepth: 0,
            }),
            steps.InstallGo(),
            steps.InstallPulumiCtl(),
            steps.InstallPulumiCli(),
            steps.ConfigureAwsCredentialsForPublish(),
            steps.SetPreReleaseVersion(),
            steps.RunGoReleaserWithArgs(`-p ${opts.parallel} release --rm-dist --timeout ${opts.timeout}m0s`),
        ];
    }
}
exports.ThirdpartyPublishJob = ThirdpartyPublishJob;
class ThirdpartyPublishSDKJob {
    constructor(name) {
        this["runs-on"] = "ubuntu-latest";
        this.needs = "publish";
        this.steps = [
            steps.CheckoutRepoStep({
                fetchDepth: 0,
            }),
            steps.CheckoutScriptsRepoStep(),
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
            steps.RunCommand("python -m pip install pip twine"),
            steps.RunPublishSDK(),
        ];
        this.name = name;
        Object.assign(this, { name });
    }
}
exports.ThirdpartyPublishSDKJob = ThirdpartyPublishSDKJob;
function ThirdpartyReleaseWorkflow(name, opts) {
    const workflow = {
        name: name,
        on: {
            push: {
                tags: ["v*.*.*", "!v*.*.*-**"],
            },
        },
        env: thirdPartyEnv(opts),
        jobs: {
            prerequisites: new ThirdpartyPrerequisitesJob("prerequisites"),
            build_sdk: new ThirdpartyBuildSdkJob("build_sdk"),
            publish: new ThirdpartyPublishJob("publish", opts),
            publish_sdk: new ThirdpartyPublishSDKJob("publish_sdk"),
        },
    };
    if (opts.lint) {
        workflow.jobs = Object.assign(workflow.jobs, {
            lint: new LintProviderJob("lint"),
            lint_sdk: new LintSDKJob("lint-sdk", opts),
        });
    }
    return workflow;
}
exports.ThirdpartyReleaseWorkflow = ThirdpartyReleaseWorkflow;
//# sourceMappingURL=workflows.js.map