"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMakefile = void 0;
const make_1 = require("./make");
const make_bridged_provider_1 = require("./make-bridged-provider");
const make_bridged_provider_2_1 = require("./make-bridged-provider-2");
function buildMakefile(config) {
    switch (config.makeTemplate) {
        case "bridged":
            return (0, make_1.render)((0, make_bridged_provider_1.bridgedProvider)(config));
        case "bridged-v2":
            return (0, make_1.render)((0, make_bridged_provider_2_1.bridgedProviderV2)(config));
        default:
            throw new Error(`Unknown makefile template: ${config.makeTemplate}`);
    }
}
exports.buildMakefile = buildMakefile;
//# sourceMappingURL=makefiles.js.map