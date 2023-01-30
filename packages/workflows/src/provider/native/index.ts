import * as path from "path";
import * as shared from "../shared-workflows";
import * as wf from "./workflows";
import * as goreleaser from "./goreleaser";
import { getNativeProviderConfig } from "@pulumi/build-config";
import { ProviderFile } from "..";

export const buildProviderFiles = (provider: string): ProviderFile[] => {
  const config = getNativeProviderConfig(provider);
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
    files.push(
      {
        path: path.join(githubWorkflowsDir, "cf2pulumi-release.yml"),
        data: wf.Cf2PulumiReleaseWorkflow("cf2pulumi-release", config),
      },
      {
        path: path.join(githubWorkflowsDir, "nightly-sdk-generation.yml"),
        data: wf.NightlySdkGenerationWorkflow("nightly-sdk-generation", config),
      }
    );
  }
  if (config.provider === "azure-native") {
    files.push(
      {
        path: path.join(githubWorkflowsDir, "arm2pulumi-release.yml"),
        data: wf.Arm2PulumiReleaseWorkflow("arm2pulumi-release", config),
      },
      {
        path: path.join(githubWorkflowsDir, "arm2pulumi-coverage-report.yml"),
        data: wf.Arm2PulumiCoverageReportWorkflow("generate-coverage", config),
      },
      {
        path: path.join(githubWorkflowsDir, "nightly-sdk-generation.yml"),
        data: wf.NightlySdkGenerationWorkflow("nightly-sdk-generation", config),
      }
    );
  }
  if (config.provider === "google-native") {
    files.push({
      path: path.join(githubWorkflowsDir, "nightly-sdk-generation.yml"),
      data: wf.NightlySdkGenerationWorkflow("nightly-sdk-generation", config),
    });
  }
  return files;
};
