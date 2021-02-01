/// Creating map object
var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 4,
});

// Adding tile layer
var streetMap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(myMap);

// Use this link to get the geojson data.
var earthquakes =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(values) {
  switch (true) {
    case values > 90:
      return "red";
    case values > 70:
      return "orange";
    case values > 50:
      return "gold";
    case values > 30:
      return "yellow";
    case values > 10:
      return "purple";
    default:
      return "green";
  }
}

// Grabbing our GeoJSON data..
d3.json(earthquakes).then(function (earthquakes) {
  // Creating a geoJSON layer with the retrieved data
  console.log(earthquakes);
  L.geoJson(earthquakes, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<h3>" +
          feature.properties.place +
          ": " +
          feature.properties.mag +
          "</h3><hr><p>" +
          new Date(feature.properties.time) +
          "</p>"
      );
    },

    style: function (feature) {
      return {
        color: "black",
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        radius: feature.properties.mag * 5,
        weight: 1,
      };
    },
  }).addTo(myMap);
  
  var tectonicPlates = new L.layerGroup();
  var earthquakes = new L.layerGroup(earthquakes);

  // Define variables for our tile layers
  var satelliteMap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY,
    }
  );
  // Retrieve platesURL (Tectonic Plates GeoJSON Data) with D3
  d3.json("data/tectonicPlates.json").then((tectonicPlates) => {
    // Create a GeoJSON Layer the plateData
    L.geoJson(tectonicPlates, {
      color: "orange",
      weight: 2,
      // Add plateData to tectonicPlates LayerGroups
    }).addTo(tectonicPlates);
    // Add tectonicPlates Layer to the Map
    tectonicPlates.addTo(myMap);
  });
  // Only one base layer can be shown at a time
  var baseMaps = {
    Street: streetMap,
    Satellite: satelliteMap,
  };

  // Overlays that may be toggled on or off
  var overlayMaps = {
    Tectonic: tectonicPlates,
    Earthquakes: earthquakeLayer,
  };

  // Create map object and set default layers
  var myMap = L.map("map", {
    center: [46.2276, 2.2137],
    zoom: 6,
    layers: [streetMap, earthquakeLayer],
  });

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [-10, 10, 30, 50, 70, 90];
    labels = [];
    colors = ["green", "purple", "yellow", "gold", "orange", "red"];
    div.innerHTML += "<b>LEGEND: <br>Earthquake <br>Depth</b><br>";
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        colors[i] +
        '"></i>' +
        grades[i] +
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }

    return div;
  };

  legend.addTo(myMap);
});
