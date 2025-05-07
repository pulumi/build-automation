"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulumiGoreleaserConfig = exports.PulumiGoreleaserPreConfig = void 0;
class PulumiGoreleaserPreConfig {
    constructor(opts) {
        let ldflags;
        const ignores = [];
        if (opts.skipWindowsArmBuild) {
            ignores.push({ goos: "windows", goarch: "arm64" });
        }
        if (opts["major-version"] > 1) {
            ldflags = [
                `-X github.com/pulumi/pulumi-${opts.provider}/provider/v${opts["major-version"]}/pkg/version.Version={{.Tag}}`,
            ];
        }
        else {
            ldflags = [
                `-X github.com/pulumi/pulumi-${opts.provider}/provider/pkg/version.Version={{.Tag}}`,
            ];
        }
        if (opts.providerVersion !== "") {
            ldflags.push(`-X ${opts.providerVersion}={{.Tag}}`);
        }
        if (!opts.skipTfGen) {
            this.before = {
                hooks: ["make tfgen"],
            };
        }
        this.builds = [
            {
                dir: "provider",
                env: ["CGO_ENABLED=0", "GO111MODULE=on"],
                goos: ["darwin", "windows", "linux"],
                goarch: ["amd64", "arm64"],
                ignore: ignores,
                main: `./cmd/pulumi-resource-${opts.provider}/`,
                ldflags: ldflags,
                binary: `pulumi-resource-${opts.provider}`,
            },
        ];
        this.archives = [
            {
                name_template: "{{ .Binary }}-{{ .Tag }}-{{ .Os }}-{{ .Arch }}",
                id: "archive",
            },
        ];
        this.snapshot = {
            name_template: "{{ .Tag }}-SNAPSHOT",
        };
        this.changelog = {
            skip: true,
        };
        this.release = {
            disable: true,
        };
        this.blobs = [
            {
                provider: "s3",
                region: "us-west-2",
                bucket: "get.pulumi.com",
                folder: "releases/plugins/",
                ids: ["archive"],
            },
        ];
    }
}
exports.PulumiGoreleaserPreConfig = PulumiGoreleaserPreConfig;
class PulumiGoreleaserConfig extends PulumiGoreleaserPreConfig {
    constructor(opts) {
        super(opts);
        this.release = {
            disable: false,
        };
        this.changelog = {
            use: "git",
            sort: "asc",
            filters: {
                exclude: [
                    "Merge branch",
                    "Merge pull request",
                    "\\Winternal\\W",
                    "\\Wci\\W",
                    "\\Wchore\\W",
                ],
            },
        };
    }
}
exports.PulumiGoreleaserConfig = PulumiGoreleaserConfig;
//# sourceMappingURL=goreleaser.js.map