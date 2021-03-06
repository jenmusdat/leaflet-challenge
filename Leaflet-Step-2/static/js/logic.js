var tectonicPlates = "data/tectonicPlates.json";

// Use this link to get the geojson data.
var link =
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
d3.json(link).then(function (data) {
  console.log(data);
  d3.json(tectonicPlates).then((pdata) => {
    console.log(pdata);
    // Adding tile layer
    var streetMaps = L.tileLayer(
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
    );

    // Define variables for our tile layers
    var light = L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY,
      }
    );

    var dark = L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY,
      }
    );

    // Only one base layer can be shown at a time
    var baseMaps = {
      Street: streetMaps,
      Light: light,
      Dark: dark,
    };
    var earthquakes = L.geoJson(data.features, {
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
    });
    console.log(pdata);
    var plates = L.geoJson(pdata.features, {
      style: {
        color: "red",
      },
    });
    // Overlays that may be toggled on or off
    var overlayMaps = {
      Earthquakes: earthquakes,
      Tectonic: plates,
    };
    /// Creating map object and set defaulut layers
    var myMap = L.map("mapid", {
      center: [37.09, -95.71],
      zoom: 3,
      layers: [dark, earthquakes],
    });
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
    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);
  });
});
