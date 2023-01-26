import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { providersDir, getConfig } from "@pulumi/build-config";
import { buildProviderFiles, ProviderFile } from "../provider/bridged";

const args = yargs(hideBin(process.argv))
  .command("generate-provider", "generate the Github Actions workflows for a provider")
  .option("debug", {
    description: "Enable debug logging",
    type: "boolean",
  })
  .parseSync();

const debug = (message?: any, ...optionalParams: any[]) => {
  if (args.debug) {
    console.log(message, ...optionalParams);
  }
};

const writeProviderFiles = (providerFiles: ProviderFile[]) => {
  const providerRepoPath = ".";
  for (const file of providerFiles) {
    const filePath = path.join(providerRepoPath, file.path);
    const data =
      typeof file.data === "string"
        ? file.data
        : yaml.stringify(file.data, {
            sortMapEntries: true,
            indentSeq: false,
          });
    const generatedHeader =
      "# WARNING: This file is autogenerated - changes " +
      "will be overwritten if not made via https://github.com/pulumi/build-automation\n\n";
    debug("Writing", filePath);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, generatedHeader.concat(data), {
      encoding: "utf-8",
    });
  }
};

const providerInfo = getConfig('config.yaml');
debug("provider files to generate", providerInfo);

const providerFiles = buildProviderFiles(providerInfo);
writeProviderFiles(providerFiles);
