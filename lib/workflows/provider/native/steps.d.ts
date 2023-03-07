import { NormalJob } from "../github-workflow";
export type Step = Required<NormalJob>["steps"][0];
export declare function CheckoutRepoStep(): Step;
export declare function CommandDispatchStep(providerName: string): Step;
export declare function CommentPRWithSlashCommandStep(): Step;
export declare function CreateCommentsUrlStep(): Step;
export declare function SetGitSubmoduleCommitHash(provider: string): Step;
export declare function CommitAutomatedSDKUpdates(provider: string): Step;
export declare function EchoSuccessStep(): Step;
export declare function UpdatePRWithResultsStep(): Step;
export declare function CheckoutRepoStepAtPR(): Step;
export declare function CheckoutScriptsRepoStep(): Step;
export declare function CheckoutTagsStep(skipProvider?: string): Step;
export declare function GoogleAuth(requiresGcp?: boolean): Step;
export declare function SetupGCloud(requiresGcp?: boolean): Step;
export declare function ConfigureAwsCredentialsForTests(requiresAws?: boolean): Step;
export declare function ConfigureAwsCredentialsForPublish(): Step;
export declare function InstallGo(version?: string): Step;
export declare function InstallNodeJS(version?: string): Step;
export declare function InstallDotNet(version?: string): Step;
export declare function InstallJava(version?: string): Step;
export declare function InstallPython(version?: string): Step;
export declare function InstallPlugins(): Step;
export declare function InstallPythonDeps(): Step;
export declare function InstallSDKDeps(): Step;
export declare function InstallPulumiCtl(): Step;
export declare function InstallSchemaChecker(provider: string): Step;
export declare function DispatchDocsBuildEvent(): Step;
export declare function InstallPulumiCli(): Step;
export declare function RunDockerComposeStep(required?: boolean): Step;
export declare function RunSetUpScriptStep(setupScript?: string): Step;
export declare function BuildCodegenBinaries(provider: string): Step;
export declare function BuildSDKs(provider: string): Step;
export declare function UploadProviderBinaries(): Step;
export declare function UploadSDKs(): Step;
export declare function DownloadProviderBinaries(provider: string, job: string): Step;
export declare function DownloadSDKs(): Step;
export declare function UnzipSDKs(): Step;
export declare function ZipSDKsStep(): Step;
export declare function CheckCleanWorkTree(): Step;
export declare function SetNugetSource(): Step;
export declare function SetPackageVersionToEnv(): Step;
export declare function RunTests(provider: string): Step;
export declare function CommitEmptySDK(): Step;
export declare function PullRequestSdkGeneration(provider: string): Step;
export declare function CheckSchemaChanges(provider: string): Step;
export declare function LabelIfNoBreakingChanges(provider: string): Step;
export declare function CommentSchemaChangesOnPR(provider: string): Step;
export declare function SchemaFileChanged(provider: string): Step;
export declare function SetupGotestfmt(): Step;
export declare function SdkFilesChanged(): Step;
export declare function InitializeSubModules(submodules?: boolean): Step;
export declare function BuildSchema(provider: string): Step;
export declare function BuildProvider(provider: string): Step;
export declare function TestProviderLibrary(): Step;
export declare function RestoreBinaryPerms(provider: string, job: string): Step;
export declare function GenerateSDKs(provider: string): Step;
export declare function UpdatePath(): Step;
export declare function InstallNodeDeps(): Step;
export declare function InstallKubectl(provider: string): Step;
export declare function LoginGoogleCloudRegistry(provider: string): Step;
export declare function SetStackName(provider: string): Step;
export declare function CreateTestCluster(provider: string): Step;
export declare function UploadKubernetesArtifacts(provider: string): Step;
export declare function DestroyTestCluster(provider: string): Step;
export declare function DeleteArtifact(provider: string): Step;
export declare function BuildK8sgen(provider: string): Step;
export declare function PrepareOpenAPIFile(provider: string): Step;
export declare function MakeKubernetesProvider(provider: string): Step;
export declare function TarProviderBinaries(): Step;
export declare function UnTarProviderBinaries(provider: string, job: string): Step;
export declare function MakeKubeDir(provider: string): Step;
export declare function DownloadKubeconfig(provider: string): Step;
export declare function InstallandConfigureHelm(provider: string): Step;
export declare function GolangciLint(): Step;
export declare function CodegenDuringSDKBuild(provider: string): {
    name: string;
    if: string;
    run: string;
} | {
    name?: undefined;
    if?: undefined;
    run?: undefined;
};
export declare function UpdatePulumi(provider: string): Step;
export declare function ProviderWithPulumiUpgrade(provider: string): Step;
export declare function CreateUpdatePulumiPR(): Step;
export declare function SetPRAutoMerge(provider?: string): Step;
export declare function SetPreReleaseVersion(): Step;
export declare function SetVersionIfAvailable(): Step;
export declare function RunGoReleaserWithArgs(args?: string): Step;
export declare function TagSDKTag(): Step;
export declare function NotifySlack(name: string): Step;
export declare function DownloadSpecificSDKStep(name: string): Step;
export declare function UnzipSpecificSDKStep(name: string): Step;
export declare function InstallTwine(): Step;
export declare function RunPublishSDK(): Step;
export declare function RunPublishJavaSDK(): Step;
export declare function Porcelain(): Step;
export declare function ChocolateyPackageDeployment(): Step;
export declare function AzureLogin(provider: string): Step;
export declare function AwsCredentialsForArmCoverageReport(): Step;
export declare function MakeClean(): Step;
export declare function MakeLocalGenerate(): Step;
export declare function GenerateCoverageReport(): Step;
export declare function TestResultsJSON(): Step;
export declare function UploadArmCoverageToS3(): Step;
export declare function PrepareGitBranchForSdkGeneration(): Step;
export declare function UpdateSubmodules(provider: string): Step;
export declare function MakeDiscovery(provider: string): Step;
//# sourceMappingURL=steps.d.ts.map