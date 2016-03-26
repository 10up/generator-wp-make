# WP-Make

WP-Make is a [Yeoman generator](http://yeoman.io) for quickly creating new WordPress projects based on some established template designs currently used by [10up](http://10up.com).

Briefly, WP-Make can be used to create a new theme, child theme, plugin, or library project - complete with unit tests - in seconds!

## Getting Started

If you need it, install Yeoman through npm:

```
$ npm install -g yo
```

To install generator-wp-make clone this repository, enter the directory, and link it to npm:

```
$ git clone git@github.com:10up/generator-wp-make.git && cd generator-wp-make
$ npm link
```

Finally, in the desired project directory, initiate the generator:

```
$ yo wp-make
```

## Project Types

WP-Make ships with four default project types, each invoked with a subgenerator.

For each project type you get:

- Composer to manage server-side dependencies
- Bower to manage front-end dependencies
- NPM to manage development dependencies (like Grunt)
- Grunt to streamline development
- phpunit, paratest, and [WP_Mock](https://github.com/10up/wp_mock) for PHP unit testing
- Qunit for JS unit testing
- A fully-fleshed out, namespaced setup for WordPress plugin development

### Plugin

This subgenerator scaffolds out a standard WordPress plugin.

The project even includes some basic unit test examples to help get you started!

### Theme

This subgenerator scaffolds out a standard WordPress theme.

The project even includes some basic unit test examples to help get you started!

### Child Theme

This subgenerator scaffolds out a standard WordPress child theme.

The project even includes some basic unit test examples to help get you started!

### Library

This subgenerator scaffolds out a WordPress library. Libraries are a bit different from plugins in that they're meant to be included via Composer and embedded directly into a theme or a plugin.

## Profiles

All four sub-generators support the use of a `.wpmakerc` file for defining project defaults. This file should be placed in your system's home directory (`~/` on *nix systems, `C:\Users\{username}` on Windows). The file follows a standard INI format and should look like the following:

```ini
; You can define a default profile to use if no other is specified
default = Basic

[Basic]
  ; Define the license to be used for the project (use SPDX formats)
  license        = MIT
  ; Define the standard root namespace for PHP files, otherwise `\TenUp` will be used
  root_namespace = EricMann
  ; Define the minimum versions of PHP/WordPress required, as well as the highest WP version tested
  php_min        = 7.0
  wp_tested      = 4.5
  wp_min         = 4.5
  ; Override standard author information, otherwise the current Git user will be used
  authorName     = Eric Mann
  authorEmail    = eric@eamann.com
  authorUrl      = https://eamann.com
  ; Set a standard project homepage - this will be used as the prompt default
  projectHome    = https://ttmm.io
  
[Enterprise]
  ; If no license is required, pass `false` for both licensing fields to omit them from all output
  license        = false
  licenseuri     = false
  ; Specify the string `prompt` for fields that need to be prompted at runtime
  root_namespace = prompt
  php_min        = 5.3
  wp_tested      = 4.4.2
  wp_min         = 4.2.0
  authorName     = My Agency
  authorEmail    = contact@myagency.org
  authorUrl      = https://myagency.org
  projectHome    = https://myagency.org/projects
```

If no profile is specified at runtime, the profile listed as `default` will be used. However you specify a non-default profile with the `--profile` flag at the command line:

```sh
$ yo wp-make:plugin --profile Enterprise
```

Some fields will always prompt - the profile will merely set the default:
- `projectHome`

Some fields will prompt only when the string `prompt` is specified as a setting:
- `root_namespace`

Some fields will never prompt but will use either the profile or a hard-coded default:
- `license`
- `licenseuri`
- `php_min`
- `wp_tested`
- `wp_min`

## License

MIT
