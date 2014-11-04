# GeoLocateURL

GeoLocateURL is a WebService implemented with NodeJS which takes an URL and returns the URL's IP address, ISO country code and country name if found. It utilizes the MaxMind GeoLite2 Free database available at [http://dev.maxmind.com/geoip/geoip2/geolite2/](http://dev.maxmind.com/geoip/geoip2/geolite2/) for its IP lookups.

## Installation

1. Prerequisites

To run this project, a valid install of NodeJS is required. You can check your installation by running `node --version` in your command shell.

2. Checkout the project from Github to a local folder

`git clone git@github.com:tobilg/GeoLocateURL.git`

3. Download GeoLite2 Free

Download the database from [http://geolite.maxmind.com/download/geoip/database/GeoLite2-Country.mmdb.gz](http://geolite.maxmind.com/download/geoip/database/GeoLite2-Country.mmdb.gz) and unzip the contents to the project's subfolder `db`

4. Run the WebService

Navigate to the folder where you checked out the project to in your console. Run `node GeoLocateURL.js`.

To access the WebService via a browser, use `http://localhost:3000/?url=http://www.google.com`. This will return something like

```javascript
{
    "url": "www.google.com",
    "ip": "74.125.230.83",
    "isoCode": "US",
    "country": "United States"
}
```