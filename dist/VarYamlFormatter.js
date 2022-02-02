"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarYamlFormatter = void 0;
class VarYamlFormatter {
    constructor(envVarConverter, newLineSeparator = "\n") {
        this.envVarConverter = envVarConverter;
        this.newLineSeparator = newLineSeparator;
    }
    format(vars, indentSize = 12) {
        vars = vars || [];
        const indent = " ".repeat(indentSize);
        return vars.map(v => this.envVarConverter.varToString(v, indent)).join(this.newLineSeparator);
    }
}
exports.VarYamlFormatter = VarYamlFormatter;
