const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

const fs        = require("fs");
const path      = require("path");
const os        = require("os");

/*

    Tools

*/

const tools = {

    formatBytes : function formatBytes(bytes, decimals = 2) {

        /*

            Source : https://stackoverflow.com/a/18650828

        */

        if (bytes === 0) return "0 Bytes";
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];

    },

    msToTime    : function msToTime(s) {

        /*

            Source : https://stackoverflow.com/a/9763769

        */

        // Pad to 2 or 3 digits, default is 2
        var pad = (n, z = 2) => ("00" + n).slice(-z);

        return pad(s/3.6e6|0) + ":" + pad((s%3.6e6)/6e4 | 0) + ":" + pad((s%6e4)/1000|0) + "." + pad(s%1000, 3);

    }

}


/*

    Thread

*/

if (isMainThread) {

    module.exports.readdirRecursive = function readdirRecursive(options) {

        return new Promise((resolve, reject) => { 

            var rowFiles    = [];
            var rowDirs     = [];
            var rowSizes    = 0;

            const time_start    = new Date().getTime();

            const worker = new Worker(__filename, {
                workerData: {
                    path      : options.path
                }
            });

            worker.on("message", (d)=>{

                let filepath    = "";
                const platform  = os.platform();

                if(options.fullpath === false && platform === "linux") filepath = d.path.replace(options.path + "/", "");
                if(options.fullpath === false && platform === "win32") filepath = d.path.replace(options.path + "\\", "");


                if(d.type === "file"){

                    const _OPTF     = options.filter;
                    const filter    = _OPTF === undefined || _OPTF === null || _OPTF === false || _OPTF === true || _OPTF === "" ? true : d.includes(options.filter);
    
                    if(filter){

                        var stats_dir = fs.statSync(d.path);
    
                        rowSizes = rowSizes + stats_dir.size;
    
                        rowFiles.push(filepath);
                    }

                }

                if(d.type === "dir"){

                    rowDirs.push(filepath);

                }

            });

            worker.on("error", reject);

            worker.on("exit", (code) => {

                const time_ends = new Date().getTime() - time_start;

                resolve({
                    path      : options.path,
                    files     : rowFiles,
                    folders   : rowDirs,
                    size      : rowSizes,
                    time      : time_ends,
                    counter   : {
                        files       : rowFiles.length,
                        folders     : rowDirs.length
                    },
                    converted : {
                        size        : tools.formatBytes(rowSizes),
                        time        : tools.msToTime(time_ends)
                    }
                });

            });

        });

    };

} else {

    const walk = function (dir) {
        
        fs.readdir(dir, function (err, files){

            files.forEach((file) => {
            
                const paths_res = path.resolve(dir, file);
    
                const stats_dir = fs.statSync(paths_res);
        
                if(stats_dir.isDirectory()){
            
                    parentPort.postMessage({ type: "dir", path: paths_res });
    
                    walk(paths_res);
    
            
                } else {

                    parentPort.postMessage({ type: "file", path: paths_res });
    
                }
            
            });
    
        });

    }

    walk( workerData.path );

}