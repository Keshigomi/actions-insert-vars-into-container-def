import { IEnvVarConverter } from "./IEnvVarConverter";
import { IEnvVarInfo } from "./IEnvVarInfo";

export class EnvVarToObjectConverter implements IEnvVarConverter {

    public varToString(v: IEnvVarInfo, indent: string): string {
        return `${indent}${v.Name}: ${v.Value || null}`
    }
}