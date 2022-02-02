"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVarToNameValueConverter = void 0;
class EnvVarToNameValueConverter {
    constructor(newLineSeparator = "\n") {
        this.newLineSeparator = newLineSeparator;
    }
    varToString(v, indent) {
        return `${indent}- Name: ${v.Name}${this.newLineSeparator}` +
            `${indent}  Value: ${v.Value || null}`;
    }
}
exports.EnvVarToNameValueConverter = EnvVarToNameValueConverter;
