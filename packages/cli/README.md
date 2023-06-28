oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g zpcli
$ zplang-cli COMMAND
running command...
$ zplang-cli (--version)
zpcli/0.0.1 darwin-x64 node-v18.16.0
$ zplang-cli --help [COMMAND]
USAGE
  $ zplang-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`zplang-cli help [COMMANDS]`](#zplang-cli-help-commands)
* [`zplang-cli plugins`](#zplang-cli-plugins)
* [`zplang-cli plugins:install PLUGIN...`](#zplang-cli-pluginsinstall-plugin)
* [`zplang-cli plugins:inspect PLUGIN...`](#zplang-cli-pluginsinspect-plugin)
* [`zplang-cli plugins:install PLUGIN...`](#zplang-cli-pluginsinstall-plugin-1)
* [`zplang-cli plugins:link PLUGIN`](#zplang-cli-pluginslink-plugin)
* [`zplang-cli plugins:uninstall PLUGIN...`](#zplang-cli-pluginsuninstall-plugin)
* [`zplang-cli plugins:uninstall PLUGIN...`](#zplang-cli-pluginsuninstall-plugin-1)
* [`zplang-cli plugins:uninstall PLUGIN...`](#zplang-cli-pluginsuninstall-plugin-2)
* [`zplang-cli plugins update`](#zplang-cli-plugins-update)

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

## `zplang-cli plugins`

List installed plugins.

```
USAGE
  $ zplang-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ zplang-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.1.5/src/commands/plugins/index.ts)_

## `zplang-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ zplang-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ zplang-cli plugins add

EXAMPLES
  $ zplang-cli plugins:install myplugin 

  $ zplang-cli plugins:install https://github.com/someuser/someplugin

  $ zplang-cli plugins:install someuser/someplugin
```

## `zplang-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ zplang-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ zplang-cli plugins:inspect myplugin
```

## `zplang-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ zplang-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ zplang-cli plugins add

EXAMPLES
  $ zplang-cli plugins:install myplugin 

  $ zplang-cli plugins:install https://github.com/someuser/someplugin

  $ zplang-cli plugins:install someuser/someplugin
```

## `zplang-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ zplang-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ zplang-cli plugins:link myplugin
```

## `zplang-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ zplang-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ zplang-cli plugins unlink
  $ zplang-cli plugins remove
```

## `zplang-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ zplang-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ zplang-cli plugins unlink
  $ zplang-cli plugins remove
```

## `zplang-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ zplang-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ zplang-cli plugins unlink
  $ zplang-cli plugins remove
```

## `zplang-cli plugins update`

Update installed plugins.

```
USAGE
  $ zplang-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
