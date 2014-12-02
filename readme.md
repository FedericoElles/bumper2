# Bumper #

Install globally to update your package.json and bower.json files instantly with one command.


## Install ##

npm install bumper2 -g


## Example ##


    $bump r
	package.json version:   0.0.2
    bower.json: not found
    ---------------------------------
    New version:            0.0.3


## Usage ##


    $ bump r
    #0.0 --> 0.1
	#0.0.0 --> 0.0.1
	#0.0.0.0 --> 0.0.0.1

	$ bump major
	#0.0.0 --> 1.0.0

	$ bump minor
	#0.0.0 --> 0.1.0

	$ bump patch
	#0.0.0.0 --> 0.0.1.0
	
## Bonus Feature: Git Tagging ##

Reads current version number and creates a tag in git and saves it to master

    $ bump tag
    [--BUMPER--]
    package.json version:   0.1.2
    bower.json: not found
    git tag -a v0.1.2 -m "Bumped to version v0.1.2"
    
    git push --tags
    To git@github.com:
     * [new tag]         v0.1.2 -> v0.1.2

