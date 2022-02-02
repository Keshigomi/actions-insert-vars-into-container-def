import { IEnvVarInfo } from "./IEnvVarInfo";

export class VarParser {
    /**
     * Possibilities:
     * // this is a comment
     * # this is a comment
     *
     * # will create MYVAR2 variable entry and set its value to undefined
     * MYVAR2:
     * # will create MYVAR3 variable entry and set its value to 'some value'
     * MYVAR3: 'some value'
     * @returns a parsed environment variable info object
     */
    public parseVars(varLines: string[]): IEnvVarInfo[] {
        return (varLines || []).map(vl => VarParser.parseVarLine(vl))
            .filter(v => !!v)
            .map(v => v as IEnvVarInfo);
    }

    private static parseVarLine(line?: string): IEnvVarInfo | undefined {
        line = line?.trim();
        if (!line) {
            return undefined;
        }
        const varAndValRegex = /^(?<name>[^:]+)\s*\:\s*(?<value>.*)$/g;
        const matchedGroups = varAndValRegex.exec(line)?.groups || {};
        const name = matchedGroups["name"];
        const value = matchedGroups["value"];
        // line has no name
        if (!name) {
            return undefined;
        }
        // line has a colon, but no value. set value to undefined
        if (!value) {
            return { Name: name };
        }
        // line has a colon and a value. value may be wrapped in single or double quotes
        else {
            return { Name: name, Value: value }
        }
    }
}