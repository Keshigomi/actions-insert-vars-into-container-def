"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVarToObjectConverter = void 0;
class EnvVarToObjectConverter {
    varToString(v, indent) {
        return `${indent}${v.Name}: ${v.Value || null}`;
    }
}
exports.EnvVarToObjectConverter = EnvVarToObjectConverter;
