import { GithubWorkflow, NormalJob } from "../github-workflow";
import { Step } from "./steps";
import { WorkflowOpts } from '../../../config';
export declare function CommandDispatchWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function PullRequestWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function RunAcceptanceTestsWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function BuildWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function PrereleaseWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function ReleaseWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function WeeklyPulumiUpdateWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function NightlySdkGenerationWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function Cf2PulumiReleaseWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function Arm2PulumiCoverageReportWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare function Arm2PulumiReleaseWorkflow(name: string, opts: WorkflowOpts): GithubWorkflow;
export declare class BuildSdkJob implements NormalJob {
    needs: string;
    "runs-on": string;
    strategy: {
        "fail-fast": boolean;
        matrix: {
            language: string[];
        };
    };
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    constructor(name: string, opts: WorkflowOpts);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
    addRunsOn(provider: string): this;
}
export declare class PrerequisitesJob implements NormalJob {
    "runs-on": string;
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    constructor(name: string, opts: WorkflowOpts);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class TestsJob implements NormalJob {
    "runs-on": string;
    needs: string[];
    strategy: {
        "fail-fast": boolean;
        matrix: {
            language: string[];
        };
    };
    permissions: NormalJob["permissions"];
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    constructor(name: string, opts: WorkflowOpts);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class BuildTestClusterJob implements NormalJob {
    "runs-on": string;
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    outputs: NormalJob["outputs"];
    permissions: NormalJob["permissions"];
    constructor(name: string, opts: WorkflowOpts);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class TeardownTestClusterJob implements NormalJob {
    "runs-on": string;
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    needs: NormalJob["needs"];
    permissions: NormalJob["permissions"];
    constructor(name: string, opts: WorkflowOpts);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class LintKubernetesJob implements NormalJob {
    "runs-on": string;
    steps: {
        id?: string | undefined;
        if?: string | undefined;
        name?: string | undefined;
        uses?: string | undefined;
        run?: string | undefined;
        "working-directory"?: string | undefined;
        shell?: string | undefined;
        with?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        env?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        "continue-on-error"?: string | boolean | undefined;
        "timeout-minutes"?: number | undefined;
    }[];
    name: string;
    if: NormalJob["if"];
    constructor(name: string);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class PublishPrereleaseJob implements NormalJob {
    "runs-on": string;
    needs: string;
    steps: NormalJob["steps"];
    name: string;
    constructor(name: string, opts: WorkflowOpts);
}
export declare class PublishJob implements NormalJob {
    "runs-on": string;
    needs: string;
    name: string;
    steps: NormalJob["steps"];
    constructor(name: string, opts: WorkflowOpts);
}
export declare class PublishSDKJob implements NormalJob {
    "runs-on": string;
    needs: string;
    name: string;
    steps: NormalJob["steps"];
    constructor(name: string);
}
export declare class PublishJavaSDKJob implements NormalJob {
    "runs-on": string;
    "continue-on-error": boolean;
    needs: string;
    name: string;
    steps: NormalJob["steps"];
    constructor(name: string);
}
export declare class TagSDKJob implements NormalJob {
    "runs-on": string;
    needs: string;
    steps: {
        id?: string | undefined;
        if?: string | undefined;
        name?: string | undefined;
        uses?: string | undefined;
        run?: string | undefined;
        "working-directory"?: string | undefined;
        shell?: string | undefined;
        with?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        env?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        "continue-on-error"?: string | boolean | undefined;
        "timeout-minutes"?: number | undefined;
    }[];
    name: string;
    constructor(name: string);
}
export declare class DocsBuildDispatchJob implements NormalJob {
    "runs-on": string;
    needs: string;
    steps: {
        id?: string | undefined;
        if?: string | undefined;
        name?: string | undefined;
        uses?: string | undefined;
        run?: string | undefined;
        "working-directory"?: string | undefined;
        shell?: string | undefined;
        with?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        env?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        "continue-on-error"?: string | boolean | undefined;
        "timeout-minutes"?: number | undefined;
    }[];
    name: string;
    constructor(name: string);
}
export declare class Cf2PulumiRelease implements NormalJob {
    "runs-on": string;
    steps: {
        id?: string | undefined;
        if?: string | undefined;
        name?: string | undefined;
        uses?: string | undefined;
        run?: string | undefined;
        "working-directory"?: string | undefined;
        shell?: string | undefined;
        with?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        env?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        "continue-on-error"?: string | boolean | undefined;
        "timeout-minutes"?: number | undefined;
    }[];
    name: string;
    constructor(name: string);
}
export declare class Arm2PulumiRelease implements NormalJob {
    "runs-on": string;
    steps: {
        id?: string | undefined;
        if?: string | undefined;
        name?: string | undefined;
        uses?: string | undefined;
        run?: string | undefined;
        "working-directory"?: string | undefined;
        shell?: string | undefined;
        with?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        env?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        "continue-on-error"?: string | boolean | undefined;
        "timeout-minutes"?: number | undefined;
    }[];
    name: string;
    constructor(name: string);
}
export declare class Arm2PulumiCoverageReport implements NormalJob {
    "runs-on": string;
    steps: {
        id?: string | undefined;
        if?: string | undefined;
        name?: string | undefined;
        uses?: string | undefined;
        run?: string | undefined;
        "working-directory"?: string | undefined;
        shell?: string | undefined;
        with?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        env?: string | {
            [k: string]: string | number | boolean;
        } | undefined;
        "continue-on-error"?: string | boolean | undefined;
        "timeout-minutes"?: number | undefined;
    }[];
    name: string;
    constructor(name: string);
}
export declare class WeeklyPulumiUpdate implements NormalJob {
    "runs-on": string;
    steps: NormalJob["steps"];
    if: NormalJob["if"];
    constructor(name: string, opts: WorkflowOpts);
}
export declare class NightlySdkGeneration implements NormalJob {
    "runs-on": string;
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    constructor(name: string, opts: WorkflowOpts);
}
export declare class EmptyJob implements NormalJob {
    steps: Step[];
    "runs-on": string;
    strategy: NormalJob["strategy"];
    name: string;
    if?: string;
    needs?: string[];
    constructor(name: string, params?: Partial<NormalJob>);
    addStep(step: Step): this;
    addStrategy(strategy: NormalJob["strategy"]): this;
    addConditional(conditional: string): this;
    addNeeds(name: string[]): this;
}
//# sourceMappingURL=workflows.d.ts.map