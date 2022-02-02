import { describe, it, expect } from "@jest/globals";
import * as core from "@actions/core";
jest.mock("@actions/core", () => ({
    setFailed: jest.fn(),
    getInput: jest.fn(),
    getMultilineInput: jest.fn()
}));
import { FileHandle } from "fs/promises";
import { Stream } from "stream";

import { BetterFileProcessor } from "../src/BetterFileProcessor";
import { PathLike } from "fs";
import * as fs from "fs";

jest.mock("fs", () => {
    const fs = jest.requireActual("fs");
    return {
        promises: {
            ...fs,
            readFile: jest.fn(),
            writeFile: jest.fn()
        }
    }
});

describe("run", () => {
    it("withValidVars_insertsVarsIntoEnvironmentBlock", async () => {
        // arrange
        const testVar1 = "testVar1";
        const testValue1 = '"testValue1"';
        const testVar2 = '"testVar2"';
        const testValue2 = "testValue2";

        mockReadFile(`
            Resources:
              TaskDefinition:
                Properties:
                  ContainerDefinitions:
                    - Environment:
                      $\{placeholder\}`);
        let result = undefined;
        mockWriteFile((contents) => result = contents);
        
        // act
        await new BetterFileProcessor().process({
            filePath: "a file path",
            vars: [`${testVar1}: ${testValue1}`, `${testVar2}: ${testValue2}`, "// comment"]
        });

        // assert
        expect(result).not.toBeUndefined();
        expect(result).toContain(`- Name: ${testVar1}`);
        expect(result).toContain(`Value: ${testValue1}`);
        expect(result).toContain("TaskDefinition:");
    });

    it.each([
        [""],
        [null],
        [undefined]
    ])
    ("withNoVars_setsEnvironmentBlockToEmpty", async (varsValue) => {
        // arrange
        mockReadFile(`
            Resources:
              TaskDefinition:
                Properties:
                  ContainerDefinitions:
                    - Environment:
                      $\{placeholder\}`);
        let result = undefined;
        mockWriteFile((contents) => result = contents);

        // act
        await new BetterFileProcessor().process({
            filePath: "a file path",
            vars: varsValue
        });

        // assert
        expect(result).not.toBeUndefined();
        expect(result).toMatch(/^[\s\S]*- Environment:[\s\S]*$/gm);
    });

    it("withMissingFileInput_failsAction", async () => {
        // arrange
        let error = undefined;
        (core.setFailed as jest.MockedFunction<any>).mockImplementation((message: string) => error = message);

        // act
        await new BetterFileProcessor().process({
            filePath: undefined!
        });

        // assert
        expect(error).not.toBeUndefined();
        expect(error).toContain("A file path must be provided.");
    });
});


function mockWriteFile(callback: (contents: string) => void) {
    (fs.promises.writeFile as jest.MockedFunction<any>).mockImplementation(
        (file: PathLike | FileHandle,
            contents: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream): Promise<void> => {
            callback(contents.toString());
            return Promise.resolve();
        });
}

function mockReadFile(contents: string) {
    (fs.promises.readFile as jest.MockedFunction<any>).mockImplementation(
        () => Promise.resolve(contents));
}