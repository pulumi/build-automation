"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulumiGolangCIConfig = void 0;
class PulumiGolangCIConfig {
    constructor(timeout) {
        this.linters = {
            "enable-all": false,
            enable: [
                "deadcode",
                "errcheck",
                "goconst",
                "gofmt",
                "golint",
                "gosec",
                "govet",
                "ineffassign",
                "interfacer",
                "lll",
                "megacheck",
                "misspell",
                "nakedret",
                "structcheck",
                "unconvert",
                "varcheck",
            ],
        };
        this.run = {
            timeout: timeout,
            "skip-files": ["schema.go", "pulumiManifest.go"],
        };
    }
}
exports.PulumiGolangCIConfig = PulumiGolangCIConfig;
//# sourceMappingURL=golangci.js.map