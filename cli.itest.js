const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

describe("cli", () => {
  test("invoke itests", () => {
    console.log("running itests");
  });
  test("invoke cli", (done) => {
    childProcess.exec(
      "npx . --dir ./itest-data/01-txt-files/",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error}`);
        }
        try {
          const countsByExt = JSON.parse(stdout);
          expect(Array.isArray(countsByExt)).toBe(true);
          expect(
            countsByExt.find((e) => e.extension === ".txt" && e.count === 44)
          ).toBeTruthy();
          done();
        } catch (error) {
          done(error);
        }
      }
    );
  });
  test.skip("should ignore node_modules when it's in .gitignore", () => {
    // skipped. it's too hard to turn .gitignore's contents into something glob
    // understands. better to clone the repo fresh and run it on the fresh repo
    const output = childProcess.execSync(
      `npx . --dir ./itest-data/02-txts-w-node_modules/`
    );
    const countsByExt = JSON.parse(output);
    expect(Array.isArray(countsByExt)).toBe(true);
    expect(
      countsByExt.find((e) => e.extension === ".txt" && e.count === 44)
    ).toBeTruthy();
  });
  test("count with .py, .test.py (.py), and .js files", () => {
    const output = childProcess.execSync(
      `npx . --dir ./itest-data/02-js-py-files/`
    );
    const countsByExt = JSON.parse(output);
    expect(Array.isArray(countsByExt)).toBe(true);
    expect(
      countsByExt.find((e) => e.extension === ".txt" && e.count === 44)
    ).toBeTruthy();
    expect(
      countsByExt.find((e) => e.extension === ".py" && e.count === 8)
    ).toBeTruthy();
    expect(
      countsByExt.find((e) => e.extension === ".js" && e.count === 5)
    ).toBeTruthy();
    expect(
      countsByExt.find((e) => e.extension === "" && e.count === 36)
    ).toBeTruthy();
  });
  test("handle files and directories with spaces", () => {
    const output = childProcess.execSync(
      `npx . --dir ./itest-data/03-txt-files-spaces/`
    );
    const countsByExt = JSON.parse(output);
    expect(Array.isArray(countsByExt)).toBe(true);
    expect(
      countsByExt.find((e) => e.extension === ".txt" && e.count === 44)
    ).toBeTruthy();
    expect(
      countsByExt.find((e) => e.extension === "" && e.count === 36)
    ).toBeTruthy();
  });
  test("should ignore .git", () => {});
  test("should ignore whatever's in .gitignore", () => {});
  test("escaping dir names", () => {
    const dir = `02' echo "hello"`;
    // I could not get this to work
    // I'll probably just js-string-escape it and call lstatSync on it, and let
    // it fail if there are any problems
    // const outputNoSanitization = childProcess.execSync(`ls ${dir}`);
    // console.log(outputNoSanitization);
    // const dirSanitized = jse(dir);
    // const outputWithSanitization = childProcess.execSync(
    //   `ls itest-data/${dirSanitized}`
    // );
    // console.log(outputWithSanitization);
  });
  test.each`
    file        | ext
    ${"f1"}     | ${""}
    ${"f1.txt"} | ${".txt"}
    ${".txt"}   | ${""}
  `("getting file extension, $file -> $ext", ({ file, ext }) => {
    expect(path.extname(file)).toBe(ext);
  });
  test("how glob works", (done) => {
    const glob = require("glob");
    const cwd = "itest-data/01-txt-files";
    const options = { cwd };
    expect(fs.lstatSync(cwd).isDirectory()).toBe(true);
    glob("**/*", options, (er, files) => {
      try {
        expect(files.includes("dir1")).toBeTruthy();
        expect(files.includes("dir1/dir1-1/f6")).toBeTruthy();
        expect(files.includes("dir2/f1.txt")).toBeTruthy();
        expect(files.includes("dir2/f1")).toBeTruthy();
        expect(files.includes("dir2/dir2-3")).toBeTruthy();
        const total = files.reduce((acc, curr) => {
          return acc + 1;
        }, 0);
        expect(total).toBe(24);
        expect(files.length).toBe(24);
        const dir2f1Length = childProcess.execSync(
          `cat '${cwd}/dir2/f1' | wc -l | awk '{print $1}'`
        );
        expect(parseInt(dir2f1Length.toString())).toBe(1);
        const dir1f5txt = `${cwd}/dir1/f5.txt`;
        const dir1f5txtLength = childProcess.execSync(
          `cat ${dir1f5txt} | wc -l | awk '{print $1}'`
        );
        expect(parseInt(dir1f5txtLength.toString())).toBe(6);
        const counts = new Map();
        files.forEach((f) => {
          const filePath = `${cwd}/${f}`;
          const stats = fs.lstatSync(filePath);
          if (stats.isDirectory()) {
            return;
          }
          if (!stats.isFile()) {
            throw new Error(`error: ${filePath} is not a file`);
          }
          // get the extension
          const ext = path.extname(f);
          // get the file length
          const len = parseInt(
            childProcess
              .execSync(`cat ${filePath} | wc -l | awk '{print $1}'`)
              .toString()
          );
          // increment the map's entry for the extension by the file length
          counts.set(ext, (counts.get(ext) || 0) + len);
        });
        console.log(counts);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
  test("read .gitignore ...", () => {});
});
