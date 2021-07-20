const childProcess = require("child_process");

describe("cli", () => {
  test("invoke itests", () => {
    console.log("running itests");
  });
  test("invoke cli", (done) => {
    childProcess.exec("npx .", (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error}`);
      }
      try {
        expect(stdout.toString()).toMatch(/cli!/);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
