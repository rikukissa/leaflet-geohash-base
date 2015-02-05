"use strict";

var React = require("react");
var L = require("leaflet");
var GeoHash  = require("./GeoHash.js");

var Map = React.createClass({
    componentDidMount: function () {
        this.map = L.map(this.refs.element.getDOMNode());

        this.map.setView([61.5, 23.8], 13);

        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);

        var myGeoHash = GeoHash();
        console.log(myGeoHash);

        for( var i=0; i < myGeoHash.length; i++ ){
            var polygon = L.polygon([
                [myGeoHash[i].latitude[0], myGeoHash[i].longitude[0]],
                [myGeoHash[i].latitude[1], myGeoHash[i].longitude[1]],
                [myGeoHash[i].latitude[2], myGeoHash[i].longitude[2]]
            ]).addTo(this.map);

            var bounds = [[myGeoHash[i].latitude[0], myGeoHash[i].longitude[0]], [myGeoHash[i].latitude[1], myGeoHash[i].longitude[1]]];

            // create an orange rectangle
            L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(this.map);

        }
        //var latlng = L.latLng(50.5, 30.5);
        //L.multiPolygon([myGeoHash.latitude, myGeoHash.longitude]).addTo(this.map);

    },

    componentWillUnmount: function () {
        this.map.remove();
    },

    render: function() {
        return (
            <div className="map-container" ref="element"></div>
        )
    }
});

module.exports = Map;
