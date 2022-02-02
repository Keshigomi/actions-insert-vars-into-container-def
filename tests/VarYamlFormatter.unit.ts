import {It, Mock} from "typemoq";
import { IEnvVarConverter } from "../src/IEnvVarConverter";
import { IEnvVarInfo } from "../src/IEnvVarInfo";
import {VarYamlFormatter} from "../src/VarYamlFormatter";

describe("VarYamlFormatter", () => {
    it(".format_withConverter_getsFormatterStringFromConverter", () => {
        // arrange
        const expectedFormattedVar = "FORMATTED BLAH";
        const varName = "BLAH";
        const varValue = "A value";
        const testVars: IEnvVarInfo[] = [
            { Name: varName, Value: varValue }
        ];
        const converterMock = Mock.ofType<IEnvVarConverter>();
        converterMock.setup(c => c.varToString(It.isAny(), It.isAny())).returns(() => expectedFormattedVar);
        
        // act
        const result = new VarYamlFormatter(converterMock.object, "\n").format(testVars);

        expect(result).not.toBeNull();
        expect(result).toContain(expectedFormattedVar);
        // const lines = result.split("\n");
        // expect(lines).toHaveLength(2);
        // expect(lines[0]).toContain("- Name: BLAH");
        // expect(lines[1]).toContain("  Value: A value");
    })
})