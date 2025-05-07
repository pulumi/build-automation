export declare class ArtifactCleanupWorkflow {
    name: string;
    on: {
        schedule: {
            cron: string;
        }[];
    };
    jobs: {
        "remove-old-artifacts": {
            "runs-on": string;
            steps: {
                name: string;
                uses: string;
                with: {
                    age: string;
                    "skip-tags": boolean;
                };
            }[];
        };
    };
}
//# sourceMappingURL=shared-workflows.d.ts.map