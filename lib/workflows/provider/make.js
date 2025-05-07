"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
function getAssignmentToken(type) {
    switch (type) {
        case "simple":
            return ":=";
        case "conditional":
            return "?=";
        case "recursive":
            return "=";
    }
}
const indent = "\t";
function renderCommand(cmd) {
    if (Array.isArray(cmd)) {
        return cmd.map((step) => indent + step).join(" && \\\n" + indent);
    }
    return indent + cmd;
}
function renderCommands(commands) {
    var _a;
    return (_a = commands === null || commands === void 0 ? void 0 : commands.map(renderCommand)) !== null && _a !== void 0 ? _a : [];
}
function renderTarget(target) {
    var _a, _b, _c;
    const dependencies = (_a = target.dependencies) !== null && _a !== void 0 ? _a : [];
    const dependencyNames = dependencies.map((d) => typeof d === "string" ? d : d.name);
    const declaration = `${target.name}: ${dependencyNames.join(" ")}`;
    const commands = renderCommands(target.commands);
    const suffixCommands = ((_b = target.autoTouch) !== null && _b !== void 0 ? _b : false) ? renderCommands(["@touch $@"]) : [];
    const variables = Object.entries((_c = target.variables) !== null && _c !== void 0 ? _c : {})
        .map(renderVariable)
        .map((v) => target.name + ": " + v);
    return [...variables, declaration, ...commands, ...suffixCommands].join("\n");
}
function renderVariable([name, assignment]) {
    var _a;
    if (typeof assignment === "string") {
        return `${name} := ${assignment}`;
    }
    const assignmentToken = getAssignmentToken((_a = assignment.type) !== null && _a !== void 0 ? _a : "simple");
    return `${name} ${assignmentToken} ${assignment.value}`;
}
function phonyTarget(targets) {
    const phonyTargets = targets.filter((t) => t.phony);
    if (phonyTargets.length === 0) {
        return undefined;
    }
    return {
        name: ".PHONY",
        dependencies: phonyTargets,
    };
}
function deduplicateTargets(targets) {
    const map = new Map(targets.map((t) => [t.name, t]));
    return Array.from(map.values());
}
function descendentTargets(target) {
    if (target.dependencies === undefined) {
        return [target];
    }
    return deduplicateTargets([
        target,
        ...target.dependencies.flatMap((t) => typeof t !== "string" ? descendentTargets(t) : []),
    ]);
}
function sortTargets(targets, defaultTarget) {
    const defaultName = typeof defaultTarget === "string" ? defaultTarget : defaultTarget === null || defaultTarget === void 0 ? void 0 : defaultTarget.name;
    function sortKey(target) {
        const isDefault = target.name === defaultName ? "0" : "1";
        const isPhony = target.phony ? "0" : "1";
        const isAlias = target.commands === undefined || target.commands.length === 0 ? "0" : "1";
        return `${isDefault}-${isPhony}-${isAlias}-${target.name}`;
    }
    const sorted = [...targets].sort((a, b) => sortKey(a).localeCompare(sortKey(b), undefined, {
        sensitivity: "base",
    }));
    return sorted;
}
function render(makefile) {
    var _a, _b;
    const variableLines = Object.entries((_a = makefile.variables) !== null && _a !== void 0 ? _a : {}).map(renderVariable);
    const targets = (_b = makefile.targets) !== null && _b !== void 0 ? _b : [];
    if (typeof makefile.defaultTarget === "object") {
        targets.push(makefile.defaultTarget);
    }
    const inputTargets = deduplicateTargets(targets.flatMap(descendentTargets));
    const sortedTargets = sortTargets(inputTargets, makefile.defaultTarget);
    const phony = phonyTarget(sortedTargets);
    if (phony !== undefined) {
        sortedTargets.push(phony);
    }
    const renderedTargets = sortedTargets.map(renderTarget);
    return [variableLines.join("\n"), renderedTargets.join("\n\n")].join("\n\n");
}
exports.render = render;
//# sourceMappingURL=make.js.map