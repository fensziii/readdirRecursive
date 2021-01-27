
var tools = {

    formatBytes : function formatBytes(bytes, decimals = 2) {

        if (bytes === 0){ return "0 Bytes"; }
    
        var k = 1024;
        var dm = decimals < 0 ? 0 : decimals;
        var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    
        var i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];

    },

    msToTime    : function msToTime(s) {

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
