/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

var rdr     = require("./../index");

const path  = require("path");

(async () => {

    const options = {
        path        : path.join(__dirname, ".."),
        fullpath    : false,
        filter      : /(.*)/g // /(.js$)/g or new RegExp(".js$", "g")
    };

    const files = await rdr.readdirRecursive(options).catch((err) => {

        console.error(err);

    });

    console.warn(files);

})();