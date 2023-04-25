"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArtifact = exports.slashCommand = exports.prComment = exports.pullRequest = exports.pathsFilter = exports.notifySlack = exports.downloadArtifact = exports.deleteArtifact = exports.createOrUpdateComment = exports.cleanupArtifact = exports.checkout = exports.autoMerge = exports.addLabel = exports.addAndCommit = exports.installPulumiCli = exports.installGhRelease = exports.gradleBuildAction = exports.goReleaser = exports.googleAuth = exports.setupGcloud = exports.configureAwsCredentials = exports.azureLogin = exports.setupPython = exports.setupNode = exports.setupJava = exports.setupDotNet = exports.setupGo = exports.goLint = void 0;
// Languages
exports.goLint = "golangci/golangci-lint-action@v3";
exports.setupGo = "actions/setup-go@v2";
exports.setupDotNet = "actions/setup-dotnet@v1";
exports.setupJava = "actions/setup-java@v3";
exports.setupNode = "actions/setup-node@v2";
exports.setupPython = "actions/setup-python@v2";
// Cloud Auth
exports.azureLogin = "azure/login@v1";
exports.configureAwsCredentials = "aws-actions/configure-aws-credentials@v1";
exports.setupGcloud = "google-github-actions/setup-gcloud@v0";
exports.googleAuth = "google-github-actions/auth@v0";
// Tools
exports.goReleaser = "goreleaser/goreleaser-action@v2";
exports.gradleBuildAction = "gradle/gradle-build-action@9b814496b50909128c6a52622b416c5ffa04db49";
exports.installGhRelease = "jaxxstorm/action-install-gh-release@v1.5.0";
exports.installPulumiCli = "pulumi/action-install-pulumi-cli@v2";
// GHA Utilities
exports.addAndCommit = "EndBug/add-and-commit@v7";
exports.addLabel = "actions-ecosystem/action-add-labels@v1.1.0";
exports.autoMerge = "peter-evans/enable-pull-request-automerge@v1";
exports.checkout = "actions/checkout@v3";
exports.cleanupArtifact = "c-hive/gha-remove-artifacts@v1";
exports.createOrUpdateComment = "peter-evans/create-or-update-comment@v1";
exports.deleteArtifact = "geekyeggo/delete-artifact@v1";
exports.downloadArtifact = "actions/download-artifact@v2";
exports.notifySlack = "8398a7/action-slack@v3";
exports.pathsFilter = "dorny/paths-filter@v2";
exports.pullRequest = "repo-sync/pull-request@v2.6.2";
exports.prComment = "thollander/actions-comment-pull-request@v1";
exports.slashCommand = "peter-evans/slash-command-dispatch@v2";
exports.uploadArtifact = "actions/upload-artifact@v2";
//# sourceMappingURL=action-versions.js.map