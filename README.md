# nodejs - readdirRecursive

[![Build Status](https://travis-ci.com/fensziii/readdirRecursive.svg?branch=master)](https://travis-ci.com/github/fensziii/readdirRecursive)
[![npm package](https://img.shields.io/badge/npm%20package-1.0.6-brightgreen)](https://www.npmjs.com/package/@fensziii/readdirrecursive)

read dir recursively

npm package [@fensziii/readdirrecursive](https://www.npmjs.com/package/@fensziii/readdirrecursive).

## Supported Node versions

**10.x** = Unsupported

**12.x** = Supported

**14.x** = Supported

## Install
```txt
npm i @fensziii/readdirrecursive

or

npm i @fensziii/readdirrecursive --save
```

## Example
```js
var rdr     = require("@fensziii/readdirrecursive")

const path  = require("path");

(async () => {

    const options = {
        path        : path.join(__dirname),
        fullpath    : false,
        filter      : /(.js$)/g // or new RegExp(".js$", "g")
    };

    const files = await rdr.readdirRecursive(options).catch((err) => { console.error(err); });

    console.info(files);

})();
```

## Output
```txt
{
  files       : ["index.js", "tests/test.js"],
  folders     : ["tests"],
  info        : {
    time        : 51,
    path        : "",
    files       : 2,
    folders     : 1,
    size        : 30532,
    converted   : {
      size        : '29.82 KB',
      time        : '00:00:00.051'
    }
  }
}
```
## Changelog

> **1.0.7**
+ Fix fullpath
+ Filter changed to RegExp

## License

***MIT***