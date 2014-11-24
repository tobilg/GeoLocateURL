# GeoLocateURL

GeoLocateURL is a WebService implemented with NodeJS which takes an URL and returns the URL's IP address, ISO country code and country name and other information if found. It utilizes the MaxMind GeoLite2 Free database available at [http://dev.maxmind.com/geoip/geoip2/geolite2/](http://dev.maxmind.com/geoip/geoip2/geolite2/) for its IP lookups.

## Installation

### Prerequisites

To run this project, a valid install of NodeJS is required. You can check your installation by running `node --version` in your command shell.

### Checkout the project from Github to a local folder

`git clone git@github.com:tobilg/GeoLocateURL.git`

### Download GeoLite2 Free

Download the database from [http://geolite.maxmind.com/download/geoip/database/GeoLite2-Country.mmdb.gz](http://geolite.maxmind.com/download/geoip/database/GeoLite2-Country.mmdb.gz) and unzip the contents to the project's subfolder `db`

### Install module dependencies

Navigate to the folder where you checked out the project to in your console. Run `npm install`. The module `maxmind-db-reader` should be installed successfully.

### Run the WebService

Navigate to the folder where you checked out the project to in your console. Run `npm start`.

To access the WebService via a browser, use `http://localhost:8080/?url=http://www.google.com`. This will return something like

```javascript
{
    "url": "www.google.com",
    "ip": "173.194.39.19",
    "country": "United States",
    "countryIsoCode": "US",
    "city": "Mountain View",
    "subdivision": "California",
    "location": {
        "lat": 37.419200000000004,
        "lng": -122.0574
    }
}
```

The first four properties are always returned if the IP address from the URL was valid. The other properties are returned if found in the GeoLite2 database. Please URL encode the URL in question first.

If you specify the additional URL parameter `lang` by choosing one result language of the following codes ["de", "en", "es", "fr", "ja", "pt-br", "ru", "zh-cn"], you'll receive translated results. For example `http://localhost:8080/?lang=ja&url=http://www.google.com` will return something like

```javascript
{
    "url": "www.google.com",
    "ip": "173.194.39.18",
    "country": "アメリカ合衆国",
    "countryIsoCode": "US",
    "city": "マウンテンビュー",
    "subdivision": "カリフォルニア州",
    "location": {
        "lat": 37.419200000000004,
        "lng": -122.0574
    }
}
```