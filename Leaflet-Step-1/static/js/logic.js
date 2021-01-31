/// Creating map object
var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 4,
});

// Adding tile layer
L.tileLayer(
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
var link =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(mag) {
  switch (true) {
    case mag > 3:
      return "yellow";
    case mag > 2.5:
      return "red";
    case mag > 2:
      return "orange";
    case mag > 1.5:
      return "green";
    case mag > 1:
      return "purple";
    case mag > 0.5:
      return "white";
    default:
      return "black";
  }
}

// Grabbing our GeoJSON data..
d3.json(link).then(function (data) {
  // Creating a geoJSON layer with the retrieved data
  console.log(data);
  L.geoJson(data, {
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
        color: "white",
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.5,
        radius: feature.properties.mag * 4,
        weight: 1.5,
      };
    },
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
    labels = [];
    colors = ["black", "white", "purple", "green", "orange", "red", "yellow"];
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
