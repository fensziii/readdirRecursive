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

        if (bytes === 0){ return "0 Bytes"; }
    
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
        function pad(n, z) {
            z = z || 2;
            return ("00" + n).slice(-z);
        }
        
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        
        return pad(hrs) + ":" + pad(mins) + ":" + pad(secs) + "." + pad(ms, 3);

    }

};


/*

    Thread

*/

if (isMainThread) {

    module.exports.readdirRecursive = function readdirRecursive(options) {

        return new Promise((resolve, reject) => { 

            var rowFiles    = [];
            var rowDirs     = [];
            var rowSizes    = 0;

            var TimeStart  = new Date().getTime();

            var worker = new Worker(__filename, {
                workerData: {
                    path      : options.path
                }
            });

            worker.on("message", (d) => {

                let filepath = d.path;
                var platform = os.platform();

                if(options.fullpath === false && platform === "linux"){ filepath = filepath.replace(options.path + "/", ""); }
                if(options.fullpath === false && platform === "win32"){ filepath = filepath.replace(options.path + "\\", ""); }


                if(d.type === "file"){

                    var _OPTF     = options.filter;
                    var filter    = options.filter === undefined ? /(.*)/g : options.filter;
    
                    if(filter.test(d.path)){

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

                var TimeEnds = new Date().getTime() - TimeStart;

                resolve({
                    files       : rowFiles,
                    folders     : rowDirs,
                    info        : {
                        time        : TimeEnds,
                        path        : options.path,
                        files       : rowFiles.length,
                        folders     : rowDirs.length,
                        size        : rowSizes,
                        converted   : {
                            size        : tools.formatBytes(rowSizes),
                            time        : tools.msToTime(TimeEnds)
                        }
                    }
                });

            });

        });

    };

} else {

    const walker = function (dir) {
        
        fs.readdir(dir, function (err, files){

            files.forEach((file) => {
            
                var PathRes = path.resolve(dir, file);
    
                var StatsWalk = fs.statSync(PathRes);
        
                if(StatsWalk.isDirectory()){
            
                    parentPort.postMessage({ type: "dir", path: PathRes });
    
                    walker(PathRes);
    
            
                } else {

                    parentPort.postMessage({ type: "file", path: PathRes });
    
                }
            
            });
    
        });

    };

    walker( workerData.path );

}