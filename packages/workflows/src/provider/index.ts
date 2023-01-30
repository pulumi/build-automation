import { Config } from "@pulumi/build-config";

import * as native from './native'
import * as bridged from './bridged'

export interface ProviderFile {
    path: string;
    data: unknown;
}

export const buildProviderFiles = (config: Config): ProviderFile[] => {
    if (config.template !== "bridged") {
        throw new Error(
            `Expected bridged template config, found "${config.template}"`
        );
    }
    return bridged.generateProviderFiles(config);
};

export default { native, bridged };
