const path  = require("path");

const { readdirRecursive } = require(__dirname + '/index');

(async function (){

    const options = {
        path        : path.join(__dirname),
        fullpath    : false,
        filter      : ".txt",
    };


    const files = await readdirRecursive(options);

    console.log(files); 

})();