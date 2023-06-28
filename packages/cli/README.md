zplang-cli
=================

Zapant CLI used to compile **zplang**.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g zplang-cli
$ zplang-cli COMMAND
running command...
$ zplang-cli (--version)
zplang-cli/0.0.4 darwin-x64 node-v18.16.0
$ zplang-cli --help [COMMAND]
USAGE
  $ zplang-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`zplang-cli execute`](#zplang-cli-execute)
* [`zplang-cli help [COMMANDS]`](#zplang-cli-help-commands)

## `zplang-cli execute`

Execute a ".zp" file

```
USAGE
  $ zplang-cli execute -f <value> [-d <value>]

FLAGS
  -d, --data=<value>  [default: data] data directory to load assests price
  -f, --file=<value>  (required) file with code to execute

DESCRIPTION
  Execute a ".zp" file

EXAMPLES
  $ zplang-cli execute
```

_See code: [dist/commands/execute.ts](https://github.com/zapant-com/zp-lang/blob/v0.0.4/dist/commands/execute.ts)_

## `zplang-cli help [COMMANDS]`

Display help for zplang-cli.

```
USAGE
  $ zplang-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for zplang-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.10/src/commands/help.ts)_
<!-- commandsstop -->
