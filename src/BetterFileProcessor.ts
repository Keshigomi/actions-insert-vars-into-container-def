import * as core from "@actions/core";
import * as fs from "fs";
import { EnvVarToNameValueConverter } from "./EnvVarToNameValueConverter";
import { EnvVarToObjectConverter } from "./EnvVarToObjectConverter";
import { IEnvVarConverter } from "./IEnvVarConverter";
import { IEnvVarInfo } from "./IEnvVarInfo";
import { VarParser } from "./VarParser";
import { VarYamlFormatter } from "./VarYamlFormatter";

export interface IFileProcessorParams {
    /** `file` input is required, and the file is required to exist */
    filePath: string,
    /** `encoding` input is optional. if not provided, defaults to utf-8. */
    encoding?: string,
    /** `placeholder` input is optional and defaults to `${placeholder}` */
    placeholder?: string,
    /** `vars` input is optional. if not provided, use empty string. */
    vars?: string[],
    /** `varSeparator` input is optional. if not provided, use '\n'. */
    varSeparator?: string,
    /** `indentSize` input is optional. if not provided, uses 'auto'. */
    indentSize?: string
    /** `outputFormat` is optional, defaults to "NameValuePair" if not provided. Valid values are "NameValuePair" and "Object" */
    outputFormat?: string
}

export class BetterFileProcessor {
    private readonly parser: VarParser = new VarParser();

    public async process(params: IFileProcessorParams) {
        try {
            const encoding: BufferEncoding = (params.encoding as BufferEncoding) || "utf-8";
            if (!params.filePath) {
                throw new Error(`A file path must be provided.`);
            }
            let fileContents: string;
            try {
                fileContents = await fs.promises.readFile(params.filePath, encoding);
            } catch (err) {
                throw new Error(`Could not open file with path: ${params.filePath}`);
            }
            let converter: IEnvVarConverter;
            if (params.outputFormat === "Object") {
                converter = new EnvVarToObjectConverter();
            } else {
                converter = new EnvVarToNameValueConverter(params.varSeparator || "\n");
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
        } catch (error) {
            core.setFailed((error as any).message);
        }
    }

    private replaceInContents(params: {
        converter: IEnvVarConverter,
        contents: string,
        vars: IEnvVarInfo[],
        lineSeparator: string,
        placeholder: string,
        requestedIndentSize?: number
    }): string {
        const result = params.contents.split(params.lineSeparator).map(line => {
            const indentSize = params.requestedIndentSize || line.indexOf(params.placeholder);
            return indentSize > -1 ? new VarYamlFormatter(params.converter, params.lineSeparator).format(params.vars, indentSize) : line;
        }).join(params.lineSeparator);
        return result;
    }
}