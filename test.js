var readdirrecursive = require(__dirname + '/index')

const path  = require("path");


(async ()=>{

    const options = {
        path        : path.join(__dirname),
        fullpath    : false,
        filter      : "",
    };

    const files = await readdirrecursive.readdirRecursive(options);

    console.log(files);

})();