import { BridgedConfig } from '../../../config';
import { GithubWorkflow, NormalJob } from "../github-workflow";
import { Step } from "./steps";
export declare function DefaultBranchWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
export declare function NightlyCronWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
export declare function ReleaseWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
export declare function PrereleaseWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
export declare function RunAcceptanceTestsWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
export declare function PullRequestWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
interface UpdatePulumiTerraformBridgeWorkflowArgs {
    providerDefaultBranch: string;
}
export declare function UpdatePulumiTerraformBridgeWorkflow(args: UpdatePulumiTerraformBridgeWorkflowArgs): GithubWorkflow;
export declare function ResyncBuildWorkflow(opts: BridgedConfig): GithubWorkflow;
export declare function UpdateUpstreamProviderWorkflow(opts: BridgedConfig): GithubWorkflow;
export declare function CommandDispatchWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
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
export declare class BuildSdkJob implements NormalJob {
    needs: string;
    "runs-on": string;
    strategy: {
        "fail-fast": boolean;
        matrix: {
            language: string[];
        };
    };
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
export declare class PrerequisitesJob implements NormalJob {
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
export declare class TestsJob implements NormalJob {
    "runs-on": string;
    needs: string;
    strategy: {
        "fail-fast": boolean;
        matrix: {
            language: string[];
        };
    };
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    permissions: NormalJob["permissions"];
    constructor(name: string, opts: BridgedConfig);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class PublishPrereleaseJob implements NormalJob {
    "runs-on": string;
    needs: string;
    steps: NormalJob["steps"];
    name: string;
    constructor(name: string, opts: BridgedConfig);
}
export declare class PublishJob implements NormalJob {
    "runs-on": string;
    needs: string;
    name: string;
    steps: NormalJob["steps"];
    constructor(name: string, opts: BridgedConfig);
}
export declare class DocsBuildJob implements NormalJob {
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
export declare class PublishSDKJob implements NormalJob {
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
export declare class PublishJavaSDKJob implements NormalJob {
    "runs-on": string;
    "continue-on-error": boolean;
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
export declare class LintProviderJob implements NormalJob {
    "runs-on": string;
    container: string;
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
export declare class LintSDKJob implements NormalJob {
    "runs-on": string;
    needs: string;
    container: string;
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    constructor(name: string, opts: BridgedConfig);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class GenerateCoverageDataJob implements NormalJob {
    "runs-on": string;
    "continue-on-error": boolean;
    needs: string;
    env: {
        COVERAGE_OUTPUT_DIR: string;
    };
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
export declare class WarnCodegenJob implements NormalJob {
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
export declare function ModerationWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
export declare class ThirdpartyPrerequisitesJob implements NormalJob {
    name: string;
    "runs-on": string;
    if: NormalJob["if"];
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
    constructor(name: string);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class ThirdpartyBuildSdkJob implements NormalJob {
    needs: string;
    "runs-on": string;
    strategy: {
        "fail-fast": boolean;
        matrix: {
            language: string[];
        };
    };
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
export declare function ThirdPartyDefaultBranchWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
export declare class ThirdpartyPublishJob implements NormalJob {
    "runs-on": string;
    needs: string;
    name: string;
    steps: NormalJob["steps"];
    constructor(name: string, opts: BridgedConfig);
}
export declare class ThirdpartyPublishSDKJob implements NormalJob {
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
export declare function ThirdpartyReleaseWorkflow(name: string, opts: BridgedConfig): GithubWorkflow;
export {};
//# sourceMappingURL=workflows.d.ts.map