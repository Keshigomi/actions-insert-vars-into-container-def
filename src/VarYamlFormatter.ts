import { IEnvVarConverter } from "./IEnvVarConverter";
import { IEnvVarInfo } from "./IEnvVarInfo";

export class VarYamlFormatter {
    private readonly envVarConverter: IEnvVarConverter;
    private readonly newLineSeparator: string;

    public constructor(envVarConverter: IEnvVarConverter, newLineSeparator: string = "\n") {
        this.envVarConverter = envVarConverter;
        this.newLineSeparator = newLineSeparator;
    }
    public format(vars: IEnvVarInfo[] | undefined, indentSize: number = 12) {
        vars = vars || [];
        const indent = " ".repeat(indentSize);
        return vars.map(v => this.envVarConverter.varToString(v, indent)).join(this.newLineSeparator);
    }
}