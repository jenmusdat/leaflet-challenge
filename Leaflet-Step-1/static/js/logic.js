// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY,
  }
);

// Initialize all of the LayerGroups we'll be using
var layers = {
  green: new L.LayerGroup(),
  lightgreen: new L.LayerGroup(),
  yellow: new L.LayerGroup(),
  gold: new L.LayerGroup(),
  orange: new L.LayerGroup(),
  red: new L.LayerGroup(),
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [
    layers.green,
    layers.lightgreen,
    layers.yellow,
    layers.gold,
    layers.orange,
    layers.red,
  ],
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "-10-10": layers.green,
  "10-30": layers.lightgreen,
  "30-50": layers.yellow,
  "50-70": layers.gold,
  "70-90": layers.orange,
  "90+": layers.red,
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright",
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  green: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "green",
    markerColor: "green",
    shape: "circle",
  }),
  lightgreen: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "lightgreen",
    markerColor: "lightgreen",
    shape: "circle",
  }),
  yellow: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "yellow",
    markerColor: "yellow",
    shape: "circle",
  }),
  gold: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "gold",
    markerColor: "gold",
    shape: "circle",
  }),
  orange: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "orange",
    markerColor: "orange",
    shape: "circle",
  }),
  red: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "red",
    markerColor: "red",
    shape: "circle",
  }),
};

// Perform an API call to the Citi Bike Station Information endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php").then(
  function (infoRes) {
    
        // Create an object to keep of the number of markers in each layer
        var stationCount = {
          green: 0,
          lightgreen: 0,
          yellow: 0,
          gold: 0,
          orange: 0,
          red: 0,
        };

        // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
        var stationStatusCode;

        // // Loop through the stations (they're the same size and have partially matching data)
        // for (var i = 0; i < stationInfo.length; i++) {
        //   // Create a new station object with properties of both station objects
        //   var station = Object.assign({}, stationInfo[i], stationStatus[i]);
        //   // If a station is listed but not installed, it's coming soon
        //   if (!station.is_installed) {
        //     stationStatusCode = "green";
        //   }
        //   // If a station has no bikes available, it's empty
        //   else if (!station.num_bikes_available) {
        //     stationStatusCode = "lightgreen";
        //   }
        //   // If a station is installed but isn't renting, it's out of order
        //   else if (station.is_installed && !station.is_renting) {
        //     stationStatusCode = "yellow";
        //   }
        //   // If a station has less than 5 bikes, it's status is low
        //   else if (station.num_bikes_available < 5) {
        //     stationStatusCode = "gold";
        //   }
        //   // If a station has less than 5 bikes, it's status is low
        //   else if (station.num_bikes_available < 5) {
        //     stationStatusCode = "orange";
        //   }
        //   // Otherwise the station is normal
        //   else {
        //     stationStatusCode = "red";
        //   }

        //   // Update the station count
        //   stationCount[stationStatusCode]++;
        //   // Create a new marker with the appropriate icon and coordinates
        //   var newMarker = L.marker([station.lat, station.lon], {
        //     icon: icons[stationStatusCode],
        //   });

        //   // Add the new marker to the appropriate layer
        //   newMarker.addTo(layers[stationStatusCode]);

        //   // Bind a popup to the marker that will  display on click. This will be rendered as HTML
        //   newMarker.bindPopup(
        //     station.name +
        //       "<br> Capacity: " +
        //       station.capacity +
        //       "<br>" +
        //       station.num_bikes_available +
        //       " Bikes Available"
        //   );
        // }

//         // Call the updateLegend function, which will... update the legend!
//         updateLegend(updatedAt, stationCount);
//       }
//     );
//   }
// );

// // Update the legend's innerHTML with the last updated time and station count
// function updateLegend(//earthquake data
//     ) {
// //   document.querySelector(".legend").innerHTML = [
//     // "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
//     // `<p class='out-of-order'>Out of Order Stations: </p>`,
//     // "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON +
//     //   "</p>",
//     // "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
//     // "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
//     // "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>",
// //   ].join("");
// }
