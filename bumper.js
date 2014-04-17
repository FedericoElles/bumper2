var fs = require('fs'),
    //TODO: require('shelljs/global'), //https://github.com/arturadib/shelljs
    PATH = '/',

    currentFolder,
    packageVersion,
    bowerVersion,
    version,
    versionNumbers,
    userV,
    cmd
    ;
    
currentFolder = __dirname + '/' + PATH;    

//console.log(process.argv);
//console.log('Current Folder: ' + currentFolder);


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
  if (position < array.length){
    num = parseInt(array[position],10);
    if (!isNaN(num)){
      array[position] = '' + (num+1);
    }
  }
}

var _updateFiles  = function(){
  var newVersion = versionNumbers.join('.');
  console.log('---------------------------------');
  console.log('New version:            ' + newVersion);
  _updateVersion('package.json', newVersion);
  _updateVersion('bower.json', newVersion);
  console.log('\GIT:')
  console.log("git tag -a v" + newVersion + " -m 'Bumped to version v" + newVersion + "'");
  console.log("git push --tags");
  
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
      packageData = JSON.stringify(packageJson, null, 4);
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
    _updateFiles();  
    break;
  case 'minor': //minor = second
    _increase(versionNumbers,1);
    _updateFiles();    
    break;   
  case 'build': //build = third
    _increase(versionNumbers,2);
    _updateFiles();   
    break;    
  default:
    console.log('Unknown command "' + cmd + '"... exiting.');
  }
  
} else {
  console.log('No command... exiting.');
}

