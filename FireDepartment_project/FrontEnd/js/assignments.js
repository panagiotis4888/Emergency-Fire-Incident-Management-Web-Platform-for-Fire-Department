$(() => {
    console.log('wtf')
    $.ajax({
        url: '/incidentsAPI/apply',  // API endpoint to get requests
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const requests = data.requests;  // Array of participations where admin_id = null

            console.log('ok')
            // Create the table structure
            let table = `
                <table border="1">
                    <thead>
                        <tr>
                            <th>Incident ID</th>
                            <th>Volunteer ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            console.log(requests)

            // Populate the table rows
            requests.forEach(request => {
                console.log(request);
                table += `
                    <tr>
                        <td class='incident-id-td' data-incident-id="${request.incident_id}">${request.incident_id}</td>
                        <td class='volunteer-id-td' data-volunteer-id=${request.volunteer_id}>${request.volunteer_id}</td>
                        <td>
                            <button class="accept-btn" data-incident-id="${request.incident_id}" data-volunteer-id="${request.volunteer_id}">Accept</button>
                            <button class="delete-btn" data-incident-id="${request.incident_id}" data-volunteer-id="${request.volunteer_id}">Delete</button>
                        </td>
                    </tr>
                `;
            });

            table += `</tbody></table>`;

            // Inject the table into the div
            $('#requests-div').html(table);

            // Event listeners for the Accept and Delete buttons
            $('.accept-btn').on('click', function() {
                const incidentid = $(this).data('incident-id');
                const volunteerid = $(this).data('volunteer-id');
                handleAccept(incidentid, volunteerid);
            });

            $('.delete-btn').on('click', function() {
                const incidentid = $(this).data('incident-id');
                const volunteerid = $(this).data('volunteer-id');
                handleDelete(incidentid, volunteerid);
            });

            $('.incident-id-td').on('click', function() {
                const incidentid = $(this).data('incident-id');
                window.location.href = `/html/ViewIncident.html?id=${incidentid}`
            });

            $('.volunteer-id-td').on('click', function() {
                const volunteerid= $(this).data('volunteer-id');
                window.location.href = `/html/ViewVolunteer.html?id=${volunteerid}`
            });

        },
        error: function(error) {
            console.error("Error fetching requests:", error);
            $('#requests-table').html("<p>Error loading requests. Please try again later.</p>");
        }
    });
});

function handleAccept(incidentId, volunteerId) {
    $.ajax({
        url: `/incidentsAPI/apply/${incidentId}/accept`,  // Express route for accept
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            volunteer_id: volunteerId,  // Pass volunteer ID
            admin_id: localStorage.getItem('id') // Example admin ID (replace with actual admin ID)
        }),
        success: function(response) {
            alert(response.message);  // Show success message
            location.reload();  // Reload to update the table
        },
        error: function(error) {
            console.error("Error accepting request:", error);
            alert("Failed to accept the request. Please try again.");
        }
    });
}

function handleDelete(incidentId, volunteerId) {
    $.ajax({
        url: `/incidentsAPI/apply/${incidentId}/delete`,  // Express route for delete
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            volunteer_id: volunteerId  // Pass volunteer ID
        }),
        success: function(response) {
            alert(response.message);  // Show success message
            location.reload();  // Reload to update the table
        },
        error: function(error) {
            console.error("Error deleting request:", error);
            alert("Failed to delete the request. Please try again.");
        }
    });
}
