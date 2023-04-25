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
exports.generateExamplesFiles = exports.RunTestsCommandWorkflow = exports.CommandDispatchWorkflow = exports.PrWorkFlow = exports.SmokeTestProvidersWorkflow = exports.SmokeTestCliWorkflow = exports.CronWorkflow = exports.UnitTestGoJob = exports.UnitTestNodeJSJob = exports.UnitTestPythonJob = exports.UnitTestDotNetJob = exports.UnitTestingJob = exports.SmokeTestProvidersJob = exports.SmokeTestKubernetesProviderTestJob = exports.SmokeTestCliForProvidersJob = exports.RunProviderTestForPrTestJob = exports.CronProviderTestJob = exports.SmokeTestCliForKubernetesProviderTestJob = exports.KubernetesProviderTestJob = exports.TestInfraDestroy = exports.ConditionalTestInfraSetup = exports.TestInfraSetup = exports.EnvironmentSetup = exports.StatusCheckJob = exports.ResultsCommentJob = exports.CommentOnPrJob = exports.Linting = void 0;
const steps = __importStar(require("./steps"));
const action = __importStar(require("../action-versions"));
const pythonVersion = "3.9";
const goVersion = "1.19.x";
const nodeVersion = "16.x";
const dotnetVersion = "3.1.301";
const javaVersion = "11";
const yarnVersion = "1.13.0";
const env = () => ({
    PULUMI_TEST_OWNER: "moolumi",
    PULUMI_ACCESS_TOKEN: "${{ secrets.PULUMI_ACCESS_TOKEN }}",
    PULUMI_API: "https://api.pulumi-staging.io",
    SLACK_WEBHOOK_URL: "${{ secrets.SLACK_WEBHOOK_URL }}",
    AWS_ACCESS_KEY_ID: " ${{ secrets.AWS_ACCESS_KEY_ID }}",
    AWS_SECRET_ACCESS_KEY: "${{ secrets.AWS_SECRET_ACCESS_KEY }}",
    AWS_REGION: "us-west-2",
    ARM_CLIENT_ID: "${{ secrets.ARM_CLIENT_ID }}",
    ARM_CLIENT_SECRET: "${{ secrets.ARM_CLIENT_SECRET }}",
    ARM_SUBSCRIPTION_ID: "${{ secrets.ARM_SUBSCRIPTION_ID }}",
    ARM_TENANT_ID: "${{ secrets.ARM_TENANT_ID }}",
    ARM_ENVIRONMENT: "public",
    ARM_LOCATION: "westus",
    DIGITALOCEAN_TOKEN: "${{ secrets.DIGITALOCEAN_TOKEN }}",
    CLOUDSDK_CORE_DISABLE_PROMPTS: 1,
    GOOGLE_CI_SERVICE_ACCOUNT_EMAIL: "pulumi-ci@pulumi-ci-gcp-provider.iam.gserviceaccount.com",
    GOOGLE_CI_WORKLOAD_IDENTITY_POOL: "pulumi-ci",
    GOOGLE_CI_WORKLOAD_IDENTITY_PROVIDER: "pulumi-ci",
    GOOGLE_PROJECT: "pulumi-ci-gcp-provider",
    GOOGLE_PROJECT_NUMBER: "895284651812",
    GOOGLE_REGION: "us-central1",
    GOOGLE_ZONE: "us-central1-a",
    PACKET_AUTH_TOKEN: "${{ secrets.PACKET_AUTH_TOKEN }}",
    GOVERSION: goVersion,
    NODEVERSION: nodeVersion,
    PYTHONVERSION: pythonVersion,
    DOTNETVERSION: dotnetVersion,
    JAVAVERSION: javaVersion,
});
class Linting {
    constructor(name, params) {
        this.strategy = {
            "fail-fast": false,
            matrix: {
                "yarn-version": [yarnVersion],
                nodeversion: [nodeVersion],
                platform: ["ubuntu-latest"],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallNodeJS(),
            {
                name: "Install Yarn",
                run: "curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version ${{ matrix.yarn-version }}",
            },
            {
                name: "Update PATH for Yarn",
                run: 'echo "$HOME/.yarn/bin" >> $GITHUB_PATH\n' +
                    'echo "$HOME/.config/yarn/global/node_modules/.bin" >> $GITHUB_PATH',
            },
            {
                name: "Setup linting tool",
                run: "make install",
            },
            {
                name: "Lint typescript files",
                run: "make lint",
            },
        ];
        this.name = name;
        Object.assign(this, { name }, params);
    }
    addDispatchConditional(isWorkflowDispatch) {
        if (isWorkflowDispatch) {
            this.if =
                "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository";
        }
        return this;
    }
}
exports.Linting = Linting;
class CommentOnPrJob {
    constructor(name, params) {
        this["runs-on"] = "ubuntu-latest";
        this.if = "github.event.pull_request.head.repo.full_name != github.repository";
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.CommentPRWithSlashCommandStep("/run-example-tests"),
        ];
        this.name = name;
        Object.assign(this, { name }, params);
    }
}
exports.CommentOnPrJob = CommentOnPrJob;
class ResultsCommentJob {
    constructor(name, params) {
        this["runs-on"] = "ubuntu-latest";
        this.if = "github.event_name == 'repository_dispatch'";
        this.steps = [
            {
                name: "Create URL to the run output",
                id: "vars",
                run: "echo ::set-output name=run-url::https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID",
            },
            {
                name: "Update with Result",
                uses: "peter-evans/create-or-update-comment@v1",
                with: {
                    token: "${{ secrets.GITHUB_TOKEN }}",
                    repository: "${{ github.event.client_payload.github.payload.repository.full_name }}",
                    "issue-number": "${{ github.event.client_payload.github.payload.issue.number }}",
                    body: "Please view the results of the PR Build [Here][1]\n\n" +
                        "[1]: ${{ steps.vars.outputs.run-url }}",
                },
            },
        ];
        this.name = name;
        Object.assign(this, { name }, params);
    }
}
exports.ResultsCommentJob = ResultsCommentJob;
class StatusCheckJob {
    constructor(name, params) {
        this["runs-on"] = "ubuntu-latest";
        this.if = "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name";
        this.needs = [
            "dotnet-unit-testing",
            "go-unit-testing",
            "python-unit-testing",
            "ts-unit-testing",
            "kubernetes",
            "linting",
            "providers",
        ];
        this.steps = [
            steps.CheckoutRepoStep(),
            {
                run: `echo "Ready for merge"`,
            },
        ];
        this.name = name;
        Object.assign(this, { name }, params);
    }
}
exports.StatusCheckJob = StatusCheckJob;
class EnvironmentSetup {
    constructor(name, params) {
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallDotNet(),
            steps.InstallNodeJS(),
            steps.InstallPython(),
            steps.InstallPythonDeps(),
            steps.InstallGo(),
            {
                name: "Install aws-iam-authenticator",
                run: "curl -o aws-iam-authenticator https://amazon-eks.s3-us-west-2.amazonaws.com/1.13.7/2019-06-11/bin/linux/amd64/aws-iam-authenticator\n" +
                    "chmod +x ./aws-iam-authenticator\n" +
                    "sudo mv aws-iam-authenticator /usr/local/bin",
            },
            {
                name: "Install Kubectl",
                run: "curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl\n" +
                    "chmod +x ./kubectl\n" +
                    "sudo mv kubectl /usr/local/bin",
            },
            {
                name: "Install + Configure Helm",
                run: "curl -o- -L https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash\n" +
                    "helm init -c\n" +
                    "helm repo add bitnami https://charts.bitnami.com/bitnami",
            },
            {
                name: "Authenticate to Google Cloud",
                uses: action.googleAuth,
                with: {
                    workload_identity_provider: "projects/${{ env.GOOGLE_PROJECT_NUMBER }}/locations/global/workloadIdentityPools/${{ env.GOOGLE_CI_WORKLOAD_IDENTITY_POOL }}/providers/${{ env.GOOGLE_CI_WORKLOAD_IDENTITY_PROVIDER }}",
                    service_account: "${{ env.GOOGLE_CI_SERVICE_ACCOUNT_EMAIL }}",
                },
            },
            {
                name: "Setup gcloud auth",
                uses: action.setupGcloud,
                with: {
                    install_components: "gke-gcloud-auth-plugin",
                },
            },
            {
                name: "Login to Google Cloud Registry",
                run: "gcloud --quiet auth configure-docker",
            },
            {
                name: "Configure AWS Credentials",
                uses: "aws-actions/configure-aws-credentials@v1",
                with: {
                    "aws-access-key-id": "${{ secrets.AWS_ACCESS_KEY_ID }}",
                    "aws-region": "${{ env.AWS_REGION }}",
                    "aws-secret-access-key": "${{ secrets.AWS_SECRET_ACCESS_KEY }}",
                    "role-duration-seconds": 3600,
                    "role-session-name": "examples@githubActions",
                    "role-to-assume": "${{ secrets.AWS_CI_ROLE_ARN }}",
                },
            },
            steps.CheckoutScriptsRepoStep(),
        ];
        this.name = name;
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        Object.assign(this, { name }, params);
    }
    addStep(step) {
        var _a;
        (_a = this.steps) === null || _a === void 0 ? void 0 : _a.push(step);
        return this;
    }
    addDispatchConditional(isWorkflowDispatch) {
        if (isWorkflowDispatch) {
            this.if =
                "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository";
        }
        return this;
    }
}
exports.EnvironmentSetup = EnvironmentSetup;
class TestInfraSetup extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                name: "Create Test Infrastructure",
                run: 'make setup_test_infra StackName="${{ env.PULUMI_TEST_OWNER }}/${{ github.sha }}-${{ github.run_number }}"',
            },
        ]);
    }
}
exports.TestInfraSetup = TestInfraSetup;
class ConditionalTestInfraSetup extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                name: "Create Test Infrastructure",
                run: 'make setup_test_infra StackName="${{ env.PULUMI_TEST_OWNER }}/${{ github.sha }}-${{ github.run_number }}"',
            },
        ]);
    }
}
exports.ConditionalTestInfraSetup = ConditionalTestInfraSetup;
class TestInfraDestroy extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.needs = "kubernetes";
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                name: "Destroy test infra",
                run: 'make destroy_test_infra StackName="${{ env.PULUMI_TEST_OWNER }}/${{ github.sha }}-${{ github.run_number }}"',
            },
        ]);
    }
}
exports.TestInfraDestroy = TestInfraDestroy;
class KubernetesProviderTestJob extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.needs = "test-infra-setup";
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                name: "Install Go Dependencies",
                run: "make ensure",
            },
            {
                name: "Setup Config",
                run: 'mkdir -p "$HOME/.kube/"\n' +
                    'pulumi stack -s "${{ env.PULUMI_TEST_OWNER }}/${{ github.sha }}-${{ github.run_number }}" -C misc/scripts/testinfra/ output --show-secrets kubeconfig >~/.kube/config',
            },
            {
                name: "Run ${{ matrix.tests-set }} Tests",
                run: "make specific_test_set TestSet=Kubernetes",
            },
        ]);
    }
}
exports.KubernetesProviderTestJob = KubernetesProviderTestJob;
class SmokeTestCliForKubernetesProviderTestJob extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.needs = "test-infra-setup";
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli("${{ env.PULUMI_VERSION }}"),
            steps.PrintPulumiCliVersion(),
            {
                name: "Install Go Dependencies",
                run: "make ensure",
            },
            {
                name: "Setup Config",
                run: 'mkdir -p "$HOME/.kube/"\n' +
                    'pulumi stack -s "${{ env.PULUMI_TEST_OWNER }}/${{ github.sha }}-${{ github.run_number }}" -C misc/scripts/testinfra/ output --show-secrets kubeconfig >~/.kube/config',
            },
            {
                name: "Run ${{ matrix.tests-set }} Tests",
                run: "make specific_test_set TestSet=Kubernetes",
            },
        ]);
    }
}
exports.SmokeTestCliForKubernetesProviderTestJob = SmokeTestCliForKubernetesProviderTestJob;
class CronProviderTestJob extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
                languages: ["Cs", "Js", "Ts", "Py", "Fs"],
                clouds: [
                    "DigitalOcean",
                    "Aws",
                    "Azure",
                    "Gcp",
                    "Packet",
                    "EquinixMetal",
                    "Cloud",
                ],
                "examples-test-matrix": [
                    "no-latest-cli",
                    "no-latest-packages",
                    "default",
                ],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            {
                if: "matrix.examples-test-matrix == 'no-latest-cli'",
                run: "echo 'running combination of stable pulumi cli + dev providers'",
            },
            {
                if: "matrix.examples-test-matrix == 'no-latest-packages'",
                run: "echo 'running combination of dev pulumi cli + stable providers'",
            },
            {
                if: "matrix.examples-test-matrix == 'default'",
                run: "echo 'running combination of dev pulumi cli + dev providers'",
            },
            {
                if: "matrix.examples-test-matrix == 'no-latest-cli'",
                name: "Install Latest Stable Pulumi CLI",
                uses: action.installPulumiCli,
            },
            {
                name: "Running ci-scripts/run-at-head with ${{ matrix.examples-test-matrix }} configuration",
                run: "./ci-scripts/ci/run-at-head --${{ matrix.examples-test-matrix }}",
            },
            {
                if: "matrix.examples-test-matrix == 'no-latest-packages' || matrix.examples-test-matrix == 'default'",
                run: 'echo "$HOME/.pulumi/bin" >> $GITHUB_PATH', //we need to set the dev version of Pulumi to PATH
            },
            {
                run: 'echo "Currently Pulumi $(pulumi version) is installed"',
            },
            {
                name: "Install Testing Dependencies",
                run: `make ensure`,
            },
            {
                name: "Running ${{ matrix.clouds }}${{ matrix.languages }} Tests",
                run: "make specific_test_set TestSet=${{ matrix.clouds }}${{ matrix.languages }}",
            },
        ]);
    }
}
exports.CronProviderTestJob = CronProviderTestJob;
class RunProviderTestForPrTestJob extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
                languages: ["Cs", "Js", "Ts", "Py", "Fs"],
                clouds: [
                    "DigitalOcean",
                    "Aws",
                    "Azure",
                    "Gcp",
                    "Packet",
                    "EquinixMetal",
                    "Cloud",
                ],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                name: "Install Testing Dependencies",
                run: `make ensure`,
            },
            {
                name: "Running ${{ matrix.clouds }}${{ matrix.languages }} Tests",
                run: "make specific_test_set TestSet=${{ matrix.clouds }}${{ matrix.languages }}",
            },
        ]);
    }
}
exports.RunProviderTestForPrTestJob = RunProviderTestForPrTestJob;
class SmokeTestCliForProvidersJob extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
                languages: ["Cs", "Js", "Ts", "Py", "Fs"],
                clouds: [
                    "DigitalOcean",
                    "Aws",
                    "Azure",
                    "Gcp",
                    "Packet",
                    "EquinixMetal",
                    "Cloud",
                ],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli("{{ env.PULUMI_VERSION }}"),
            steps.PrintPulumiCliVersion(),
            {
                name: "Install Testing Dependencies",
                run: `make ensure`,
            },
            {
                name: "Running ${{ matrix.clouds }}${{ matrix.languages }} Tests",
                run: "make specific_test_set TestSet=${{ matrix.clouds }}${{ matrix.languages }}",
            },
        ]);
    }
}
exports.SmokeTestCliForProvidersJob = SmokeTestCliForProvidersJob;
class SmokeTestKubernetesProviderTestJob extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.needs = "test-infra-setup";
        this.permissions = {
            contents: "read",
            "id-token": "write",
        };
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli("{{ env.PULUMI_VERSION }}"),
            steps.PrintPulumiCliVersion(),
            {
                name: "Install Go Dependencies",
                run: "make ensure",
            },
            {
                name: "Setup Config",
                run: 'mkdir -p "$HOME/.kube/"\n' +
                    'pulumi stack -s "${{ env.PULUMI_TEST_OWNER }}/${{ github.sha }}-${{ github.run_number }}" -C misc/scripts/testinfra/ output --show-secrets kubeconfig >~/.kube/config',
            },
            {
                name: "Run Kubernetes Smoke Tests",
                run: "make specific_tag_set TagSet=Kubernetes",
            },
        ]);
    }
}
exports.SmokeTestKubernetesProviderTestJob = SmokeTestKubernetesProviderTestJob;
class SmokeTestProvidersJob extends EnvironmentSetup {
    constructor() {
        var _a;
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
                languages: ["Cs", "Js", "Ts", "Py", "Fs"],
            },
        };
        this["runs-on"] = "${{ matrix.platform }}";
        this.steps = (_a = this.steps) === null || _a === void 0 ? void 0 : _a.concat([
            steps.InstallPulumiCli("{{ env.PULUMI_VERSION }}"),
            steps.PrintPulumiCliVersion(),
            {
                name: "Install Testing Dependencies",
                run: `make ensure`,
            },
            {
                name: "Running ${{ env.PROVIDER_TESTS_TAG }}${{ matrix.languages }} Smoke Tests",
                run: "make specific_tag_set TestSet=${{ matrix.languages }} TagSet=${{ env.PROVIDER_TESTS_TAG }}",
            },
        ]);
    }
}
exports.SmokeTestProvidersJob = SmokeTestProvidersJob;
class UnitTestingJob {
    constructor() {
        this["runs-on"] = "${{ matrix.platform }}";
        this.name = "Running ${{ matrix.source-dir }} test";
    }
    addDispatchConditional(isWorkflowDispatch) {
        if (isWorkflowDispatch) {
            this.if =
                "github.event_name == 'repository_dispatch' || github.event.pull_request.head.repo.full_name == github.repository";
        }
        return this;
    }
}
exports.UnitTestingJob = UnitTestingJob;
class UnitTestDotNetJob extends UnitTestingJob {
    constructor() {
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                dotnetversion: [dotnetVersion],
                platform: ["ubuntu-latest"],
                "source-dir": [
                    "testing-unit-cs",
                    "testing-unit-cs-mocks",
                    "testing-unit-fs-mocks",
                ],
            },
        };
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallDotNet(),
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                run: "dotnet test",
                "working-directory": "${{ matrix.source-dir }}",
            },
        ];
    }
}
exports.UnitTestDotNetJob = UnitTestDotNetJob;
class UnitTestPythonJob extends UnitTestingJob {
    constructor() {
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                pythonversion: [pythonVersion],
                platform: ["ubuntu-latest"],
                "source-dir": ["testing-unit-py"],
            },
        };
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallPython(),
            steps.InstallPythonDeps(),
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                run: "python3 -m venv venv\n" +
                    "source venv/bin/activate\n" +
                    "pip3 install -r requirements.txt\n" +
                    "python -m unittest",
                "working-directory": "${{ matrix.source-dir }}",
            },
        ];
    }
}
exports.UnitTestPythonJob = UnitTestPythonJob;
class UnitTestNodeJSJob extends UnitTestingJob {
    constructor() {
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                nodeversion: [nodeVersion],
                platform: ["ubuntu-latest"],
                "source-dir": ["testing-unit-ts"],
            },
        };
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallNodeJS(),
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                run: "npm install\n" +
                    "npm install --global mocha\n" +
                    "npm install --global ts-node\n" +
                    "mocha -r ts-node/register ec2tests.ts\n" +
                    "mocha -r ts-node/register bucket_pair_test.ts",
                "working-directory": "${{ matrix.source-dir }}/mocha",
            },
        ];
    }
}
exports.UnitTestNodeJSJob = UnitTestNodeJSJob;
class UnitTestGoJob extends UnitTestingJob {
    constructor() {
        super(...arguments);
        this.strategy = {
            "fail-fast": false,
            matrix: {
                platform: ["ubuntu-latest"],
                "source-dir": ["testing-unit-go"],
            },
        };
        this.steps = [
            steps.CheckoutRepoStep(),
            steps.InstallGo(),
            steps.InstallPulumiCli(),
            steps.PrintPulumiCliVersion(),
            {
                run: "go test",
                "working-directory": "${{ matrix.source-dir }}",
            },
        ];
    }
}
exports.UnitTestGoJob = UnitTestGoJob;
function CronWorkflow(name) {
    return {
        name: name,
        on: {
            schedule: [
                {
                    cron: "0 9 * * *",
                },
            ],
            repository_dispatch: {
                types: ["trigger-cron"],
            },
        },
        env: Object.assign(Object.assign({}, env()), { PULUMI_ENABLE_RESOURCE_REFERENCES: "1" }),
        jobs: {
            providers: new CronProviderTestJob("providers", {}),
            linting: new Linting("lint"),
            "test-infra-setup": new TestInfraSetup("test-infra-setup"),
            "test-infra-destroy": new TestInfraDestroy("test-infra-destroy"),
            kubernetes: new KubernetesProviderTestJob("kubernetes"),
            "dotnet-unit-testing": new UnitTestDotNetJob(),
            "ts-unit-testing": new UnitTestNodeJSJob(),
            "go-unit-testing": new UnitTestGoJob(),
            "python-unit-testing": new UnitTestPythonJob(),
        },
    };
}
exports.CronWorkflow = CronWorkflow;
function SmokeTestCliWorkflow(name) {
    return {
        name,
        on: {
            repository_dispatch: {
                types: ["smoke-test-cli"],
            },
        },
        env: Object.assign(Object.assign({}, env()), { PULUMI_VERSION: "${{ github.event.client_payload.ref }}" }),
        jobs: {
            providers: new SmokeTestCliForProvidersJob("smoke-test-cli-on-providers", {}),
            "test-infra-setup": new TestInfraSetup("test-infra-setup"),
            "test-infra-destroy": new TestInfraDestroy("test-infra-destroy"),
            kubernetes: new SmokeTestCliForKubernetesProviderTestJob("smoke-test-cli-on-kubernetes"),
            "dotnet-unit-testing": new UnitTestDotNetJob(),
            "ts-unit-testing": new UnitTestNodeJSJob(),
            "go-unit-testing": new UnitTestGoJob(),
            "python-unit-testing": new UnitTestPythonJob(),
        },
    };
}
exports.SmokeTestCliWorkflow = SmokeTestCliWorkflow;
function SmokeTestProvidersWorkflow(name) {
    return {
        name,
        on: {
            repository_dispatch: {
                types: ["smoke-test-provider"],
            },
        },
        env: Object.assign(Object.assign({}, env()), { PROVIDER_TESTS_TAG: "${{ github.event.client_payload.ref }}" }),
        jobs: {
            providers: new SmokeTestProvidersJob("smoke-test-providers"),
            "test-infra-setup": new TestInfraSetup("test-infra-setup"),
            "test-infra-destroy": new TestInfraDestroy("test-infra-destroy"),
            kubernetes: new SmokeTestKubernetesProviderTestJob("smoke-test-kubernetes-provider"),
            "dotnet-unit-testing": new UnitTestDotNetJob(),
            "ts-unit-testing": new UnitTestNodeJSJob(),
            "go-unit-testing": new UnitTestGoJob(),
            "python-unit-testing": new UnitTestPythonJob(),
        },
    };
}
exports.SmokeTestProvidersWorkflow = SmokeTestProvidersWorkflow;
function PrWorkFlow(name) {
    return {
        name,
        on: {
            pull_request_target: {},
        },
        jobs: {
            "comment-on-pr": new CommentOnPrJob("comment-on-pr", {}),
        },
    };
}
exports.PrWorkFlow = PrWorkFlow;
class CommandDispatchWorkflow {
    constructor() {
        this.name = "Command Dispatch for testing";
        this.on = {
            issue_comment: {
                types: ["created", "edited"],
            },
        };
        this.jobs = {
            "command-dispatch-for-testing": {
                "runs-on": "ubuntu-latest",
                steps: [
                    steps.CheckoutRepoStep(),
                    {
                        name: "Run Build",
                        uses: "peter-evans/slash-command-dispatch@v2",
                        with: {
                            token: "${{ secrets.EVENT_PAT }}",
                            "reaction-token": "${{ secrets.GITHUB_TOKEN }}",
                            commands: "run-example-tests",
                            permission: "write",
                            "issue-type": "pull-request",
                            repository: "pulumi/examples",
                        },
                    },
                ],
            },
        };
    }
}
exports.CommandDispatchWorkflow = CommandDispatchWorkflow;
function RunTestsCommandWorkflow(name) {
    return {
        name,
        on: {
            repository_dispatch: {
                types: ["run-example-tests-command"],
            },
            pull_request: {
                branches: ["master"],
            },
        },
        env: Object.assign(Object.assign({}, env()), { PR_COMMIT_SHA: "${{ github.event.client_payload.pull_request.head.sha }}" }),
        jobs: {
            "comment-notification": new ResultsCommentJob("comment-notification"),
            "test-infra-setup": new TestInfraSetup("test-infra-setup").addDispatchConditional(true),
            "test-infra-destroy": new TestInfraDestroy("test-infra-destroy").addDispatchConditional(true),
            linting: new Linting("lint").addDispatchConditional(true),
            kubernetes: new KubernetesProviderTestJob("kubernetes").addDispatchConditional(true),
            providers: new RunProviderTestForPrTestJob("run-provider-tests").addDispatchConditional(true),
            "dotnet-unit-testing": new UnitTestDotNetJob().addDispatchConditional(true),
            "ts-unit-testing": new UnitTestNodeJSJob().addDispatchConditional(true),
            "go-unit-testing": new UnitTestGoJob().addDispatchConditional(true),
            "python-unit-testing": new UnitTestPythonJob().addDispatchConditional(true),
            "status-checks": new StatusCheckJob("Final Status Check"),
        },
    };
}
exports.RunTestsCommandWorkflow = RunTestsCommandWorkflow;
const generateExamplesFiles = () => {
    return [
        {
            path: "cron.yml",
            data: CronWorkflow("Run Examples Cron Job"),
        },
        {
            path: "command_dispatch.yml",
            data: new CommandDispatchWorkflow(),
        },
        {
            path: "pr.yml",
            data: PrWorkFlow("New Pull request Open"),
        },
        {
            path: "run-tests-command.yml",
            data: RunTestsCommandWorkflow("Run Examples Tests From PR"),
        },
        {
            path: "smoke-test-cli-command.yml",
            data: SmokeTestCliWorkflow("Smoke Test Specific Version of CLI"),
        },
        {
            path: "smoke-test-provider-command.yml",
            data: SmokeTestProvidersWorkflow("Smoke Test Latest Provider Release"),
        },
    ];
};
exports.generateExamplesFiles = generateExamplesFiles;
//# sourceMappingURL=examples.js.map