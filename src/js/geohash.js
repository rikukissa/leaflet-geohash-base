"use strict";

var Data = require("./data.js");
var GeoHash = require("geohash");

module.exports = function() {
    var points = [];
     for(var i = 0; i < Data.terms.length; i++) {
        points.push(GeoHash.GeoHash.decodeGeoHash(Data.terms[i].term));
     }   
     return points;
};

