import { GithubWorkflow, NormalJob } from "../github-workflow";
import { ProviderFile } from "..";
import { Step } from "./steps";
export declare class Linting implements NormalJob {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            "yarn-version": string[];
            nodeversion: string[];
            platform: string[];
        };
    };
    "runs-on": string;
    permissions: NormalJob["permissions"];
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
    constructor(name: string, params?: Partial<Linting>);
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class CommentOnPrJob implements NormalJob {
    "runs-on": string;
    if: string;
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
    constructor(name: string, params?: Partial<Linting>);
}
export declare class ResultsCommentJob implements NormalJob {
    "runs-on": string;
    if: string;
    steps: ({
        name: string;
        id: string;
        run: string;
        uses?: undefined;
        with?: undefined;
    } | {
        name: string;
        uses: string;
        with: {
            token: string;
            repository: string;
            "issue-number": string;
            body: string;
        };
        id?: undefined;
        run?: undefined;
    })[];
    name: string;
    constructor(name: string, params?: Partial<ResultsCommentJob>);
}
export declare class StatusCheckJob implements NormalJob {
    "runs-on": string;
    if: string;
    needs: string[];
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
    constructor(name: string, params?: Partial<ResultsCommentJob>);
}
export declare abstract class EnvironmentSetup implements NormalJob {
    "runs-on": NormalJob["runs-on"];
    permissions: NormalJob["permissions"];
    steps: NormalJob["steps"];
    name: string;
    if: NormalJob["if"];
    constructor(name: string, params?: Partial<EnvironmentSetup>);
    addStep(step: Step): this;
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class TestInfraSetup extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
        };
    };
    "runs-on": string;
    permissions: NormalJob["permissions"];
    steps: NormalJob["steps"];
}
export declare class ConditionalTestInfraSetup extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
        };
    };
    "runs-on": string;
    steps: NormalJob["steps"];
}
export declare class TestInfraDestroy extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
        };
    };
    "runs-on": string;
    needs: string;
    steps: NormalJob["steps"];
}
export declare class KubernetesProviderTestJob extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
        };
    };
    "runs-on": string;
    needs: string;
    permissions: NormalJob["permissions"];
    steps: NormalJob["steps"];
}
export declare class SmokeTestCliForKubernetesProviderTestJob extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
        };
    };
    "runs-on": string;
    needs: string;
    steps: NormalJob["steps"];
}
export declare class CronProviderTestJob extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
            languages: string[];
            clouds: string[];
            "examples-test-matrix": string[];
        };
    };
    "runs-on": string;
    steps: NormalJob["steps"];
}
export declare class RunProviderTestForPrTestJob extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
            languages: string[];
            clouds: string[];
        };
    };
    "runs-on": string;
    permissions: NormalJob["permissions"];
    steps: NormalJob["steps"];
}
export declare class SmokeTestCliForProvidersJob extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
            languages: string[];
            clouds: string[];
        };
    };
    "runs-on": string;
    steps: NormalJob["steps"];
}
export declare class SmokeTestKubernetesProviderTestJob extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
        };
    };
    "runs-on": string;
    needs: string;
    permissions: NormalJob["permissions"];
    steps: NormalJob["steps"];
}
export declare class SmokeTestProvidersJob extends EnvironmentSetup {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
            languages: string[];
        };
    };
    "runs-on": string;
    steps: NormalJob["steps"];
}
export declare class UnitTestingJob implements NormalJob {
    "runs-on": string;
    name: string;
    if: NormalJob["if"];
    addDispatchConditional(isWorkflowDispatch: boolean): this;
}
export declare class UnitTestDotNetJob extends UnitTestingJob {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            dotnetversion: string[];
            platform: string[];
            "source-dir": string[];
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
}
export declare class UnitTestPythonJob extends UnitTestingJob {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            pythonversion: string[];
            platform: string[];
            "source-dir": string[];
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
}
export declare class UnitTestNodeJSJob extends UnitTestingJob {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            nodeversion: string[];
            platform: string[];
            "source-dir": string[];
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
}
export declare class UnitTestGoJob extends UnitTestingJob {
    strategy: {
        "fail-fast": boolean;
        matrix: {
            platform: string[];
            "source-dir": string[];
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
}
export declare function CronWorkflow(name: string): GithubWorkflow;
export declare function SmokeTestCliWorkflow(name: string): GithubWorkflow;
export declare function SmokeTestProvidersWorkflow(name: string): GithubWorkflow;
export declare function PrWorkFlow(name: string): GithubWorkflow;
export declare class CommandDispatchWorkflow implements GithubWorkflow {
    name: string;
    on: {
        issue_comment: {
            types: string[];
        };
    };
    jobs: {
        "command-dispatch-for-testing": {
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
        };
    };
}
export declare function RunTestsCommandWorkflow(name: string): GithubWorkflow;
export declare const generateExamplesFiles: () => ProviderFile[];
//# sourceMappingURL=examples.d.ts.map