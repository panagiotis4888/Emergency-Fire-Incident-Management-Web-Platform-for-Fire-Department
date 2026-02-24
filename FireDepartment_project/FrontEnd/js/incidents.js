const username = localStorage.getItem("username");
const usertype = localStorage.getItem("type");
if (!username && !usertype) {
    window.location.href = "/html/Login.html";
}

function submitEnable() {
    $('#submit').prop('disabled', false);
}

let incidents = [];

function showIncidents() {
    let table = `
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Address</th>
                                <th>Municipality</th>
                                <th>Prefecture</th>
                                <th>Reported at</th>
                                <th>⚡</th>
                                <th>🛻</th>
                                <th>🧑‍🚒</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

    incidents.forEach(incident => {
        console.log(incident)
        table += `
               <tr data-url="/html/ViewIncident.html?id=${incident.incident_id}">
                   <td>${incident.incident_type}</td>
                   <td>${incident.description}</td>
                   <td>${incident.address}</td>
                   <td>${incident.municipality || '-'}</td>
                   <td>${incident.prefecture || '-'}</td>
                   <td>${new Date(incident.start_datetime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })}</td>
                   <td>${incident.danger == 'unknown' ? '?' : (incident.danger || '-')}</td>
                   <td>${incident.driver_volunteer_count}/${incident.vehicles || 0}</td>
                   <td>${incident.simple_volunteer_count}/${incident.firemen || 0}</td>
            ${usertype === 'volunteer' ? `<td><button class="apply-btn" data-incident-id="${incident.incident_id}">apply</button></td>` : ''}
                ${usertype === 'admin' ? `<td><button class="edit-btn" data-incident-id="${incident.incident_id}">edit</button></td>` : ''}
                        `;
    });

    table += `</tbody></table>`;

    $('#incidents-div').html(table);

    $('.apply-btn').on('click', function(event) {
        event.stopPropagation(); // Prevent row click event
        const incidentId = $(this).data('incident-id');
        createApply(incidentId)(event);
    });

    $('.edit-btn').on('click', function(event) {
        event.stopPropagation(); // Prevent row click event
        const incidentId = $(this).data('incident-id');
        window.location.href = `/html/EditIncident.html?incident_id=${incidentId}`;
    });

    $('table tbody').on('click', 'tr', function() {
        const url = $(this).data('url');
        if (url) {
            window.location.href = url; // Redirect to the row's URL
        }
    });
}

function fillIncidentTable() {
    fetch('/incidentsAPI/incidents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'running' })
    }).then(response => response.json())
        .then(data => {
            incidents = data.incidents; // Array of incidents
            showIncidents()
            // Generate table
        })
        .catch(error => {
            console.error("Error fetching incidents:", error);
            $('#incidents-div').html("<p>Error loading incidents. Please try again later.</p>");
        });

    if (usertype === 'admin') {
        let table = `
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Address</th>
                                <th>Municipality</th>
                                <th>Prefecture</th>
                                <th>Reported at</th>
                            </tr>
                        </thead>
                `;
        fetch('/incidentsAPI/incidents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'submitted' })
        }).then(response => response.json())
            .then(data => {
                let unapproved_incidents = data.incidents; // Array of incidents


                unapproved_incidents.forEach(incident => {
                    console.log(incident)

                    table += `
                            <tr data-url="/html/ViewIncident.html?id=${incident.incident_id}">
                                <td>${incident.incident_type}</td>
                                <td>${incident.description}</td>
                                <td>${incident.address}</td>
                                <td>${incident.municipality || '-'}</td>
                                <td>${incident.prefecture || '-'}</td>
                                <td>${new Date(incident.start_datetime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}</td>
                                <td><button class="accept-btn" data-incident-id=${incident.incident_id} onclick="">accept</button></td> 
                                <td><button class="reject-btn" data-incident-id=${incident.incident_id} onclick="">deny</button></td> 
                        `;
                });

                table += `</tbody></table>`;


                $('#left').append('<h1 style="color: #FFF; margin-top: 10vh;">Unapproved incidents</h1>')
                $('#left').append(table);

                $('.accept-btn').on('click', function(event) {
                    event.stopPropagation();
                    const incidentId = $(this).data('incident-id');
                    acceptIncident(incidentId);
                });

                $('.reject-btn').on('click', function(event) {
                    event.stopPropagation(); // Prevent row click event
                    const incidentId = $(this).data('incident-id');
                    rejectIncident(incidentId);
                });

                $('#left').append('<button id="all-incidents-btn" style="margin-top: 5vh">View all incidents</button>')

                $('#all-incidents-btn').on('click', () => {
                    window.location.href = "/html/AllIncidents.html"
                });
                $('table tbody tr').on('click', function() {
                    const url = $(this).data('url');
                    if (url) {
                        window.location.href = url; // Redirect to the URL
                    }
                });

            })
            .catch(error => {
                console.error("Error fetching incidents:", error);
                $('#incidents-div').html("<p>Error loading incidents. Please try again later.</p>");
            });

    }
}

$(() => {
    $('form input').on('input', () => {
        $('#submit').prop('disabled', true);
    })

    fillIncidentTable();
    $("#incidentForm").on("submit", function(event) {
        event.preventDefault();
        console.log($('#latitude').val())
        if ($('#latitude').val().trim() === '') {
            $('#submit').prop('disabled', true);
            return;
        }

        // Collect data from the form
        const incidentData = {
            incident_type: $("#incidentType").val(),
            description: $("#description").val(),
            user_type: usertype,
            address: $("#address").val(),
            lat: $("#latitude").val(),
            lon: $("#longitude").val(),
            prefecture: $("#prefecture").val(),
            municipality: $("#municipality").val(),
            telephone: localStorage.getItem('telephone')
        };

        const jsonData = JSON.stringify(incidentData);

        $.ajax({
            url: "http://localhost:8080/incidentsAPI/incident",
            type: "POST",
            contentType: "application/json",
            data: jsonData,
            success: function(response) {
                alert(`Incident reported successfully! ID: ${response.incident_id}`);
                location.reload();

                $("#incidentForm")[0].reset();
            },
            error: function(xhr, options, error) {
                console.error("Error submitting incident:", error);
                alert("Failed to report the incident. Please try again later.");
            },
        });
    });
});

function acceptIncident(id) {
    $.ajax({
        url: "http://localhost:8080/incidentsAPI/incidentrunning/" + id,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ status: 'running', danger: 'low' }),
        success: function(response) {
            alert(`Incident accepted successfully! ID: ${id}`);
            location.reload();

            $("#incidentForm")[0].reset();
        },
        error: function(xhr, options, error) {
            console.error("Error accepting incident:", error);
            alert("Failed to accept the incident. Please try again later.");
        },
    });
}

function rejectIncident(id) {
    $.ajax({
        url: "http://localhost:8080/incidentsAPI/incidentfake/" + id,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ status: 'fake' }),
        success: function(response) {
            alert(`Incident rejected successfully! ID: ${id}`);
            location.reload();

            $("#incidentForm")[0].reset();
        },
        error: function(xhr, options, error) {
            console.error("Error rejecting incident:", error);
            alert("Failed to reject the incident. Please try again later.");
        },
    });
}

function createApply(id) {
    return (event) => {
        event.preventDefault();

        const incident = incidents.find(incident => incident.incident_id === id);

        const confirmMessage = `Are you sure you want to apply to contribute to the incident: ${incident.incident_type} at ${incident.address}, ${incident.municipality}, ${incident.prefecture}?`;
        const userConfirmed = confirm(confirmMessage);

        if (userConfirmed) {
            console.log(localStorage.getItem('id'))
            fetch(`/incidentsAPI/apply/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: localStorage.getItem('username'), volunteer_id: localStorage.getItem('id') }) // Example: Replace with real user ID
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("You have successfully applied to contribute to the incident!");
                        location.reload();
                    } else {
                        alert("Something went wrong. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error applying to incident:", error);
                    alert("An error occurred. Please try again.");
                });
        }
    };
}
