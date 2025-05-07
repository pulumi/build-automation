import { Config, BridgedConfig } from '../../config';

import * as native from './native'
import * as bridged from './bridged'

export interface ProviderFile {
    path: string;
    data: unknown;
}

type GeneratorFunction = (config: BridgedConfig) => ProviderFile[];

export const buildProviderFiles = (config: Config, generator: GeneratorFunction): ProviderFile[] => {
    if (config.template !== "bridged") {
        throw new Error(
            `Expected bridged template config, found "${config.template}"`
        );
    }
    return generator(config);
};

export default { native, bridged };
