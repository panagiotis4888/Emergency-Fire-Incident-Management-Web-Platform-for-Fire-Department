let currentMarker = null;

map = new OpenLayers.Map("map");
console.log('huh')
var mapnik = new OpenLayers.Layer.OSM();
map.addLayer(mapnik);

var position = setPosition(35.3053121, 25.0722869);
map.setCenter(position, 9);
var markers = new OpenLayers.Layer.Markers("Markers");
map.addLayer(markers);

function handler(position, message) {
    var popup = new OpenLayers.Popup.FramedCloud("Popup",
        position, null,
        message, null,
        true // <-- true if we want a close (X) button, false otherwise
    );
    map.addPopup(popup);
}

function Check(onCheck) {
    const prefecture = $("#prefecture").val();
    const municipality = $("#municipality").val().trim();
    const address = $("#address").val().trim();
    const country = 'Greece';

    const fullAddress = `${address}, ${municipality}, ${prefecture}, ${country}`;

    // AJAX request
    $.ajax({
        url: `https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${encodeURIComponent(fullAddress)}&accept-language=en&polygon_threshold=0.0`,
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com',
            'x-rapidapi-key': 'ecc4eb7839msh56642c8556d40d4p16eecbjsn5083cc23aba7'
        },
        success: function(response) {
            if (response.length > 0) {
                const location = response[0];
                const lat = location.lat;
                const lon = location.lon;
                const display_name = location.display_name;

                const apidata = $("#apiData");
                if (display_name.includes('Crete')) {
                    if (apidata)
                        apidata.html(`Address found: ${display_name}. Coordinates: Lat ${lat}, Lon ${lon}`);

                    if (currentMarker) {
                        markers.removeMarker(currentMarker);
                    }

                    addMarker(lat, lon, display_name);

                    $("#latitude").val(lat);
                    $("#longitude").val(lon);
                    if (onCheck)
                        onCheck();
                } else {
                    if (currentMarker) {
                        markers.removeMarker(currentMarker);
                    }
                    const position = setPosition(35.3053121, 25.0722869);
                    map.setCenter(position, 9);
                    if (apidata)
                        apidata.html('Address is not within Crete. Please enter a valid address.');
                    return false;
                }
            } else {
                if (currentMarker) {
                    markers.removeMarker(currentMarker);
                }
                const position = setPosition(35.3053121, 25.0722869);
                map.setCenter(position, 9);
                $("#apiData").html('Address not found. Please check the address and try again.');
                console.log('address not found')
            }
        },
        error: function(error) {
            console.error('Error:', error);
            $("#apiData").html('An error occurred while fetching the address. Please try again later.');
        }
    });
}


function setPosition(lat, lon) {
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    return position;
}

/*
function addMarker(lat, lon, message) {
    var position = setPosition(lat, lon);
    currentMarker = new OpenLayers.Marker(position);
    markers.addMarker(currentMarker);

    currentMarker.events.register('mousedown', currentMarker, function(evt) {
        handler(position, message);
    });

    map.setCenter(position, 10);
}*/

function addMarker(lat, lon, message, color = "red") {
    var position = setPosition(lat, lon);

    // Create a custom marker with the specified color
    var size = new OpenLayers.Size(20, 20);
    if (color === 'blue') {
        size = new OpenLayers.Size(10, 10);
    }
    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);

    // Inline SVG for custom colored marker
    var svgMarker = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="${color}" stroke="black" stroke-width="1" />
        </svg>
    `;
    var encodedSVG = 'data:image/svg+xml;base64,' + btoa(svgMarker);

    // Create the icon using the SVG
    var icon = new OpenLayers.Icon(encodedSVG, size, offset);

    // Create the marker with the custom icon
    currentMarker = new OpenLayers.Marker(position, icon);
    markers.addMarker(currentMarker);

    currentMarker.events.register('mousedown', currentMarker, function(evt) {
        handler(position, message);
    });

    map.setCenter(position, 10);
}
