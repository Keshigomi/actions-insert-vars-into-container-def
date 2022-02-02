import * as core from "@actions/core";
import { BetterFileProcessor } from "./BetterFileProcessor";

new BetterFileProcessor().process({
    filePath: core.getInput("file"),
    encoding: core.getInput("encoding"),
    placeholder: core.getInput("placeholder"),
    vars: core.getMultilineInput("vars"),
    varSeparator: core.getInput("varSeparator"),
    indentSize: core.getInput("indentSize"),
    outputFormat: core.getInput("outputFormat")
});