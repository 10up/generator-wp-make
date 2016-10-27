# WP-Make

[![Build Status](https://travis-ci.org/wp-cli/wp-cli.png?branch=master)](https://travis-ci.org/10up/generator-wp-make)

```diff
- WARNING

- WP-Make is currently undergoing a rewrite, heading towards version 1. The
- stable version of WP Make is available as the 'master' branch, but the default
- branch for this repo is 'develop'. This contains the work on the v1 rewrite.
- Please note that these two branches are NOT COMPATIBLE with each other.
-
- If you do switch between the develop and master branches, you will need to
- delete your node_modules folder and then run npm install again each time you
- switch. Otherwise things will not work.

- If you would like to use the stable version, we urge you to use NPM to
- install it. Please make sure any repo versions you may have installed are
- unlinked FIRST. After that you can `npm install -g generator-wp-make`. When
- the 1.0 release is ready, yeoman will try to let you know and help facilitate
- the update.

- If you would like to use the repo version of WP Make, by all means! First
- make sure you don't have a version from NPM on your system. Run
- `npm uninstall -g generator-wp-make` to be extra sure. Then clone this
- repository to your local machine. Open your command prompt to the folder
- where you cloned it. If you would like to run the stable version first
- check out master with `git checkout master origin/master`. Then run
- `npm install` followed by `npm link`. Don't forget if you want to switch
- between the master and develop branch you need to DELETE your node modules.

+ rm -rf node_modules/
+ git checkout develop
+ npm install

----OR----

+ rm -rf node_modules
+ git checkout master
+ npm install

- We are really looking forward to the new version. In the meantime, please
- excuse our mess and thanks for generating with us!
```

WP-Make is a [Yeoman generator](http://yeoman.io) for quickly creating new WordPress projects based on some established template designs currently used by [10up](http://10up.com).

Briefly, WP-Make can be used to create a new theme, child theme, plugin, or library project - complete with unit tests - in seconds!

<a href="http://10up.com/contact/"><img src="https://10updotcom-wpengine.s3.amazonaws.com/uploads/2016/10/10up-Github-Banner.png" width="850"></a>

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

## Tests

To run tests, execute the below command.

````
$ npm test
````

## License

MIT
