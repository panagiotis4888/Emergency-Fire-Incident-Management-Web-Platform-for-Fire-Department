const user = localStorage.getItem("username");
const usertype = localStorage.getItem("type");

if (!user && !usertype) {
    window.location.href = "/html/Login.html";
}

$(() => {
    $.ajax({
        url: 'http://localhost:8080/incidentsAPI/incidents',
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            status: 'running',
            username: localStorage.getItem('type') === 'admin' ? null : localStorage.getItem('username'),
            usertype: localStorage.getItem('type')
        }),
        success: (data) => {
            data.incidents.forEach((incident => {
                addMarker(incident.lat, incident.lon, incident.description);
            }));

            if(!data.user_position) {
                $('#dashboard-status-text').hide();
                return;
            };
            addMarker(data.user_position.lat, data.user_position.lon, "You", "blue");


            const status = data.status;
            $('#dashboard-status').text(status);

            let status_color;
            if (status === 'HIGH DANGER') {
                status_color = 'red';
            }
            if (status === 'Caution') {
                status_color = 'yellow';
            }
            if (status === 'Safe') {
                status_color = 'green';
            }

            $('#dashboard-status').css('color', status_color);
            if (data.nearest_fire_km && data.nearest_fire_km < Infinity) {
                $('#nearest-fire').text(`Nearest fire: ${data.nearest_fire_km}km away!`);
            }
            console.log(data.user_position);
        },
        error: (xhr, status, error) => {
            $('#dashboard-status').text('error');
        }
    });

});
