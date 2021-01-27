var { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

var fs        = require("fs");
var path      = require("path");
var os        = require("os");
var tools     = require("./tools.js");

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

                    var isRexExp  = options.filter.constructor === RegExp ? options.filter : /(.*)/g;
                    var filter    = options.filter === undefined ? /(.*)/g : isRexExp;
    
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
