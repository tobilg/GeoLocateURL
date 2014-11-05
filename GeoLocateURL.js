var http = require("http");
var dns = require("dns");
var urlModule = require('url');

var mmdbreader = require('maxmind-db-reader');
var countries = mmdbreader.openSync('./db/GeoLite2-Country.mmdb');

var urls = { length: 0 }

http.createServer(function(req,res) {

    var url_parts = urlModule.parse(req.url, true);
    var queryString = url_parts.query;
    var protomatch = /^(https?|ftp):\/\//;

    var url = queryString["url"].replace(protomatch,"");
    url = url.split("/")[0];

    var finished = function() {

        var responseObj = {};
        var responseStatus = 200;

        if(urls[url] === "undefined") {
            responseStatus = 404;
            responseObj.error = "The URL " + url + " could not be found!";
        } else {

            var geodata = countries.getGeoDataSync(urls[url]);

            responseObj.url = url;
            responseObj.ip = urls[url];

            if (geodata !== null && typeof geodata !== "undefined") {
                responseObj.isoCode = geodata.country.iso_code;
                responseObj.country = geodata.country.names.en;
            }

        }

        res.writeHead(responseStatus, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(responseObj));
        res.end();

    };

    var cb = function(err, adress, family) {
        if(url != "favicon.ico") {
            if( urls[url] === undefined && String(adress) !== "undefined") {
                urls.length += 1;
            };
            urls[url] = String(adress);
        };
        finished();
    };

    dns.lookup(url, cb);

}).listen(process.env.npm_package_config_port || 3000);