var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var faultLineData = "static/data/PB2002_plates.json"

function circlesize(mag) {
  return mag * 20000;
}

function dataColor(mag) {
  if (mag >= 5 ) {
    return "#e6e60d";
  }
  else if (mag >= 4) {
    return "#d2d216";
  }
  else if (mag >= 3) {
    return "#b9b91d";
  }
  else if (mag >= 2) {
    return "#9b9b28";
  }
  else {
    return "#e9a345";
  }
};


d3.json(quakeUrl, function(data) {
  console.log(data)

  createFeatures(data.features);
});


d3.json(faultLineData, function(new_data){
  console.log(new_data)

  L.geoJSON(new_data, {
    style: function() {
      return {
        color: "red",
        fillOpacity: 0
      }
    }
  }).addTo(fault_line)

});

function createFeatures(quakeData) {

  function onEachFeature(feature, layer){
    layer.bindPopup("<center><b>Location:</b>" + feature.properties.place + "<br><hr><b>Magnitude:</b>" + feature.properties.mag
    + "<br><hr><b>Type:</b>" + feature.properties.type + "<br><hr><b>Tsunami:</b>" + feature.properties.tsunami + "</center>");
  };

  var earthquakes = L.geoJSON(quakeData, {

  pointToLayer: function (feature, lat) {
    return L.circle(lat,{
      radius: circlesize(feature.properties.mag),
      fillColor: dataColor(feature.properties.mag),
      fillOpacity: 2,
      stroke: false,
    })
  },
  onEachFeature: onEachFeature,

  });

  createMap(earthquakes);
}

var fault_line = new L.LayerGroup();

function createMap(earthquakes) {

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id:"mapbox.light",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

// display one map at a time.
var basemaps = {
  Light: lightmap,
  Dark: darkmap,
  Outdoor: streetmap
};

// overlay that may be toggled on or off.
var overlayMaps = {
  Earthquakes: earthquakes,
  "Fault Line": fault_line
};

var myMap = L.map("map", {
  center: [
    35.2271, -80.8431
  ],
  zoom: 5,
  layers: [lightmap, earthquakes, fault_line]

});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(basemaps, overlayMaps).addTo(myMap);

  // Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  limits = [0, 1, 2, 3, 4, 5];
  var labels = [];
    
  for (var i = 0; i < limits.length; i++) {
    div.innerHTML += '<i style="background:' + dataColor(limits[i] + 1) + '"></i> ' +
    limits[i] + (limits[i + 1] ? '-' + limits[i + 1] + '<br>' : '+');
  }
  return div;

};

legend.addTo(myMap);

};

