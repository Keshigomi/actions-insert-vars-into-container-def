import { EnvVarToNameValueConverter } from "../src/EnvVarToNameValueConverter";
import { IEnvVarInfo } from "../src/IEnvVarInfo";

describe("EnvVarToNameValueConverter", () => {
    it(".varToString_withValueVarNameAndValue_returnsYamlFormattedVarInfo", () => {
        // arrange
        const varName = "BLAH";
        const varValue = "A value";
        const testVar: IEnvVarInfo = { Name: varName, Value: varValue };
        
        // act
        const result = new EnvVarToNameValueConverter("\n").varToString(testVar, "  ");

        expect(result).not.toBeNull();
        const lines = result.split("\n");
        expect(lines).toHaveLength(2);
        expect(lines[0]).toContain(`- Name: ${varName}`);
        expect(lines[1]).toContain(`  Value: ${varValue}`);
    })
})