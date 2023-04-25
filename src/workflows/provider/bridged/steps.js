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
exports.CommitChanges = exports.UpdatePulumiTerraformBridgeDependency = exports.TagSDKTag = exports.RunPublishJavaSDK = exports.RunPublishSDK = exports.RunCommand = exports.RunGoReleaserWithArgs = exports.SetPreReleaseVersion = exports.RunTests = exports.SetPackageVersionToEnv = exports.SetProvidersToPATH = exports.SetNugetSource = exports.CheckCleanWorkTreeStep = exports.NotifySlack = exports.ZipSDKsStep = exports.ZipProviderBinariesStep = exports.UnzipSpecificSDKStep = exports.UnzipSDKsStep = exports.UnzipProviderBinariesStep = exports.DownloadSpecificSDKStep = exports.DownloadSDKsStep = exports.DownloadProviderStep = exports.UploadSdkStep = exports.UploadProviderBinariesStep = exports.BuildSdksStep = exports.BuildBinariesStep = exports.RunSetUpScriptStep = exports.RunDockerComposeStep = exports.PrintPulumiCliVersion = exports.InstallPulumiCli = exports.DispatchDocsBuildEvent = exports.InstallSchemaChecker = exports.InstallPulumiCtl = exports.InstallSDKDeps = exports.InstallPythonDeps = exports.InstallPlugins = exports.InstallPython = exports.InstallJava = exports.InstallDotNet = exports.InstallNodeJS = exports.InstallGo = exports.ConfigureAwsCredentialsForCoverageDataUpload = exports.ConfigureAwsCredentialsForPublish = exports.ConfigureAwsCredentialsForTests = exports.SetupGCloud = exports.GoogleAuth = exports.CheckoutTagsStep = exports.CheckoutScriptsRepoStep = exports.CheckoutRepoStepAtPR = exports.CheckoutRepoStep = void 0;
exports.SendCodegenWarnCommentPr = exports.SdkFilesChanged = exports.SchemaFileChanged = exports.SetupGotestfmt = exports.UploadCoverageDataStep = exports.PrintCoverageDataStep = exports.GenerateCoverageDataStep = exports.EchoCoverageOutputDirStep = exports.CommentPRWithSlashCommandStep = exports.UpdatePRWithResultsStep = exports.EchoSuccessStep = exports.CreateCommentsUrlStep = exports.CommandDispatchStep = exports.CommentSchemaChangesOnPR = exports.CheckSchemaChanges = exports.PullRequest = void 0;
const action = __importStar(require("../action-versions"));
function CheckoutRepoStep(args) {
    if (args) {
        const checkOutWith = {};
        if (args.repo) {
            checkOutWith["repository"] = args.repo;
        }
        if (args.path) {
            checkOutWith["path"] = args.path;
        }
        if (args.fetchDepth !== undefined) {
            checkOutWith["fetch-depth"] = args.fetchDepth;
        }
        return {
            name: "Checkout repo",
            uses: action.checkout,
            with: checkOutWith,
        };
    }
    return {
        name: "Checkout Repo",
        uses: action.checkout,
    };
}
exports.CheckoutRepoStep = CheckoutRepoStep;
function CheckoutRepoStepAtPR() {
    return {
        name: "Checkout Repo",
        uses: action.checkout,
        with: {
            ref: "${{ env.PR_COMMIT_SHA }}",
        },
    };
}
exports.CheckoutRepoStepAtPR = CheckoutRepoStepAtPR;
function CheckoutScriptsRepoStep() {
    return {
        name: "Checkout Scripts Repo",
        uses: action.checkout,
        with: {
            path: "ci-scripts",
            repository: "pulumi/scripts",
        },
    };
}
exports.CheckoutScriptsRepoStep = CheckoutScriptsRepoStep;
function CheckoutTagsStep() {
    return {
        name: "Unshallow clone for tags",
        run: "git fetch --prune --unshallow --tags",
    };
}
exports.CheckoutTagsStep = CheckoutTagsStep;
function GoogleAuth(requiresGcp) {
    if (requiresGcp) {
        return {
            name: "Authenticate to Google Cloud",
            uses: action.googleAuth,
            with: {
                workload_identity_provider: "projects/${{ env.GOOGLE_PROJECT_NUMBER }}/locations/global/workloadIdentityPools/${{ env.GOOGLE_CI_WORKLOAD_IDENTITY_POOL }}/providers/${{ env.GOOGLE_CI_WORKLOAD_IDENTITY_PROVIDER }}",
                service_account: "${{ env.GOOGLE_CI_SERVICE_ACCOUNT_EMAIL }}",
            },
        };
    }
    return {};
}
exports.GoogleAuth = GoogleAuth;
function SetupGCloud(requiresGcp) {
    if (requiresGcp) {
        return {
            name: "Setup gcloud auth",
            uses: action.setupGcloud,
            with: {
                install_components: "gke-gcloud-auth-plugin",
            },
        };
    }
    return {};
}
exports.SetupGCloud = SetupGCloud;
function ConfigureAwsCredentialsForTests(requiresAws) {
    if (requiresAws) {
        return {
            name: "Configure AWS Credentials",
            uses: action.configureAwsCredentials,
            with: {
                "aws-access-key-id": "${{ secrets.AWS_ACCESS_KEY_ID }}",
                "aws-region": "${{ env.AWS_REGION }}",
                "aws-secret-access-key": "${{ secrets.AWS_SECRET_ACCESS_KEY }}",
                "role-duration-seconds": 3600,
                "role-session-name": "${{ env.PROVIDER }}@githubActions",
                "role-to-assume": "${{ secrets.AWS_CI_ROLE_ARN }}",
            },
        };
    }
    return {};
}
exports.ConfigureAwsCredentialsForTests = ConfigureAwsCredentialsForTests;
function ConfigureAwsCredentialsForPublish() {
    return {
        name: "Configure AWS Credentials",
        uses: action.configureAwsCredentials,
        with: {
            "aws-access-key-id": "${{ secrets.AWS_ACCESS_KEY_ID }}",
            "aws-region": "us-east-2",
            "aws-secret-access-key": "${{ secrets.AWS_SECRET_ACCESS_KEY }}",
            "role-duration-seconds": 7200,
            "role-session-name": "${{ env.PROVIDER }}@githubActions",
            "role-external-id": "upload-pulumi-release",
            "role-to-assume": "${{ secrets.AWS_UPLOAD_ROLE_ARN }}",
        },
    };
}
exports.ConfigureAwsCredentialsForPublish = ConfigureAwsCredentialsForPublish;
function ConfigureAwsCredentialsForCoverageDataUpload() {
    return {
        name: "Configure AWS Credentials",
        uses: action.configureAwsCredentials,
        with: {
            "aws-access-key-id": "${{ secrets.AWS_CORP_S3_UPLOAD_ACCESS_KEY_ID }}",
            "aws-region": "us-west-2",
            "aws-secret-access-key": "${{ secrets.AWS_CORP_S3_UPLOAD_SECRET_ACCESS_KEY }}",
        },
    };
}
exports.ConfigureAwsCredentialsForCoverageDataUpload = ConfigureAwsCredentialsForCoverageDataUpload;
function InstallGo(version) {
    return {
        name: "Install Go",
        uses: action.setupGo,
        with: {
            "go-version": version || "${{ env.GOVERSION }}",
        },
    };
}
exports.InstallGo = InstallGo;
function InstallNodeJS(version) {
    return {
        name: "Setup Node",
        uses: action.setupNode,
        with: {
            "node-version": version || "${{ env.NODEVERSION }}",
            "registry-url": "https://registry.npmjs.org",
        },
    };
}
exports.InstallNodeJS = InstallNodeJS;
function InstallDotNet(version) {
    return {
        name: "Setup DotNet",
        uses: action.setupDotNet,
        with: {
            "dotnet-version": version || "${{ env.DOTNETVERSION }}",
        },
    };
}
exports.InstallDotNet = InstallDotNet;
function InstallJava(version) {
    return {
        name: "Setup Java",
        uses: action.setupJava,
        with: {
            "java-version": version || "${{ env.JAVAVERSION }}",
            distribution: "temurin",
            cache: "gradle",
        },
    };
}
exports.InstallJava = InstallJava;
function InstallPython(version) {
    return {
        name: "Setup Python",
        uses: action.setupPython,
        with: {
            "python-version": version || "${{ env.PYTHONVERSION }}",
        },
    };
}
exports.InstallPython = InstallPython;
function InstallPlugins() {
    return {
        name: "Install plugins",
        run: "make install_plugins",
    };
}
exports.InstallPlugins = InstallPlugins;
function InstallPythonDeps() {
    return {
        name: "Install Python deps",
        run: "pip3 install virtualenv==20.0.23\n" + "pip3 install pipenv",
    };
}
exports.InstallPythonDeps = InstallPythonDeps;
function InstallSDKDeps() {
    return {
        name: "Install dependencies",
        run: "make install_${{ matrix.language}}_sdk",
    };
}
exports.InstallSDKDeps = InstallSDKDeps;
function InstallPulumiCtl() {
    return {
        name: "Install pulumictl",
        uses: action.installGhRelease,
        with: {
            repo: "pulumi/pulumictl",
        },
    };
}
exports.InstallPulumiCtl = InstallPulumiCtl;
function InstallSchemaChecker() {
    return {
        if: "github.event_name == 'pull_request'",
        name: "Install Schema Tools",
        uses: action.installGhRelease,
        with: {
            repo: "mikhailshilkov/schema-tools",
        },
    };
}
exports.InstallSchemaChecker = InstallSchemaChecker;
function DispatchDocsBuildEvent() {
    return {
        name: "Dispatch Event",
        run: "pulumictl create docs-build pulumi-${{ env.PROVIDER }} ${GITHUB_REF#refs/tags/}",
        env: {
            GITHUB_TOKEN: "${{ secrets.PULUMI_BOT_TOKEN }}",
        },
    };
}
exports.DispatchDocsBuildEvent = DispatchDocsBuildEvent;
function InstallPulumiCli(version) {
    const step = {
        name: "Install Pulumi CLI",
        uses: action.installPulumiCli,
    };
    if (version) {
        step.with = {
            "pulumi-version": version,
        };
    }
    return step;
}
exports.InstallPulumiCli = InstallPulumiCli;
function PrintPulumiCliVersion() {
    return {
        name: "Print CLI version",
        run: 'echo "Currently Pulumi $(pulumi version) is installed"',
    };
}
exports.PrintPulumiCliVersion = PrintPulumiCliVersion;
function RunDockerComposeStep(required) {
    if (required) {
        return {
            name: "Run docker-compose",
            run: "docker-compose -f testing/docker-compose.yml up --build -d",
        };
    }
    return {};
}
exports.RunDockerComposeStep = RunDockerComposeStep;
function RunSetUpScriptStep(setupScript) {
    if (setupScript) {
        return {
            name: "Run setup script",
            run: `${setupScript}`,
        };
    }
    return {};
}
exports.RunSetUpScriptStep = RunSetUpScriptStep;
function BuildBinariesStep() {
    return {
        name: "Build tfgen & provider binaries",
        run: "make provider",
    };
}
exports.BuildBinariesStep = BuildBinariesStep;
function BuildSdksStep() {
    return {
        name: "Build SDK",
        run: "make build_${{ matrix.language }}",
    };
}
exports.BuildSdksStep = BuildSdksStep;
function UploadProviderBinariesStep() {
    return {
        name: "Upload artifacts",
        uses: action.uploadArtifact,
        with: {
            name: "${{ env.PROVIDER }}-provider.tar.gz",
            path: "${{ github.workspace }}/bin/provider.tar.gz",
        },
    };
}
exports.UploadProviderBinariesStep = UploadProviderBinariesStep;
function UploadSdkStep() {
    return {
        name: "Upload artifacts",
        uses: action.uploadArtifact,
        with: {
            name: "${{ matrix.language  }}-sdk.tar.gz",
            path: "${{ github.workspace}}/sdk/${{ matrix.language }}.tar.gz",
        },
    };
}
exports.UploadSdkStep = UploadSdkStep;
function DownloadProviderStep() {
    return {
        name: "Download provider + tfgen binaries",
        uses: action.downloadArtifact,
        with: {
            name: "${{ env.PROVIDER }}-provider.tar.gz",
            path: "${{ github.workspace }}/bin",
        },
    };
}
exports.DownloadProviderStep = DownloadProviderStep;
function DownloadSDKsStep() {
    return {
        name: "Download SDK",
        uses: action.downloadArtifact,
        with: {
            name: "${{ matrix.language }}-sdk.tar.gz",
            path: "${{ github.workspace}}/sdk/",
        },
    };
}
exports.DownloadSDKsStep = DownloadSDKsStep;
function DownloadSpecificSDKStep(name) {
    return {
        name: `Download ${name} SDK`,
        uses: action.downloadArtifact,
        with: {
            name: `${name}-sdk.tar.gz`,
            path: "${{ github.workspace}}/sdk/",
        },
    };
}
exports.DownloadSpecificSDKStep = DownloadSpecificSDKStep;
function UnzipProviderBinariesStep() {
    return {
        name: "Untar provider binaries",
        run: "tar -zxf ${{ github.workspace }}/bin/provider.tar.gz -C ${{ github.workspace}}/bin\n" +
            'find ${{ github.workspace }} -name "pulumi-*-${{ env.PROVIDER }}" -print -exec chmod +x {} \\;',
    };
}
exports.UnzipProviderBinariesStep = UnzipProviderBinariesStep;
function UnzipSDKsStep() {
    return {
        name: "Uncompress SDK folder",
        run: "tar -zxf ${{ github.workspace }}/sdk/${{ matrix.language }}.tar.gz -C ${{ github.workspace }}/sdk/${{ matrix.language }}",
    };
}
exports.UnzipSDKsStep = UnzipSDKsStep;
function UnzipSpecificSDKStep(name) {
    return {
        name: `Uncompress ${name} SDK`,
        run: `tar -zxf \${{github.workspace}}/sdk/${name}.tar.gz -C \${{github.workspace}}/sdk/${name}`,
    };
}
exports.UnzipSpecificSDKStep = UnzipSpecificSDKStep;
function ZipProviderBinariesStep() {
    return {
        name: "Tar provider binaries",
        run: "tar -zcf ${{ github.workspace }}/bin/provider.tar.gz -C ${{ github.workspace }}/bin/ pulumi-resource-${{ env.PROVIDER }} pulumi-tfgen-${{ env.PROVIDER }}",
    };
}
exports.ZipProviderBinariesStep = ZipProviderBinariesStep;
function ZipSDKsStep() {
    return {
        name: "Compress SDK folder",
        run: "tar -zcf sdk/${{ matrix.language }}.tar.gz -C sdk/${{ matrix.language }} .",
    };
}
exports.ZipSDKsStep = ZipSDKsStep;
function NotifySlack(name) {
    return {
        if: "failure() && github.event_name == 'push'",
        name: "Notify Slack",
        uses: action.notifySlack,
        with: {
            author_name: `${name}`,
            fields: "repo,commit,author,action",
            status: "${{ job.status }}",
        },
    };
}
exports.NotifySlack = NotifySlack;
function CheckCleanWorkTreeStep() {
    return {
        name: "Check worktree clean",
        run: "./ci-scripts/ci/check-worktree-is-clean",
    };
}
exports.CheckCleanWorkTreeStep = CheckCleanWorkTreeStep;
function SetNugetSource() {
    return {
        run: "dotnet nuget add source ${{ github.workspace }}/nuget",
    };
}
exports.SetNugetSource = SetNugetSource;
function SetProvidersToPATH() {
    return {
        name: "Update path",
        run: 'echo "${{ github.workspace }}/bin" >> $GITHUB_PATH',
    };
}
exports.SetProvidersToPATH = SetProvidersToPATH;
function SetPackageVersionToEnv() {
    return {
        // This is required for the Java Provider Build + Publish Steps
        name: "Set PACKAGE_VERSION to Env",
        run: 'echo "PACKAGE_VERSION=$(pulumictl get version --language generic)" >> $GITHUB_ENV',
    };
}
exports.SetPackageVersionToEnv = SetPackageVersionToEnv;
function RunTests() {
    return {
        name: "Run tests",
        run: "cd examples && go test -v -json -count=1 -cover -timeout 2h -tags=${{ matrix.language }} -parallel 4 . 2>&1 | tee /tmp/gotest.log | gotestfmt",
    };
}
exports.RunTests = RunTests;
function SetPreReleaseVersion() {
    return {
        name: "Set PreRelease Version",
        run: 'echo "GORELEASER_CURRENT_TAG=v$(pulumictl get version --language generic)" >> $GITHUB_ENV',
    };
}
exports.SetPreReleaseVersion = SetPreReleaseVersion;
function RunGoReleaserWithArgs(args) {
    return {
        name: "Run GoReleaser",
        uses: action.goReleaser,
        with: {
            args: `${args}`,
            version: "latest",
        },
    };
}
exports.RunGoReleaserWithArgs = RunGoReleaserWithArgs;
function RunCommand(command) {
    return {
        run: `${command}`,
    };
}
exports.RunCommand = RunCommand;
function RunPublishSDK() {
    return {
        name: "Publish SDKs",
        run: "./ci-scripts/ci/publish-tfgen-package ${{ github.workspace }}",
        env: {
            NODE_AUTH_TOKEN: "${{ secrets.NPM_TOKEN }}",
        },
    };
}
exports.RunPublishSDK = RunPublishSDK;
function RunPublishJavaSDK() {
    return {
        name: "Publish Java SDK",
        uses: action.gradleBuildAction,
        with: {
            arguments: "publishToSonatype closeAndReleaseSonatypeStagingRepository",
            "build-root-directory": "./sdk/java",
            "gradle-version": "7.4.1",
        },
    };
}
exports.RunPublishJavaSDK = RunPublishJavaSDK;
function TagSDKTag() {
    return {
        name: "Add SDK version tag",
        run: "git tag sdk/v$(pulumictl get version --language generic) && git push origin sdk/v$(pulumictl get version --language generic)",
    };
}
exports.TagSDKTag = TagSDKTag;
function UpdatePulumiTerraformBridgeDependency() {
    return {
        name: "Update Pulumi Terraform Bridge Dependency",
        run: "cd provider && go mod edit -require github.com/pulumi/pulumi-terraform-bridge/v3@${{ github.event.client_payload.ref }} && go mod tidy && cd ../",
    };
}
exports.UpdatePulumiTerraformBridgeDependency = UpdatePulumiTerraformBridgeDependency;
function CommitChanges(refName) {
    return {
        name: "commit changes",
        uses: action.addAndCommit,
        with: {
            author_email: "bot@pulumi.com",
            author_name: "pulumi-bot",
            ref: `${refName}`,
        },
    };
}
exports.CommitChanges = CommitChanges;
function PullRequest(refName, prTitle, user) {
    return {
        name: "pull-request",
        uses: action.pullRequest,
        with: {
            destination_branch: "master",
            github_token: "${{ secrets.PULUMI_BOT_TOKEN }}",
            pr_allow_empty: "true",
            pr_assignee: `${user}`,
            pr_body: "*Automated PR*",
            pr_reviewer: `${user}`,
            pr_title: `${prTitle}`,
            author_name: "pulumi-bot",
            source_branch: `${refName}`,
        },
        env: {
            GITHUB_TOKEN: "${{ secrets.PULUMI_BOT_TOKEN }}",
        },
    };
}
exports.PullRequest = PullRequest;
function CheckSchemaChanges() {
    return {
        if: "github.event_name == 'pull_request'",
        name: "Check Schema is Valid",
        run: "echo 'SCHEMA_CHANGES<<EOF' >> $GITHUB_ENV\n" +
            "schema-tools compare ${{ env.PROVIDER }} master --local-path=provider/cmd/pulumi-resource-${{ env.PROVIDER }}/schema.json >> $GITHUB_ENV\n" +
            "echo 'EOF' >> $GITHUB_ENV",
    };
}
exports.CheckSchemaChanges = CheckSchemaChanges;
function CommentSchemaChangesOnPR() {
    return {
        if: "github.event_name == 'pull_request'",
        name: "Comment on PR with Details of Schema Check",
        uses: action.prComment,
        with: {
            message: "### Does the PR have any schema changes?\n\n" +
                "${{ env.SCHEMA_CHANGES }}\n",
            GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
        },
    };
}
exports.CommentSchemaChangesOnPR = CommentSchemaChangesOnPR;
function CommandDispatchStep(providerName) {
    return {
        uses: action.slashCommand,
        with: {
            token: "${{ secrets.PULUMI_BOT_TOKEN }}",
            "reaction-token": "${{ secrets.GITHUB_TOKEN }}",
            commands: "run-acceptance-tests",
            permission: "write",
            "issue-type": "pull-request",
            repository: `pulumi/pulumi-${providerName}`,
        },
    };
}
exports.CommandDispatchStep = CommandDispatchStep;
function CreateCommentsUrlStep() {
    return {
        name: "Create URL to the run output",
        id: "run-url",
        run: "echo ::set-output name=run-url::https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID",
    };
}
exports.CreateCommentsUrlStep = CreateCommentsUrlStep;
function EchoSuccessStep() {
    return {
        name: "Is workflow a success",
        run: "echo yes",
    };
}
exports.EchoSuccessStep = EchoSuccessStep;
function UpdatePRWithResultsStep() {
    return {
        name: "Update with Result",
        uses: action.createOrUpdateComment,
        with: {
            token: "${{ secrets.PULUMI_BOT_TOKEN }}",
            repository: "${{ github.event.client_payload.github.payload.repository.full_name }}",
            "issue-number": "${{ github.event.client_payload.github.payload.issue.number }}",
            body: "Please view the PR build: ${{ steps.run-url.outputs.run-url }}",
        },
    };
}
exports.UpdatePRWithResultsStep = UpdatePRWithResultsStep;
function CommentPRWithSlashCommandStep(command) {
    const val = command !== null && command !== void 0 ? command : "/run-acceptance-tests";
    return {
        name: "Comment PR",
        uses: action.prComment,
        with: {
            message: "PR is now waiting for a maintainer to run the acceptance tests.\n" +
                `**Note for the maintainer:** To run the acceptance tests, please comment *${val}* on the PR\n`,
            GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
        },
    };
}
exports.CommentPRWithSlashCommandStep = CommentPRWithSlashCommandStep;
function EchoCoverageOutputDirStep() {
    return {
        name: "Echo Coverage Output Dir",
        run: 'echo "Coverage output directory: ${{ env.COVERAGE_OUTPUT_DIR }}"',
    };
}
exports.EchoCoverageOutputDirStep = EchoCoverageOutputDirStep;
function GenerateCoverageDataStep() {
    return {
        name: "Generate Coverage Data",
        run: "make tfgen",
    };
}
exports.GenerateCoverageDataStep = GenerateCoverageDataStep;
function PrintCoverageDataStep() {
    return {
        name: "Summarize Provider Coverage Results",
        run: "cat ${{ env.COVERAGE_OUTPUT_DIR }}/shortSummary.txt",
    };
}
exports.PrintCoverageDataStep = PrintCoverageDataStep;
function UploadCoverageDataStep() {
    return {
        name: "Upload coverage data to S3",
        run: `summaryName="\${PROVIDER}_summary_\`date +"%Y-%m-%d_%H-%M-%S"\`.json"
s3FullURI="s3://\${{ secrets.S3_COVERAGE_BUCKET_NAME }}/summaries/\${summaryName}"
aws s3 cp \${{ env.COVERAGE_OUTPUT_DIR }}/summary.json \${s3FullURI} --acl bucket-owner-full-control`,
    };
}
exports.UploadCoverageDataStep = UploadCoverageDataStep;
function SetupGotestfmt() {
    return {
        name: "Install gotestfmt",
        uses: "GoTestTools/gotestfmt-action@v2",
        with: {
            version: "v2.4.0",
            token: "${{ secrets.GITHUB_TOKEN }}",
        },
    };
}
exports.SetupGotestfmt = SetupGotestfmt;
function SchemaFileChanged() {
    return {
        name: "Check for diff in schema",
        uses: action.pathsFilter,
        id: "schema_changed",
        with: {
            filters: "changed: 'provider/cmd/**/schema.json'",
        },
    };
}
exports.SchemaFileChanged = SchemaFileChanged;
function SdkFilesChanged() {
    return {
        name: "Check for diff in sdk/**",
        id: "sdk_changed",
        if: "steps.schema_changed.outputs.changed == 'false'",
        uses: action.pathsFilter,
        with: {
            filters: `changed: 'sdk/**'`,
        },
    };
}
exports.SdkFilesChanged = SdkFilesChanged;
function SendCodegenWarnCommentPr() {
    return {
        name: "Send codegen warning as comment on PR",
        if: "steps.sdk_changed.outputs.changed == 'true' && github.event.pull_request.head.repo.full_name != github.repository",
        uses: action.prComment,
        with: {
            message: "Hello and thank you for your pull request! :heart: :sparkles:\n" +
                "It looks like you're directly modifying files in the language SDKs, many of which are autogenerated.\n" +
                "Be sure any files you're editing do not begin with a code generation warning.\n" +
                "For generated files, you will need to make changes in `resources.go` instead, and " +
                "[generate the code](https://github.com/pulumi/${{ github.event.repository.name }}/blob/master/CONTRIBUTING.md#committing-generated-code).\n",
            GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
        },
    };
}
exports.SendCodegenWarnCommentPr = SendCodegenWarnCommentPr;
//# sourceMappingURL=steps.js.map