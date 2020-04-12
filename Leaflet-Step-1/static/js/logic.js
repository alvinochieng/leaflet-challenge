var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function circlesize(mag) {
  return mag * 20000;
}

function dataColor(mag) {
  if (mag >= 5 ) {
    return "red";
  }
  else if (mag >= 4) {
    return "green";
  }
  else if (mag >= 3) {
    return "yellow";
  }
  else if (mag >= 2) {
    return "orange";
  }
  else if (mag >= 1) {
    return "turquoise";
  }
  else {
    return "maroon";
  }
};


d3.json(quakeUrl, function(data) {
  console.log(data)

  createFeatures(data.features);

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
  onEachFeature: onEachFeature

  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id:"mapbox.light",
  accessToken: API_KEY

});

var overlayMaps = {
  Earthquakes: earthquakes
};

var myMap = L.map("map", {
  center: [
    35.2271, -80.8431
  ],
  zoom: 5,
  layers: [lightmap, earthquakes]
});

  // Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  // var limits = geojson.options.limits;
  // var colors = geojson.options.colors;
  var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML += '<i style="background:' + dataColor[i] + ' "></i> ' + labels[i] + '<br>';
  }
  return div;

};

legend.addTo(myMap);

};

