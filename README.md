# by-extension

Source lines of code by file extension.

## Help output

```
$ npx . --help
Usage: by-extension [options]

Print the line count of files by extension in a directory, prints something like:
[{"extension": ".txt","count":44},{"extension":"","count":36}]

Options:
  -V, --version          output the version number
  -d, --dir <DIRECTORY>  The directory to count lines of files in, recursively (default: ".")
  -h, --help             display help for command
```

## Example

```
$ # clone an example repo, any repo will do; clone to a fresh directory because

$ # we don't want to count lines in things like node_modules that are

$ # .gitignored

$ git clone git@github.com:douglasnaphas/playground.git playground-fresh

$ # don't cd into the dir, because if there's an .npmrc in there, it will mess

$ # things up

$ npx by-extension --dir playground-fresh
[{"extension":".awk","count":14},{"extension":".sh","count":72},{"extension":"","count":269},{"extension":".md","count":2},{"extension":".c","count":22},{"extension":".cpp","count":11},{"extension":".css","count":25},{"extension":".html","count":194},{"extension":".old","count":20},{"extension":".bash","count":131},{"extension":".txt","count":32},{"extension":".java","count":123},{"extension":".m","count":25},{"extension":".aux","count":19},{"extension":".tex","count":286}]

$ # for pretty output:

$ npx by-extension --dir playground-fresh | jq '.'
[
  {
    "extension": ".awk",
    "count": 14
  },
  {
    "extension": ".sh",
    "count": 72
  },
  {
    "extension": "",
    "count": 269
  },
  {
    "extension": ".md",
    "count": 2
  },
  {
    "extension": ".c",
    "count": 22
  },
  {
    "extension": ".cpp",
    "count": 11
  },
  {
    "extension": ".css",
    "count": 25
  },
  {
    "extension": ".html",
    "count": 194
  },
  {
    "extension": ".old",
    "count": 20
  },
  {
    "extension": ".bash",
    "count": 131
  },
  {
    "extension": ".txt",
    "count": 32
  },
  {
    "extension": ".java",
    "count": 123
  },
  {
    "extension": ".m",
    "count": 25
  },
  {
    "extension": ".aux",
    "count": 19
  },
  {
    "extension": ".tex",
    "count": 286
  }
]

$ # filtered output:

$ npx by-extension --dir playground-fresh | jq '. | map(select(.extension == ".java"))'
[
  {
    "extension": ".java",
    "count": 123
  }
]
```
