import { Config, BridgedConfig } from '../../config';
import * as native from './native';
import * as bridged from './bridged';
export interface ProviderFile {
    path: string;
    data: unknown;
}
type GeneratorFunction = (config: BridgedConfig) => ProviderFile[];
export declare const buildProviderFiles: (config: Config, generator: GeneratorFunction) => ProviderFile[];
declare const _default: {
    native: typeof native;
    bridged: typeof bridged;
};
export default _default;
//# sourceMappingURL=index.d.ts.map