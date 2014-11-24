var http = require("http");
var dns = require("dns");
var urlModule = require('url');

var mmdbreader = require('maxmind-db-reader');

//URL object
var urls = { length: 0 }

//MaxMind GeoIP database supported languages
var allowedLanguages = ["de", "en", "es", "fr", "ja", "pt-br", "ru", "zh-cn"];

//Determine result type from package.json or use city as default
var geoIpType = process.env.npm_package_config_type || "city";
var geoIp = (geoIpType === "city" ? mmdbreader.openSync('./db/GeoLite2-City.mmdb') : mmdbreader.openSync('./db/GeoLite2-Country.mmdb'));

http.createServer(function(req,res) {

    var getGeoInfo = function() {

        var responseObj = {};
        var responseStatus = 200;

        geoIp.getGeoData(urls[url], function(err, geodata){

            responseObj.url = url;
            responseObj.ip = urls[url];

            if (geodata !== null && typeof geodata !== "undefined") {
                responseObj.country = geodata.country.names[language];
                responseObj.countryIsoCode = geodata.country.iso_code;

                if(geoIpType === "city") {
                    if (geodata.city && geodata.city.names[language]) {
                        responseObj.city = geodata.city.names[language];
                    }
                    if (geodata.subdivisions && geodata.subdivisions.length >= 1 && geodata.subdivisions[0].names[language]) {
                        responseObj.subdivision = geodata.subdivisions[0].names[language];
                    }
                    if (geodata.location && geodata.location.latitude && geodata.location.longitude) {
                        responseObj.location = {lat: geodata.location.latitude, lng: geodata.location.longitude};
                    }
                }

            }

            if (err) {
                responseObj.error = err;
                responseStatus = 500;
            }

            respond(responseObj, responseStatus);

        });

    };

    var respond = function(responseObj, responseStatus) {
        res.writeHead(responseStatus, {'Content-Type': 'application/json; charset=utf-8'});
        res.write(JSON.stringify(responseObj));
        res.end();
    }

    var cb = function(err, adress, family) {
        if(url != "favicon.ico") {
            if( urls[url] === undefined && String(adress) !== "undefined") {
                urls.length += 1;
            };
            urls[url] = String(adress);
        };

        //Check whether the IP address could be determined from the URL provided. If not, display error message
        if (typeof adress === "undefined" || err) {
            respond({error: "Could not identify IP address from URL " + url + " Please check whether this is a correct URL."}, 404)
        } else {
            getGeoInfo();
        }
    };

    var url_parts = urlModule.parse(req.url, true);
    var queryString = url_parts.query;

    var url = queryString.url;
    var language = (queryString.lang ? queryString.lang.toLowerCase() : "en");

    if (url) {

        url = url.replace(/^(https?|ftp):\/\//,"").split("/")[0];
        language = (allowedLanguages.indexOf(language) > -1 ? language.toLowerCase() : "en");

        dns.lookup(url, cb)

    }

}).listen(process.env.npm_package_config_port || 3000);