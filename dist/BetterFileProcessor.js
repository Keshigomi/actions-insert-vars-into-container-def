"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterFileProcessor = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const EnvVarToNameValueConverter_1 = require("./EnvVarToNameValueConverter");
const EnvVarToObjectConverter_1 = require("./EnvVarToObjectConverter");
const VarParser_1 = require("./VarParser");
const VarYamlFormatter_1 = require("./VarYamlFormatter");
class BetterFileProcessor {
    constructor() {
        this.parser = new VarParser_1.VarParser();
    }
    async process(params) {
        try {
            const encoding = params.encoding || "utf-8";
            if (!params.filePath) {
                throw new Error(`A file path must be provided.`);
            }
            let fileContents;
            try {
                fileContents = await fs.promises.readFile(params.filePath, encoding);
            }
            catch (err) {
                throw new Error(`Could not open file with path: ${params.filePath}`);
            }
            let converter;
            if (params.outputFormat === "Object") {
                converter = new EnvVarToObjectConverter_1.EnvVarToObjectConverter();
            }
            else {
                converter = new EnvVarToNameValueConverter_1.EnvVarToNameValueConverter(params.varSeparator || "\n");
            }
            const updatedFileContents = this.replaceInContents({
                converter,
                contents: fileContents || "",
                vars: this.parser.parseVars(params.vars || []),
                lineSeparator: params.varSeparator || "\n",
                placeholder: params.placeholder || "${placeholder}",
                requestedIndentSize: (!params.indentSize || params.indentSize === "auto") ?
                    undefined :
                    Number.parseInt(params.indentSize)
            });
            await fs.promises.writeFile(params.filePath, updatedFileContents, encoding);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    }
    replaceInContents(params) {
        const result = params.contents.split(params.lineSeparator).map(line => {
            const indentSize = params.requestedIndentSize || line.indexOf(params.placeholder);
            return indentSize > -1 ? new VarYamlFormatter_1.VarYamlFormatter(params.converter, params.lineSeparator).format(params.vars, indentSize) : line;
        }).join(params.lineSeparator);
        return result;
    }
}
exports.BetterFileProcessor = BetterFileProcessor;
