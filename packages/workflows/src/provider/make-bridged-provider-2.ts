import { BridgedConfig } from "@pulumi/build-config";
import { Makefile, Target, Variables } from "./make";

export function bridgedProviderV2(
  config: Pick<
    BridgedConfig,
    "provider" | "providerVersion" | "major-version" | "plugins"
  >
): Makefile {
  const PACK = config.provider;
  const ORG = "pulumi";
  const PROJECT = `github.com/$(ORG)/pulumi-$(PACK)`;
  const PROVIDER_PATH =
    config["major-version"] > 1
      ? `provider/v${config["major-version"]}`
      : `provider`;
  const VERSION_PATH = `$(PROVIDER_PATH)/pkg/version.Version`;
  const TFGEN = `pulumi-tfgen-$(PACK)`;
  const PROVIDER = `pulumi-resource-$(PACK)`;
  const WORKING_DIR = "$(shell pwd)";

  const variables: Variables = {
    PACK,
    ORG,
    PROJECT,
    PROVIDER_PATH,
    VERSION_PATH,
    TFGEN,
    PROVIDER,
    TESTPARALLELISM: "10",
    WORKING_DIR,
    PROVIDER_MODS: "provider/go.mod provider/go.sum",
    PROVIDER_PKG_SRC: {
      value: `$(shell find provider/pkg -type f -name "*.go")`,
      type: "recursive",
    },
    TFGEN_CMD_SRC: {
      value: `$(shell find provider/cmd/$(TFGEN) -type f -name "*.go")`,
      type: "recursive",
    },
    PROVIDER_CMD_SRC: {
      value: `$(shell find provider/cmd/$(PROVIDER) -type f -name "*.go")`,
      type: "recursive",
    },
    OVERLAYS_GO: {
      value: `$(shell [ -d "provider/overlays/go" ] && find provider/overlays/go -type f)`,
      type: "recursive",
    },
    OVERLAYS_NODEJS: {
      value: `$(shell [ -d "provider/overlays/nodejs" ] && find provider/overlays/nodejs -type f)`,
      type: "recursive",
    },
    OVERLAYS_PYTHON: {
      value: `$(shell [ -d "provider/overlays/python" ] && find provider/overlays/python -type f)`,
      type: "recursive",
    },
    OVERLAYS_DOTNET: {
      value: `$(shell [ -d "provider/overlays/dotnet" ] && find provider/overlays/dotnet -type f)`,
      type: "recursive",
    },
    // Input during CI using `make [TARGET] PROVIDER_VERSION=""` or by setting a PROVIDER_VERSION environment variable
    // Local builds will just used this fixed default version unless specified
    PROVIDER_VERSION: { type: "conditional", value: "0.0.1-alpha.0+dev" },
    VERSION_GENERIC: {
      type: "recursive",
      value: `$(shell bin/pulumictl convert-version -l generic -v "$(PROVIDER_VERSION)")`,
    },
    VERSION_DOTNET: {
      type: "recursive",
      value: `$(shell bin/pulumictl convert-version -l dotnet -v "$(PROVIDER_VERSION)")`,
    },
    VERSION_JAVASCRIPT: {
      type: "recursive",
      value: `$(shell bin/pulumictl convert-version -l javascript -v "$(VERSION_GENERIC)")`,
    },
    VERSION_PYTHON: {
      type: "recursive",
      value: `$(shell bin/pulumictl convert-version -l python -v "$(VERSION_GENERIC)")`,
    },
    // Fake variable which lets us run a prerequisite commend before any targets
    _: {
      value: "$(shell mkdir -p .make)",
      type: "simple",
    },
  } as const;

  const bin_pulumictl: Target = {
    name: "bin/pulumictl",
    dependencies: [".version.pulumictl.txt"],
    variables: {
      PULUMICTL_VERSION: "$(shell cat .version.pulumictl.txt)",
      PLAT: `$(shell go version | sed -En "s/go version go.* (.*)\\/(.*)/\\1-\\2/p")`,
      PULUMICTL_URL:
        "https://github.com/pulumi/pulumictl/releases/download/$(PULUMICTL_VERSION)/pulumictl-$(PULUMICTL_VERSION)-$(PLAT).tar.gz",
    },
    commands: [
      '@echo "Installing pulumictl"',
      "@mkdir -p bin",
      'wget -q -O - "$(PULUMICTL_URL)" | tar -xzf - -C $(WORKING_DIR)/bin pulumictl',
      "@touch bin/pulumictl",
      '@echo "pulumictl" $$(./bin/pulumictl version)',
    ],
  };
  const make_install_plugins: Target = {
    name: ".make/install_plugins",
    autoTouch: true,
    dependencies: [bin_pulumictl],
    commands: [
      "[ -x $(shell which pulumi) ] || curl -fsSL https://get.pulumi.com | sh",
      ...(config.plugins?.map(
        (p) => `pulumi plugin install resource ${p.name} ${p.version}`
      ) ?? []),
    ],
  };
  const install_plugins: Target = {
    name: "install_plugins",
    phony: true,
    dependencies: [make_install_plugins],
  };
  const bin_tfgen: Target = {
    name: "bin/$(TFGEN)",
    dependencies: [
      make_install_plugins,
      "$(PROVIDER_MODS)",
      "$(PROVIDER_PKG_SRC)",
      "$(TFGEN_CMD_SRC)",
    ],
    commands: [
      [
        "cd provider",
        'go build -p 1 -o $(WORKING_DIR)/bin/$(TFGEN) -ldflags "-X $(PROJECT)/$(VERSION_PATH)=$(VERSION_GENERIC)" $(PROJECT)/$(PROVIDER_PATH)/cmd/$(TFGEN)',
      ],
    ],
  };
  const provider_schema: Target = {
    name: "provider/cmd/$(PROVIDER)/schema.json",
    dependencies: [bin_tfgen, make_install_plugins],
    commands: ["bin/$(TFGEN) schema --out provider/cmd/$(PROVIDER)"],
  };
  const provider_schema_embed: Target = {
    name: "provider/cmd/$(PROVIDER)/schema-embed.json",
    dependencies: [provider_schema],
    commands: [
      [
        "cd provider",
        "VERSION=$(VERSION_GENERIC) go generate cmd/$(PROVIDER)/main.go",
      ],
    ],
  };
  const tfgen: Target = {
    name: "tfgen",
    phony: true,
    dependencies: [make_install_plugins, bin_tfgen, provider_schema],
  };
  const ldFlagStatements = ["-X $(PROJECT)/$(VERSION_PATH)=$(VERSION_GENERIC)"];
  if (config.providerVersion) {
    ldFlagStatements.push(`-X ${config.providerVersion}=$(VERSION_GENERIC)`);
  }
  const ldflags = ldFlagStatements.join(" ");
  const bin_provider: Target = {
    name: "bin/$(PROVIDER)",
    dependencies: [
      make_install_plugins,
      provider_schema_embed,
      "$(PROVIDER_MODS)",
      "$(PROVIDER_PKG_SRC)",
      "$(PROVIDER_CMD_SRC)",
    ],
    commands: [
      `(cd provider && go build -p 1 -o $(WORKING_DIR)/bin/$(PROVIDER) -ldflags "${ldflags}" $(PROJECT)/$(PROVIDER_PATH)/cmd/$(PROVIDER))`,
    ],
  };
  const provider: Target = {
    name: "provider",
    phony: true,
    dependencies: [bin_provider],
  };
  const make_gen_nodejs: Target = {
    name: ".make/gen_nodejs",
    autoTouch: true,
    dependencies: [bin_tfgen, "$(OVERLAYS_NODEJS)"],
    commands: [
      "rm -rf sdk/nodejs",
      "mkdir -p sdk/nodejs",
      "bin/$(TFGEN) nodejs --out sdk/nodejs/",
    ],
  };
  const make_build_nodejs: Target = {
    name: ".make/build_nodejs",
    autoTouch: true,
    dependencies: [make_gen_nodejs],
    commands: [
      [
        "cd sdk/nodejs/",
        'echo "module fake_nodejs_module // Exclude this directory from Go tools\\n\\ngo 1.17" > go.mod',
        "yarn install",
        "yarn run tsc",
        "cp ../../README.md ../../LICENSE* package.json yarn.lock ./bin/",
        'sed -i.bak -e "s/\\$${VERSION}/$(VERSION_JAVASCRIPT)/g" ./bin/package.json',
      ],
    ],
  };
  const build_nodejs: Target = {
    name: "build_nodejs",
    phony: true,
    dependencies: [make_build_nodejs],
  };
  const make_gen_python: Target = {
    name: "gen_python",
    autoTouch: true,
    dependencies: [bin_tfgen, "$(OVERLAYS_PYTHON)"],
    commands: [
      "rm -rf sdk/python",
      "cp README.md sdk/python",
      'echo "module fake_python_module // Exclude this directory from Go tools\\n\\ngo 1.17" > sdk/python/go.mod',
      "bin/$(TFGEN) python --out sdk/python/",
    ],
  };
  const make_build_python: Target = {
    name: ".make/build_python",
    autoTouch: true,
    dependencies: [make_gen_python],
    commands: [
      [
        `cd sdk/python/`,
        `python3 setup.py clean --all 2>/dev/null`,
        `rm -rf ./bin/ ../python.bin/ && cp -R . ../python.bin && mv ../python.bin ./bin`,
        `sed -i.bak -e 's/^VERSION = .*/VERSION = "$(VERSION_PYTHON)"/g' -e 's/^PLUGIN_VERSION = .*/PLUGIN_VERSION = "$(VERSION_PYTHON)"/g' ./bin/setup.py`,
        `rm ./bin/setup.py.bak && rm ./bin/go.mod`,
        `cd ./bin && python3 setup.py build sdist`,
      ],
    ],
  };
  const build_python: Target = {
    name: "build_python",
    phony: true,
    dependencies: [make_build_python],
  };
  const make_gen_go: Target = {
    name: ".make/gen_go",
    autoTouch: true,
    dependencies: [bin_tfgen, "$(OVERLAYS_GO)"],
    commands: ["rm -rf sdk/go", "bin/$(TFGEN) go --out sdk/go/"],
  };
  const make_build_go: Target = {
    name: ".make/build_go",
    autoTouch: true,
    dependencies: [make_gen_go],
    commands: [
      [
        `cd sdk`,
        // The following pulls out the `module` line from go.mod to determine the right
        // module prefix path for the SDK (including versions etc.), then runs a `go list`
        // to determine all packages under the SDK. Finally, this issues a go build on all
        // the packages discovered.
        `go list \`grep -e "^module" go.mod | cut -d ' ' -f 2\`/go/... | xargs go build`,
      ],
    ],
  };
  const build_go: Target = {
    name: "build_go",
    phony: true,
    dependencies: [make_build_go],
  };
  const make_gen_dotnet: Target = {
    name: ".make/gen_dotnet",
    autoTouch: true,
    dependencies: [bin_tfgen, "$(OVERLAYS_DOTNET)"],
    commands: [
      "rm -rf sdk/dotnet",
      "bin/$(TFGEN) dotnet --out sdk/dotnet/",
      'echo "module fake_dotnet_module // Exclude this directory from Go tools\\n\\ngo 1.17" > sdk/dotnet/go.mod',
      'echo "$(VERSION_DOTNET)" > sdk/dotnet/version.txt',
    ],
  };
  const make_build_dotnet: Target = {
    name: ".make/build_dotnet",
    autoTouch: true,
    dependencies: [make_gen_dotnet],
    commands: [["cd sdk/dotnet/", "dotnet build /p:Version=$(VERSION_DOTNET)"]],
  };
  const build_dotnet: Target = {
    name: "build_dotnet",
    phony: true,
    dependencies: [make_build_dotnet],
  };
  const bin_pulumi_java_gen: Target = {
    name: "bin/pulumi-java-gen",
    dependencies: [bin_pulumictl, ".version.javagen.txt"],
    commands: [
      "$(shell bin/pulumictl download-binary -n pulumi-language-java -v $(shell cat .version.javagen.txt) -r pulumi/pulumi-java)",
    ],
  };
  const make_gen_java: Target = {
    name: ".make/gen_java",
    autoTouch: true,
    dependencies: [bin_pulumi_java_gen],
    commands: [
      "rm -rf sdk/java",
      "bin/pulumi-java-gen generate --schema provider/cmd/$(PROVIDER)/schema.json --out sdk/java  --build gradle-nexus",
      'echo "module fake_java_module // Exclude this directory from Go tools\\n\\ngo 1.17" > sdk/java/go.mod',
    ],
  };
  const make_build_java: Target = {
    name: ".make/build_java",
    autoTouch: true,
    dependencies: [make_gen_java],
    commands: [["cd sdk/java", "gradle --console=plain build"]],
  };
  const build_java: Target = {
    name: "build_java",
    phony: true,
    dependencies: [make_build_java],
  };
  const build_sdks: Target = {
    name: "build_sdks",
    phony: true,
    dependencies: [
      build_nodejs,
      build_python,
      build_go,
      build_dotnet,
      build_java,
    ],
  };
  const lint_provider: Target = {
    name: "lint_provider",
    phony: true,
    dependencies: [bin_provider],
    commands: ["cd provider && golangci-lint run -c ../.golangci.yml"],
  };
  const cleanup: Target = {
    name: "cleanup",
    phony: true,
    commands: [
      "rm -r bin",
      "rm -rf .make",
      "rm -f provider/cmd/$(PROVIDER)/schema.go",
    ],
  };
  const help: Target = {
    name: "help",
    commands: [
      "@grep '^[^.#]\\+:\\s\\+.*#' Makefile | \\",
      'sed "s/\\(.\\+\\):\\s*\\(.*\\) #\\s*\\(.*\\)/`printf "\\033[93m"`\\1`printf "\\033[0m"`	\\3 [\\2]/" | \\',
      "expand -t20",
    ],
    phony: true,
  };
  const clean: Target = {
    name: "clean",
    phony: true,
    commands: ["rm -rf sdk/{dotnet,nodejs,go,python}"],
  };
  const make_install_dotnet_sdk: Target = {
    name: ".make/install_dotnet_sdk",
    autoTouch: true,
    commands: [
      "mkdir -p nuget",
      "find sdk/dotnet -name '*.nupkg' -print -exec cp -p {} nuget \\;",
    ],
  };
  const install_dotnet_sdk: Target = {
    name: "install_dotnet_sdk",
    phony: true,
    dependencies: [make_install_dotnet_sdk],
  };
  const install_python_sdk: Target = {
    name: "install_python_sdk",
    phony: true,
  };
  const install_java_sdk: Target = {
    name: "install_java_sdk",
    phony: true,
  };
  const install_go_sdk: Target = { name: "install_go_sdk", phony: true };
  const make_install_nodejs_sdk: Target = {
    name: ".make/install_nodejs_sdk",
    autoTouch: true,
    commands: ["yarn link --cwd sdk/nodejs/bin"],
  };
  const install_nodejs_sdk: Target = {
    name: "install_nodejs_sdk",
    phony: true,
    dependencies: [make_install_nodejs_sdk],
  };
  const install_sdks: Target = {
    name: "install_sdks",
    phony: true,
    dependencies: [
      install_dotnet_sdk,
      install_python_sdk,
      install_nodejs_sdk,
      install_java_sdk,
      install_go_sdk,
    ],
  };
  const development: Target = {
    name: "development",
    phony: true,
    dependencies: [install_plugins, provider, build_sdks, install_sdks],
  };
  const build: Target = {
    name: "build",
    phony: true,
    dependencies: [install_plugins, provider, build_sdks, install_sdks],
  };
  const only_build: Target = { name: "only_build", dependencies: [build] };
  const test: Target = {
    name: "test",
    phony: true,
    commands: [
      "cd examples && go test -v -tags=all -parallel $(TESTPARALLELISM) -timeout 2h",
    ],
  };
  return {
    variables,
    defaultTarget: development,
    targets: [
      build,
      only_build,
      lint_provider,
      cleanup,
      help,
      clean,
      test,
      tfgen,
    ],
  };
}
