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
exports.InitializeSubModules = exports.SdkFilesChanged = exports.SetupGotestfmt = exports.SchemaFileChanged = exports.CommentSchemaChangesOnPR = exports.LabelIfNoBreakingChanges = exports.CheckSchemaChanges = exports.PullRequestSdkGeneration = exports.CommitEmptySDK = exports.RunTests = exports.SetPackageVersionToEnv = exports.SetNugetSource = exports.CheckCleanWorkTree = exports.ZipSDKsStep = exports.UnzipSDKs = exports.DownloadSDKs = exports.DownloadProviderBinaries = exports.UploadSDKs = exports.UploadProviderBinaries = exports.BuildSDKs = exports.BuildCodegenBinaries = exports.RunSetUpScriptStep = exports.RunDockerComposeStep = exports.InstallPulumiCli = exports.DispatchDocsBuildEvent = exports.InstallSchemaChecker = exports.InstallPulumiCtl = exports.InstallSDKDeps = exports.InstallPythonDeps = exports.InstallPlugins = exports.InstallPython = exports.InstallJava = exports.InstallDotNet = exports.InstallNodeJS = exports.InstallGo = exports.ConfigureAwsCredentialsForPublish = exports.ConfigureAwsCredentialsForTests = exports.SetupGCloud = exports.GoogleAuth = exports.CheckoutTagsStep = exports.CheckoutScriptsRepoStep = exports.CheckoutRepoStepAtPR = exports.UpdatePRWithResultsStep = exports.EchoSuccessStep = exports.CommitAutomatedSDKUpdates = exports.SetGitSubmoduleCommitHash = exports.CreateCommentsUrlStep = exports.CommentPRWithSlashCommandStep = exports.CommandDispatchStep = exports.CheckoutRepoStep = void 0;
exports.MakeDiscovery = exports.UpdateSubmodules = exports.PrepareGitBranchForSdkGeneration = exports.UploadArmCoverageToS3 = exports.TestResultsJSON = exports.GenerateCoverageReport = exports.MakeLocalGenerate = exports.MakeClean = exports.AwsCredentialsForArmCoverageReport = exports.AzureLogin = exports.ChocolateyPackageDeployment = exports.Porcelain = exports.RunPublishJavaSDK = exports.RunPublishSDK = exports.InstallTwine = exports.UnzipSpecificSDKStep = exports.DownloadSpecificSDKStep = exports.NotifySlack = exports.TagSDKTag = exports.RunGoReleaserWithArgs = exports.SetVersionIfAvailable = exports.SetPreReleaseVersion = exports.SetPRAutoMerge = exports.CreateUpdatePulumiPR = exports.ProviderWithPulumiUpgrade = exports.UpdatePulumi = exports.CodegenDuringSDKBuild = exports.GolangciLint = exports.InstallandConfigureHelm = exports.DownloadKubeconfig = exports.MakeKubeDir = exports.UnTarProviderBinaries = exports.TarProviderBinaries = exports.MakeKubernetesProvider = exports.PrepareOpenAPIFile = exports.BuildK8sgen = exports.DeleteArtifact = exports.DestroyTestCluster = exports.UploadKubernetesArtifacts = exports.CreateTestCluster = exports.SetStackName = exports.LoginGoogleCloudRegistry = exports.InstallKubectl = exports.InstallNodeDeps = exports.UpdatePath = exports.GenerateSDKs = exports.RestoreBinaryPerms = exports.TestProviderLibrary = exports.BuildProvider = exports.BuildSchema = void 0;
const action = __importStar(require("../action-versions"));
function CheckoutRepoStep() {
    return {
        name: "Checkout Repo",
        uses: action.checkout,
        with: {
            lfs: true,
        },
    };
}
exports.CheckoutRepoStep = CheckoutRepoStep;
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
function CommentPRWithSlashCommandStep() {
    return {
        name: "Comment PR",
        uses: action.prComment,
        with: {
            message: "PR is now waiting for a maintainer to run the acceptance tests.\n" +
                "**Note for the maintainer:** To run the acceptance tests, please comment */run-acceptance-tests* on the PR\n",
            GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
        },
    };
}
exports.CommentPRWithSlashCommandStep = CommentPRWithSlashCommandStep;
function CreateCommentsUrlStep() {
    return {
        name: "Create URL to the run output",
        id: "vars",
        run: "echo ::set-output name=run-url::https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID",
    };
}
exports.CreateCommentsUrlStep = CreateCommentsUrlStep;
function SetGitSubmoduleCommitHash(provider) {
    let dir;
    if (provider === "azure-native") {
        dir = "azure-rest-api-specs";
    }
    if (provider === "aws-native") {
        dir = "aws-cloudformation-user-guide";
    }
    if (provider === "google-native") {
        return {};
    }
    return {
        name: "Git submodule commit hash",
        id: "vars",
        run: "echo ::set-output name=commit-hash::$(git rev-parse HEAD)",
        "working-directory": dir,
    };
}
exports.SetGitSubmoduleCommitHash = SetGitSubmoduleCommitHash;
function CommitAutomatedSDKUpdates(provider) {
    let dir;
    if (provider === "azure-native") {
        dir = "azure-rest-api-specs";
    }
    if (provider === "aws-native") {
        dir = "aws-cloudformation-user-guide";
    }
    if (provider === "google-native") {
        return {
            name: "Commit changes",
            run: "git add discovery\n" +
                `git commit -m "Discovery documents"\n` +
                "git add .\n" +
                `git commit -m "Regenerating based on discovery"\n` +
                "git push origin generate-sdk/${{ github.run_id }}-${{ github.run_number }}",
        };
    }
    return {
        name: "Commit changes",
        run: "git add sdk\n" +
            `git commit -m "Regenerating SDKs based on ${dir} @ \${{ steps.vars.outputs.commit-hash }}" || echo "ignore commit failure, may be empty"\n` +
            "git add .\n" +
            `git commit -m "Regenerating based on ${dir} @ \${{ steps.vars.outputs.commit-hash }}"\n` +
            "git push origin generate-sdk/${{ github.run_id }}-${{ github.run_number }}",
    };
}
exports.CommitAutomatedSDKUpdates = CommitAutomatedSDKUpdates;
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
            body: "Please view the PR build: ${{ steps.vars.outputs.run-url }}",
        },
    };
}
exports.UpdatePRWithResultsStep = UpdatePRWithResultsStep;
function CheckoutRepoStepAtPR() {
    return {
        name: "Checkout Repo",
        uses: action.checkout,
        with: {
            lfs: true,
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
function CheckoutTagsStep(skipProvider) {
    // If a provider is not passed at all then this step will not be skipped.
    if (skipProvider === "azure-native") {
        return {};
    }
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
function InstallSchemaChecker(provider) {
    if (provider === "command") {
        return {};
    }
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
function InstallPulumiCli() {
    return {
        name: "Install Pulumi CLI",
        uses: action.installPulumiCli,
    };
}
exports.InstallPulumiCli = InstallPulumiCli;
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
function BuildCodegenBinaries(provider) {
    if (provider === "kubernetes") {
        return {};
    }
    return {
        name: "Build codegen binaries",
        run: "make codegen",
    };
}
exports.BuildCodegenBinaries = BuildCodegenBinaries;
function BuildSDKs(provider) {
    if (provider === "command" || provider === "kubernetes") {
        return {};
    }
    return {
        name: "Build SDK",
        run: "make build_${{ matrix.language }}",
    };
}
exports.BuildSDKs = BuildSDKs;
function UploadProviderBinaries() {
    return {
        name: "Upload artifacts",
        uses: action.uploadArtifact,
        with: {
            name: "pulumi-${{ env.PROVIDER }}-provider.tar.gz",
            path: "${{ github.workspace }}/bin/provider.tar.gz",
        },
    };
}
exports.UploadProviderBinaries = UploadProviderBinaries;
function UploadSDKs() {
    return {
        name: "Upload artifacts",
        uses: action.uploadArtifact,
        with: {
            name: "${{ matrix.language  }}-sdk.tar.gz",
            path: "${{ github.workspace}}/sdk/${{ matrix.language }}.tar.gz",
        },
    };
}
exports.UploadSDKs = UploadSDKs;
function DownloadProviderBinaries(provider, job) {
    if (provider === "azure-native" && job === "build_sdks") {
        return {
            name: "Download provider + tfgen binaries",
            if: "${{ matrix.language != 'dotnet' }}",
            uses: action.downloadArtifact,
            with: {
                name: "pulumi-${{ env.PROVIDER }}-provider.tar.gz",
                path: "${{ github.workspace }}/bin",
            },
        };
    }
    return {
        name: "Download provider + tfgen binaries",
        uses: action.downloadArtifact,
        with: {
            name: "pulumi-${{ env.PROVIDER }}-provider.tar.gz",
            path: "${{ github.workspace }}/bin",
        },
    };
}
exports.DownloadProviderBinaries = DownloadProviderBinaries;
function DownloadSDKs() {
    return {
        name: "Download SDK",
        uses: action.downloadArtifact,
        with: {
            name: "${{ matrix.language }}-sdk.tar.gz",
            path: "${{ github.workspace}}/sdk/",
        },
    };
}
exports.DownloadSDKs = DownloadSDKs;
function UnzipSDKs() {
    return {
        name: "UnTar SDK folder",
        run: "tar -zxf ${{ github.workspace}}/sdk/${{ matrix.language}}.tar.gz -C ${{ github.workspace}}/sdk/${{ matrix.language}}",
    };
}
exports.UnzipSDKs = UnzipSDKs;
function ZipSDKsStep() {
    return {
        name: "Tar SDK folder",
        run: "tar -zcf sdk/${{ matrix.language }}.tar.gz -C sdk/${{ matrix.language }} .",
    };
}
exports.ZipSDKsStep = ZipSDKsStep;
function CheckCleanWorkTree() {
    return {
        name: "Check worktree clean",
        run: "./ci-scripts/ci/check-worktree-is-clean",
    };
}
exports.CheckCleanWorkTree = CheckCleanWorkTree;
function SetNugetSource() {
    return {
        run: "dotnet nuget add source ${{ github.workspace }}/nuget",
    };
}
exports.SetNugetSource = SetNugetSource;
function SetPackageVersionToEnv() {
    return {
        // This is required for the Java Provider Build + Publish Steps
        name: "Set PACKAGE_VERSION to Env",
        run: 'echo "PACKAGE_VERSION=$(pulumictl get version --language generic)" >> $GITHUB_ENV',
    };
}
exports.SetPackageVersionToEnv = SetPackageVersionToEnv;
function RunTests(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Run tests",
            run: "cd tests/sdk/${{ matrix.language }} && go test -v -count=1 -cover -timeout 2h -parallel 4 ./...",
        };
    }
    return {
        name: "Run tests",
        run: "set -euo pipefail\n" +
            "cd examples && go test -v -json -count=1 -cover -timeout 2h -tags=${{ matrix.language }} -parallel 4 . 2>&1 | tee /tmp/gotest.log | gotestfmt",
    };
}
exports.RunTests = RunTests;
function CommitEmptySDK() {
    return {
        name: "Commit Empty SDK",
        run: "git add . \n" +
            'git commit -m "Preparing the SDK folder for regeneration"',
    };
}
exports.CommitEmptySDK = CommitEmptySDK;
function PullRequestSdkGeneration(provider) {
    let dir;
    if (provider === "azure-native") {
        dir = "azure-rest-api-specs";
    }
    if (provider === "aws-native") {
        dir = "aws-cloudformation-user-guide";
    }
    const result = {
        name: "Create PR",
        id: "create-pr",
        uses: action.pullRequest,
        with: {
            destination_branch: "master",
            github_token: "${{ secrets.PULUMI_BOT_TOKEN }}",
            pr_body: "*Automated PR*",
            pr_title: `Automated SDK generation @ ${dir} \${{ steps.vars.outputs.commit-hash }}`,
            author_name: "pulumi-bot",
            source_branch: "generate-sdk/${{ github.run_id }}-${{ github.run_number }}",
        },
    };
    if (provider === "google-native") {
        result.with.pr_title = "Automated SDK generation";
    }
    return result;
}
exports.PullRequestSdkGeneration = PullRequestSdkGeneration;
function CheckSchemaChanges(provider) {
    if (provider === "command") {
        return {};
    }
    return {
        if: "github.event_name == 'pull_request'",
        name: "Check Schema is Valid",
        run: "echo 'SCHEMA_CHANGES<<EOF' >> $GITHUB_ENV\n" +
            "schema-tools compare ${{ env.PROVIDER }} master --local-path=provider/cmd/pulumi-resource-${{ env.PROVIDER }}/schema.json >> $GITHUB_ENV\n" +
            "echo 'EOF' >> $GITHUB_ENV",
    };
}
exports.CheckSchemaChanges = CheckSchemaChanges;
function LabelIfNoBreakingChanges(provider) {
    if (provider === "command") {
        return {};
    }
    return {
        if: "contains(env.SCHEMA_CHANGES, 'Looking good! No breaking changes found.') && github.actor == 'pulumi-bot'",
        name: "Add label if no breaking changes",
        uses: action.addLabel,
        with: {
            labels: "impact/no-changelog-required",
            number: "${{ github.event.issue.number }}",
            github_token: "${{ secrets.GITHUB_TOKEN }}",
        },
    };
}
exports.LabelIfNoBreakingChanges = LabelIfNoBreakingChanges;
function CommentSchemaChangesOnPR(provider) {
    if (provider === "command") {
        return {};
    }
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
function SchemaFileChanged(provider) {
    if (provider === "command") {
        return {};
    }
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
function SdkFilesChanged() {
    return {
        name: "Check for diff in sdk/*",
        id: "sdk_changed",
        if: "steps.schema_changed.outputs.changed == 'false'",
        uses: action.pathsFilter,
        with: {
            filters: `changed: 'sdk/*'`,
        },
    };
}
exports.SdkFilesChanged = SdkFilesChanged;
function InitializeSubModules(submodules) {
    if (submodules) {
        return {
            name: "Initialize submodules",
            run: "make init_submodules",
        };
    }
    return {};
}
exports.InitializeSubModules = InitializeSubModules;
function BuildSchema(provider) {
    if (provider === "command") {
        return {};
    }
    if (provider === "kubernetes") {
        return {
            name: "Prepare Schema",
            run: "make schema",
        };
    }
    return {
        name: "Build Schema",
        run: "make generate_schema",
    };
}
exports.BuildSchema = BuildSchema;
function BuildProvider(provider) {
    if (provider === "kubernetes") {
        return {};
    }
    return {
        name: "Build Provider",
        run: "make provider",
    };
}
exports.BuildProvider = BuildProvider;
function TestProviderLibrary() {
    return {
        name: "Test Provider Library",
        run: "make test_provider",
    };
}
exports.TestProviderLibrary = TestProviderLibrary;
function RestoreBinaryPerms(provider, job) {
    if (provider === "azure-native" && job === "build_sdks") {
        return {
            name: "Restore Binary Permissions",
            if: "${{ matrix.language != 'dotnet' }}",
            run: 'find ${{ github.workspace }} -name "pulumi-*-${{ env.PROVIDER }}" -print -exec chmod +x {} \\;',
        };
    }
    return {
        name: "Restore Binary Permissions",
        run: 'find ${{ github.workspace }} -name "pulumi-*-${{ env.PROVIDER }}" -print -exec chmod +x {} \\;',
    };
}
exports.RestoreBinaryPerms = RestoreBinaryPerms;
function GenerateSDKs(provider) {
    if (provider === "command" || provider === "kubernetes") {
        return {
            name: "Generate SDK",
            run: "make ${{ matrix.language }}_sdk",
        };
    }
    return {
        name: "Generate SDK",
        run: "make generate_${{ matrix.language }}",
    };
}
exports.GenerateSDKs = GenerateSDKs;
function UpdatePath() {
    return {
        name: "Update path",
        run: 'echo "${{ github.workspace }}/bin" >> $GITHUB_PATH',
    };
}
exports.UpdatePath = UpdatePath;
function InstallNodeDeps() {
    return {
        name: "Install Node dependencies",
        run: "yarn global add typescript",
    };
}
exports.InstallNodeDeps = InstallNodeDeps;
function InstallKubectl(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Install Kubectl",
            run: "curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl\n" +
                "chmod +x ./kubectl\n" +
                "sudo mv kubectl /usr/local/bin\n",
        };
    }
    return {};
}
exports.InstallKubectl = InstallKubectl;
function LoginGoogleCloudRegistry(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Login to Google Cloud Registry",
            run: "gcloud --quiet auth configure-docker",
        };
    }
    return {};
}
exports.LoginGoogleCloudRegistry = LoginGoogleCloudRegistry;
function SetStackName(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Set stack name in output",
            id: "stackname",
            run: "echo '::set-output name=stack-name::${{ env.PULUMI_TEST_OWNER }}/${{ github.sha }}-${{ github.run_id }}-${{ github.run_attempt }}'",
        };
    }
    return {};
}
exports.SetStackName = SetStackName;
function CreateTestCluster(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Create test infrastructure",
            run: "./scripts/ci-cluster-create.sh ${{ steps.stackname.outputs.stack-name }}",
        };
    }
    return {};
}
exports.CreateTestCluster = CreateTestCluster;
function UploadKubernetesArtifacts(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Upload Kubernetes Artifacts",
            uses: action.uploadArtifact,
            with: {
                name: "config",
                path: "~/.kube/config",
            },
        };
    }
    return {};
}
exports.UploadKubernetesArtifacts = UploadKubernetesArtifacts;
function DestroyTestCluster(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Destroy test infra",
            run: "./scripts/ci-cluster-destroy.sh ${{ needs.build-test-cluster.outputs.stack-name }}",
        };
    }
    return {};
}
exports.DestroyTestCluster = DestroyTestCluster;
function DeleteArtifact(provider) {
    if (provider === "kubernetes") {
        return {
            uses: action.deleteArtifact,
            with: {
                name: "config",
            },
        };
    }
    return {};
}
exports.DeleteArtifact = DeleteArtifact;
function BuildK8sgen(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Build K8sgen",
            run: "make k8sgen",
        };
    }
    return {};
}
exports.BuildK8sgen = BuildK8sgen;
function PrepareOpenAPIFile(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Prepare OpenAPI file",
            run: "make openapi_file",
        };
    }
    return {};
}
exports.PrepareOpenAPIFile = PrepareOpenAPIFile;
function MakeKubernetesProvider(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Make Kubernetes provider",
            run: "make k8sprovider",
        };
    }
    return {};
}
exports.MakeKubernetesProvider = MakeKubernetesProvider;
function TarProviderBinaries() {
    return {
        name: "Tar provider binaries",
        run: "tar -zcf ${{ github.workspace }}/bin/provider.tar.gz -C ${{ github.workspace}}/bin/ pulumi-resource-${{ env.PROVIDER }} pulumi-gen-${{ env.PROVIDER}}",
    };
}
exports.TarProviderBinaries = TarProviderBinaries;
function UnTarProviderBinaries(provider, job) {
    if (provider === "azure-native" && job === "build_sdks") {
        return {
            name: "UnTar provider binaries",
            if: "${{ matrix.language != 'dotnet' }}",
            run: "tar -zxf ${{ github.workspace }}/bin/provider.tar.gz -C ${{ github.workspace}}/bin",
        };
    }
    return {
        name: "UnTar provider binaries",
        run: "tar -zxf ${{ github.workspace }}/bin/provider.tar.gz -C ${{ github.workspace}}/bin",
    };
}
exports.UnTarProviderBinaries = UnTarProviderBinaries;
function MakeKubeDir(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Make Kube Directory",
            run: 'mkdir -p "~/.kube/"',
        };
    }
    return {};
}
exports.MakeKubeDir = MakeKubeDir;
function DownloadKubeconfig(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Download Kubeconfig",
            uses: action.downloadArtifact,
            with: {
                name: "config",
                path: "~/.kube/",
            },
        };
    }
    return {};
}
exports.DownloadKubeconfig = DownloadKubeconfig;
function InstallandConfigureHelm(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Install and configure Helm",
            run: "curl -LO  https://get.helm.sh/helm-v3.8.0-linux-amd64.tar.gz\n" +
                "tar -xvf helm-v3.8.0-linux-amd64.tar.gz\n" +
                "sudo mv linux-amd64/helm /usr/local/bin\n" +
                "helm repo add stable https://charts.helm.sh/stable\n" +
                "helm repo update\n",
        };
    }
    return {};
}
exports.InstallandConfigureHelm = InstallandConfigureHelm;
function GolangciLint() {
    return {
        name: "golangci-lint provider pkg",
        uses: action.goLint,
        with: {
            version: "${{ env.GOLANGCI_LINT_VERSION }}",
            args: "-c ../../.golangci.yml --timeout ${{ env.GOLANGCI_LINT_TIMEOUT }}",
            "working-directory": "provider/pkg",
        },
    };
}
exports.GolangciLint = GolangciLint;
function CodegenDuringSDKBuild(provider) {
    if (provider === "azure-native") {
        return {
            name: "Build Codegen",
            if: "${{ matrix.language == 'dotnet' }}",
            run: "make codegen",
        };
    }
    return {};
}
exports.CodegenDuringSDKBuild = CodegenDuringSDKBuild;
function UpdatePulumi(provider) {
    if (provider === "kubernetes") {
        return {
            name: "Update Pulumi/Pulumi",
            id: "gomod",
            run: "git config --local user.email 'bot@pulumi.com'\n" +
                "git config --local user.name 'pulumi-bot'\n" +
                "git checkout -b update-pulumi/${{ github.run_id }}-${{ github.run_number }}\n" +
                "cd provider\n" +
                "go get github.com/pulumi/pulumi/pkg/v3\n" +
                "go get github.com/pulumi/pulumi/sdk/v3\n" +
                "cd ../sdk\n" +
                "go get github.com/pulumi/pulumi/sdk/v3\n" +
                "cd ..\n" +
                "make ensure\n" +
                "git update-index -q --refresh\n" +
                "if ! git diff-files --quiet; then \n\techo ::set-output name=changes::1 \nfi",
        };
    }
    return {
        name: "Update Pulumi/Pulumi",
        id: "gomod",
        run: "git config --local user.email 'bot@pulumi.com'\n" +
            "git config --local user.name 'pulumi-bot'\n" +
            "git checkout -b update-pulumi/${{ github.run_id }}-${{ github.run_number }}\n" +
            "cd provider\n" +
            "go get github.com/pulumi/pulumi/pkg/v3\n" +
            "go get github.com/pulumi/pulumi/sdk/v3\n" +
            "go mod download\n" +
            "go mod tidy\n" +
            "cd ../sdk\n" +
            "go get github.com/pulumi/pulumi/sdk/v3\n" +
            "go mod download\n" +
            "go mod tidy\n" +
            "cd ..\n" +
            "git update-index -q --refresh\n" +
            "if ! git diff-files --quiet; then \n\techo ::set-output name=changes::1 \nfi",
    };
}
exports.UpdatePulumi = UpdatePulumi;
function ProviderWithPulumiUpgrade(provider) {
    let buildProvider = "make codegen && make local_generate\n";
    if (provider === "command" || provider === "kubernetes") {
        buildProvider = "make build\n";
    }
    return {
        name: "Provider with Pulumi Upgrade",
        if: "steps.gomod.outputs.changes != 0",
        run: buildProvider +
            "git add sdk/nodejs\n" +
            'git commit -m "Regenerating Node.js SDK based on updated modules" || echo "ignore commit failure, may be empty"\n' +
            "git add sdk/python\n" +
            'git commit -m "Regenerating Python SDK based on updated modules" || echo "ignore commit failure, may be empty"\n' +
            "git add sdk/dotnet\n" +
            'git commit -m "Regenerating .NET SDK based on updated modules" || echo "ignore commit failure, may be empty"\n' +
            "git add sdk/go*\n" +
            'git commit -m "Regenerating Go SDK based on updated modules" || echo "ignore commit failure, may be empty"\n' +
            "git add sdk/java*\n" +
            'git commit -m "Regenerating Java SDK based on updated modules" || echo "ignore commit failure, may be empty"\n' +
            "git add .\n" +
            'git commit -m "Updated modules"\n' +
            "git push origin update-pulumi/${{ github.run_id }}-${{ github.run_number }}",
    };
}
exports.ProviderWithPulumiUpgrade = ProviderWithPulumiUpgrade;
function CreateUpdatePulumiPR() {
    return {
        name: "Create PR",
        id: "create-pr",
        if: "steps.gomod.outputs.changes != 0",
        uses: action.pullRequest,
        with: {
            source_branch: "update-pulumi/${{ github.run_id }}-${{ github.run_number }}",
            destination_branch: "master",
            pr_title: "Automated Pulumi/Pulumi upgrade",
            github_token: "${{ secrets.PULUMI_BOT_TOKEN }}",
        },
        env: {
            GITHUB_TOKEN: "${{ secrets.PULUMI_BOT_TOKEN }}",
        },
    };
}
exports.CreateUpdatePulumiPR = CreateUpdatePulumiPR;
function SetPRAutoMerge(provider) {
    if (provider === "kubernetes") {
        // Temporarily disabled until https://github.com/pulumi/pulumi-kubernetes/issues/2169 is fixed.
        return {};
    }
    return {
        name: "Set AutoMerge",
        if: "steps.create-pr.outputs.has_changed_files",
        uses: action.autoMerge,
        with: {
            token: "${{ secrets.PULUMI_BOT_TOKEN }}",
            "pull-request-number": "${{ steps.create-pr.outputs.pr_number }}",
            repository: "${{ github.repository }}",
            "merge-method": "squash",
        },
    };
}
exports.SetPRAutoMerge = SetPRAutoMerge;
function SetPreReleaseVersion() {
    return {
        name: "Set PreRelease Version",
        run: `echo "GORELEASER_CURRENT_TAG=v$(pulumictl get version --language generic)" >> $GITHUB_ENV`,
    };
}
exports.SetPreReleaseVersion = SetPreReleaseVersion;
function SetVersionIfAvailable() {
    return {
        name: "Set Version if Parameter available",
        if: "github.event.inputs.version != ''",
        run: `echo "GORELEASER_CURRENT_TAG=v\${{ github.event.inputs.message }}" >> $GITHUB_ENV`,
    };
}
exports.SetVersionIfAvailable = SetVersionIfAvailable;
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
function TagSDKTag() {
    return {
        name: "Add SDK version tag",
        run: "git tag sdk/v$(pulumictl get version --language generic) && git push origin sdk/v$(pulumictl get version --language generic)",
    };
}
exports.TagSDKTag = TagSDKTag;
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
function UnzipSpecificSDKStep(name) {
    return {
        name: `Uncompress ${name} SDK`,
        run: `tar -zxf \${{github.workspace}}/sdk/${name}.tar.gz -C \${{github.workspace}}/sdk/${name}`,
    };
}
exports.UnzipSpecificSDKStep = UnzipSpecificSDKStep;
function InstallTwine() {
    return {
        name: "Install Twine",
        run: "python -m pip install pip twine",
    };
}
exports.InstallTwine = InstallTwine;
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
function Porcelain() {
    return {
        run: "git status --porcelain",
    };
}
exports.Porcelain = Porcelain;
function ChocolateyPackageDeployment() {
    return {
        name: "Chocolatey Package Deployment",
        run: "CURRENT_TAG=v$(pulumictl get version --language generic -o)\n" +
            "pulumictl create choco-deploy -a cf2pulumi ${CURRENT_TAG}",
    };
}
exports.ChocolateyPackageDeployment = ChocolateyPackageDeployment;
function AzureLogin(provider) {
    if (provider === "azure-native") {
        return {
            uses: action.azureLogin,
            with: {
                creds: "${{ secrets.AZURE_RBAC_SERVICE_PRINCIPAL }}",
            },
        };
    }
    return {};
}
exports.AzureLogin = AzureLogin;
function AwsCredentialsForArmCoverageReport() {
    return {
        name: "Configure AWS Credentials",
        uses: action.configureAwsCredentials,
        with: {
            "aws-access-key-id": "${{ secrets.AWS_ACCESS_KEY_ID }}",
            "aws-region": "us-west-2",
            "aws-secret-access-key": "${{ secrets.AWS_SECRET_ACCESS_KEY }}",
            "role-duration-seconds": 3600,
            "role-session-name": "arm2pulumiCvg@githubActions",
            "role-to-assume": "${{ secrets.AWS_CI_ROLE_ARN }}",
        },
    };
}
exports.AwsCredentialsForArmCoverageReport = AwsCredentialsForArmCoverageReport;
function MakeClean() {
    return {
        name: "Cleanup SDK Folder",
        run: "make clean",
    };
}
exports.MakeClean = MakeClean;
function MakeLocalGenerate() {
    return {
        name: "Build Schema + SDKs",
        run: "make local_generate",
    };
}
exports.MakeLocalGenerate = MakeLocalGenerate;
function GenerateCoverageReport() {
    return {
        name: "Generate coverage report",
        run: "make arm2pulumi_coverage_report",
    };
}
exports.GenerateCoverageReport = GenerateCoverageReport;
function TestResultsJSON() {
    return {
        name: "Test usage of results.json",
        run: "cat provider/pkg/arm2pulumi/internal/test/results.json",
    };
}
exports.TestResultsJSON = TestResultsJSON;
function UploadArmCoverageToS3() {
    return {
        name: "Upload results to S3",
        run: "cd provider/pkg/arm2pulumi/internal/test && bash s3-upload-script.sh",
    };
}
exports.UploadArmCoverageToS3 = UploadArmCoverageToS3;
function PrepareGitBranchForSdkGeneration() {
    return {
        name: "Preparing Git Branch",
        run: 'git config --local user.email "bot@pulumi.com"\n' +
            'git config --local user.name "pulumi-bot"\n' +
            "git checkout -b generate-sdk/${{ github.run_id }}-${{ github.run_number }}\n",
    };
}
exports.PrepareGitBranchForSdkGeneration = PrepareGitBranchForSdkGeneration;
function UpdateSubmodules(provider) {
    if (provider !== "azure-native") {
        return {};
    }
    return {
        name: "Update Submodules",
        run: "make update_submodules",
    };
}
exports.UpdateSubmodules = UpdateSubmodules;
function MakeDiscovery(provider) {
    if (provider === "aws-native") {
        return {
            name: "Discovery",
            run: "make discovery",
        };
    }
    if (provider === "google-native") {
        return {
            name: "Discovery",
            id: "discovery",
            run: "make discovery\n" + "git update-index -q --refresh",
        };
    }
    return {};
}
exports.MakeDiscovery = MakeDiscovery;
//# sourceMappingURL=steps.js.map