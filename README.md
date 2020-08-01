# nodejs - readdirRecursive

[![Build Status](https://travis-ci.com/fensziii/readdirRecursive.svg?branch=master)](https://travis-ci.com/github/fensziii/readdirRecursive)
[![npm version](https://img.shields.io/badge/npm%20version-1.0.4-brightgreen)](https://www.npmjs.com/package/@fensziii/readdirrecursive)

read dir recursively

## Supported Node versions
```
***10.x*** = Unsupported
***12.x*** = Supported
***14.x*** = Supported
```

## Install

```
npm i @fensziii/readdirrecursive

or

npm i --save @fensziii/readdirrecursive
```

## Example

```
var rdr = require("@fensziii/readdirrecursive")

const path  = require("path");


(async ()=>{

    const options = {
        path        : path.join(__dirname),
        fullpath    : false,
        filter      : "", // example ".txt" Filters for text files
    };

    const files = await rdr.readdirRecursive(options);
    // or
    const files = await rdr.readdirRecursive(options).catch(err=>console.log(err));

    console.log(files);

})();
```



## Output

```
{
  path: '',
  files: [],
  size: 30532,
  time: 51,
  counter: 41,
  converted: { size: '29.82 KB', time: '00:00:00.051' }
}
```
