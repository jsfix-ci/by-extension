#!/usr/bin/env node
(async () => {
  const program = require("commander");
  const glob = require("glob");
  const fs = require("fs");
  const path = require("path");
  const childProcess = require("child_process");

  const defaults = {
    dir: ".",
  };
  program
    .name("by-extension")
    .version("0.1.0")
    .description(
      "Print the line count of files by extension in a directory, " +
        "prints something like:" +
        `\n` +
        `[{"extension": ".txt","count":44},{"extension":"","count":36}]`
    )
    .option(
      "-d, --dir <DIRECTORY>",
      `The directory to count lines of files in, recursively, default ${defaults.dir}`,
      defaults.dir
    )
    .parse(process.argv);
  const options = program.opts();
  const { dir } = options;
  const dirStats = fs.lstatSync(dir);
  if (!dirStats.isDirectory()) {
    console.error(`error: ${dir} is not a directory`);
    process.exit(2);
  }
  const globOptions = { cwd: dir };
  const files = glob.sync("**/*", globOptions);
  const counts = new Map();
  files.forEach((f) => {
    const filePath = `${dir}/${f}`;
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
        .execSync(`cat '${filePath}' | wc -l | awk '{print $1}'`)
        .toString()
    );
    // increment the map's entry for the extension by the file length
    counts.set(ext, (counts.get(ext) || 0) + len);
  });
  // console.log(counts);
  const ret = [];
  counts.forEach((v, k) => {
    ret.push({ extension: k, count: v });
  });
  console.log(JSON.stringify(ret));
})();
