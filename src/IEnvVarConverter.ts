import { IEnvVarInfo } from "./IEnvVarInfo";

export interface IEnvVarConverter {
    varToString(v: IEnvVarInfo, indent: string): string;
}
