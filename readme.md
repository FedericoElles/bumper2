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


    $bump r
    #0.0 --> 0.1
	#0.0.0 --> 0.0.1
	#0.0.0.0 --> 0.0.0.1

	$bump major
	#0.0.0 --> 1.0.0

	$bump minor
	#0.0.0 --> 0.1.0

	$bump build
	#0.0.0.0 --> 0.0.1