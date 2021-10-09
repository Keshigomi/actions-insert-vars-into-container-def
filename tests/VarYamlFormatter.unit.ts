import { IEnvVarInfo } from "../src/IEnvVarInfo";
import {VarYamlFormatter} from "../src/VarYamlFormatter";

describe("VarYamlFormatter", () => {
    it(".format_withValueVarNameAndValue_returnsYamlFormattedVarInfo", () => {
        // arrange
        const varName = "BLAH";
        const varValue = "A value";
        const testVars: IEnvVarInfo[] = [
            { Name: varName, Value: varValue }
        ];
        
        // act
        const result = new VarYamlFormatter("\n").format(testVars);

        expect(result).not.toBeNull();
        const lines = result.split("\n");
        expect(lines).toHaveLength(2);
        expect(lines[0]).toContain("- Name: BLAH");
        expect(lines[1]).toContain("  Value: A value");
    })
})