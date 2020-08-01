# nodejs - readdirRecursive

[![Build Status](https://travis-ci.com/fensziii/readdirRecursive.svg?branch=master)](https://travis-ci.com/github/fensziii/readdirRecursive)

read dir recursively

## Supported Node versions
```
10.x = Unsupported
12.x = Supported
14.x = Supported
```

## Example

```
const { readdirRecursive } = require(__dirname + '/index');

const path  = require("path");

const options = {
    path        : path.join(__dirname),
    fullpath    : false,
    filter      : ".json",
};

const files = await readdirRecursive(options);

console.log(files);
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
