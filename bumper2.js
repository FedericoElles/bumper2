#!/usr/bin/env node

"use strict";
require('shelljs/global');


var fs = require('fs'),
    shell = require('shelljs'),
    PATH = '/',
    currentFolder,
    packageVersion,
    bowerVersion,
    version,
    versionNumbers,
    userV,
    cmd,
    cmds
    ;
    
currentFolder = process.cwd() + '/' + PATH;    

//console.log(process.argv);
//console.log('Current Folder: ' + currentFolder);
//console.log('process.cwd()',process.cwd());


var _readVersion = function(filename){
  var packageData,
      packageJson,
      r = '';
  if (fs.existsSync(currentFolder + filename)){
    
    packageData = fs.readFileSync(currentFolder + filename);
    if (packageData){
      packageJson = JSON.parse(packageData);
      console.log((filename + ' version:            ').substr(0,24)  + packageJson.version);
      r = packageJson.version;
    }
  } else {
    console.log(filename + ': not found');
  }
  return r;
}

console.log('[--BUMPER--]')
packageVersion = _readVersion('package.json');
bowerVersion = _readVersion('bower.json');

if (packageVersion && bowerVersion){
  if (packageVersion !== bowerVersion){
    throw "package.json version and bower.json version do not match...";
  }
}

version = packageVersion || bowerVersion;
userV = (version.substr(1).toLowercase === "v");
versionNumbers = version.replace('v').split('.');

var _increase = function(array, position){
  var num;
  if (position < array.length){
    num = parseInt(array[position],10);
    if (!isNaN(num)){
      array[position] = '' + (num+1);
    }
  }
}

var _zerofy = function(array, position){
  for (var i=position,ii=array.length;i<ii;i+=1){
    array[i] = '0';
  }
}



var _updateFiles  = function(){
  var newVersion = versionNumbers.join('.');
  console.log('---------------------------------');
  console.log('New version:            ' + newVersion);
  _updateVersion('package.json', newVersion);
  _updateVersion('bower.json', newVersion); 
}

var _updateVersion = function(filename, version){
  var packageData,
      packageJson
      ;
  if (fs.existsSync(currentFolder + filename)){
    packageData = fs.readFileSync(currentFolder + filename);
    if (packageData){
      packageJson = JSON.parse(packageData);
      packageJson.version = version;
      packageData = JSON.stringify(packageJson, null, 2);
      fs.writeFileSync(currentFolder + filename, packageData);
    }
  }
}




if (process.argv.length>=3){
  cmd = process.argv[2];
  

  switch(cmd)
  {
  case 'r': //revision = last
    _increase(versionNumbers,versionNumbers.length-1);
    _updateFiles();
    break;
  case 'major': //major = first
    _increase(versionNumbers,0);
    _zerofy(versionNumbers,1);
    _updateFiles();  
    break;
  case 'minor': //minor = second
    _increase(versionNumbers,1);
    _zerofy(versionNumbers,2);
    _updateFiles();    
    break;   
  case 'patch': //patch = third
    _increase(versionNumbers,2);
    _zerofy(versionNumbers,3);
    _updateFiles();   
    break;        
  case 'tag':
    if (!shell.which('git')) {
      console.log('Sorry, this script requires git');
      shell.exit(1);
    }
    
    cmds = [
      'git tag -a v' + version + ' -m "Bumped to version v' + version + '"',
      'git push --tags'
    ];

    for (var i = 0, ii = cmds.length; i<ii; i+=1){
      console.log(cmds[i]);
      console.log(shell.exec(cmds[i], {silent:false}).output);
    }
    break;
  default:
    console.log('Unknown command "' + cmd + '"... exiting.');
    console.log('');
    console.log('Available commands:');
    console.log('bump r     = 0.0.0 --> 0.0.1');
    console.log('bump major = 1.2.3 --> 2.0.0');
    console.log('bump minor = 0.1.2 --> 0.2.0');
    console.log('bump patch = 0.0.1.2 --> 0.0.2.0');
    console.log('bump tag   = git tag and push tags');
  }
  
} else {
  console.log('No command... exiting.');
};
   
