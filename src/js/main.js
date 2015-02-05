'use strict';

console.log('foobar');

var React = require("react");
var map = require("./map.jsx");
var myMap = React.createElement(map);
React.render(myMap, document.getElementById("map"));
