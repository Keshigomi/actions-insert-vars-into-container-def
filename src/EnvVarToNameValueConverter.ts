import { IEnvVarConverter } from "./IEnvVarConverter";
import { IEnvVarInfo } from "./IEnvVarInfo";

export class EnvVarToNameValueConverter implements IEnvVarConverter {
    private readonly newLineSeparator: string;

    public constructor(newLineSeparator: string = "\n") {
        this.newLineSeparator = newLineSeparator;
    }
    public varToString(v: IEnvVarInfo, indent: string): string {
        return `${indent}- Name: ${v.Name}${this.newLineSeparator}` +
            `${indent}  Value: ${v.Value || null}`
    }
}