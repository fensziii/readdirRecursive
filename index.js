var { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

var fs        = require("fs");
var path      = require("path");
var os        = require("os");

/*

    Tools

*/

var tools = {

    formatBytes : function formatBytes(bytes, decimals = 2) {

        /*

            Source : https://stackoverflow.com/a/18650828

        */

        if (bytes === 0) return "0 Bytes";
    
        var k = 1024;
        var dm = decimals < 0 ? 0 : decimals;
        var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    
        var i = Math.floor(Math.log(bytes) / Math.log(k));
    
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

            var time_start  = new Date().getTime();

            var worker = new Worker(__filename, {
                workerData: {
                    path      : options.path
                }
            });

            worker.on("message", (d)=>{

                let filepath = "";
                var platform = os.platform();

                if(options.fullpath === false && platform === "linux"){ filepath = d.path.replace(options.path + "/", ""); }
                if(options.fullpath === false && platform === "win32"){ filepath = d.path.replace(options.path + "\\", ""); }


                if(d.type === "file"){

                    var _OPTF     = options.filter;
                    var filter    = options.filter === undefined || _OPTF === null || _OPTF === false || _OPTF === true || _OPTF === "" ? true : d.includes(options.filter);
    
                    if(filter){

                        var StatsFile = fs.statSync(d.path);
    
                        rowSizes = rowSizes + StatsFile.size;
    
                        rowFiles.push(filepath);
                    }

                }

                if(d.type === "dir"){

                    rowDirs.push(filepath);

                }

            });

            worker.on("error", reject);

            worker.on("exit", (code) => {

                var time_ends = new Date().getTime() - time_start;

                resolve({
                    files       : rowFiles,
                    folders     : rowDirs,
                    info        : {
                        time        : time_ends,
                        path        : options.path,
                        files       : rowFiles.length,
                        folders     : rowDirs.length,
                        size        : rowSizes,
                        converted   : {
                            size        : tools.formatBytes(rowSizes),
                            time        : tools.msToTime(time_ends)
                        }
                    }
                });

            });

        });

    };

} else {

    const Walker = function (dir) {
        
        fs.readdir(dir, function (err, files){

            files.forEach((file) => {
            
                var paths_res = path.resolve(dir, file);
    
                var StatsWalk = fs.statSync(paths_res);
        
                if(StatsWalk.isDirectory()){
            
                    parentPort.postMessage({ type: "dir", path: paths_res });
    
                    Walker(paths_res);
    
            
                } else {

                    parentPort.postMessage({ type: "file", path: paths_res });
    
                }
            
            });
    
        });

    }

    Walker( workerData.path );

}