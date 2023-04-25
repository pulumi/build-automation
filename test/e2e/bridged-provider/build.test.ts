import { MockGithub } from "@kie/mock-github";
import { Act } from "@kie/act-js";
import path from "path";

let mockGithub: MockGithub;

describe("Bridged Provider", () => {

  beforeEach(async () => {
    // create a local repo
    mockGithub = new MockGithub({
      repo: {
        testRepo: {
          files: [
            {
              src: path.resolve(__dirname, "dummy", ".github"),
              dest: ".github",
            },
            {
              src: path.resolve(process.cwd(), ".github/workflows/provider-prerequisites.yaml"),
              dest: ".github/workflows/provider-prerequisites.yaml"
            },
            {
              src: path.resolve(process.cwd(), ".github/workflows/provider-build-sdk.yaml"),
              dest: ".github/workflows/provider-build-sdk.yaml"
            }
          ],
        },
      },
    });

    await mockGithub.setup();
  });

  afterEach(async () => {
    await mockGithub.teardown();
  });

  test("test main build workflow", async () => {
    const act = new Act(mockGithub.repo.getPath("testRepo"));
    const result = await act.runEvent("push", { logFile: process.env.ACT_LOG ? "simple.log" : undefined });

    expect(result.length).toBe(4);
    expect(result[0]).toStrictEqual({
      name: "Main actions/checkout@v2",
      status: 0,
      output: "",
    });
    expect(result).toStrictEqual([
      { name: "Main actions/checkout@v3", status: 0, output: "" },
      { name: "Main do something", status: 0, output: "step 1\nstep 2" },
    ]);
  });

})