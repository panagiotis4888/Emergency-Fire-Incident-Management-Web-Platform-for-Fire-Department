$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const incidentId = urlParams.get('incident_id');

    if (!incidentId) {
        alert("Incident ID not provided.");
        return;
    }
    $.ajax({
        url: `http://localhost:8080/incidentsAPI/geteditincident/${incidentId}`, // API endpoint for a specific incident
        type: "GET",
        success: function(response) {
            const incident = response.incident; // Assuming the response contains the incident object
            $('#danger').val(incident.danger);
            $('#description').val(incident.description);
            $('#firemen').val(incident.firemen);
            $('#vehicles').val(incident.vehicles);
        },
        error: function(xhr, status, error) {
            console.error("Error fetching incident details:", error);
            alert("There was an error fetching the incident details.");
        }
    });

    // Handle form submission to save changes
    $('#editIncidentForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the updated values from the form
        const updatedData = {
            danger: $('#danger').val(),
            description: $('#description').val(),
            firemen: $('#firemen').val(),
            vehicles: $('#vehicles').val()
        };

        // Send the updated data to the server
        $.ajax({
            url: `http://localhost:8080/incidentsAPI/editincident/${incidentId}`,
            type: "PUT",
            data: JSON.stringify(updatedData),
            contentType: "application/json",
            success: function(response) {
                alert("Incident updated successfully.");
                // Redirect back to the incidents list or another page
                window.location.href = "/html/Incidents.html";
            },
            error: function(xhr, status, error) {
                console.error("Error updating incident:", error);
                alert("There was an error updating the incident.");
            }
        });
    });

    $('#finish-btn').on('click', () => {
        const finalResult = prompt('Final result: (don\'t leave empty)');

        $.ajax({
            url: `http://localhost:8080/incidentsAPI/incidentfinish/${incidentId}`,
            type: "PUT",
            data: JSON.stringify({finalResult}),
            contentType: "application/json",
            success: function(response) {
                alert("Incident updated successfully.");
                // Redirect back to the incidents list or another page
                window.location.href = "/html/Incidents.html";
            },
            error: function(xhr, status, error) {
                console.error("Error updating incident:", error);
                alert("There was an error updating the incident.");
            }
        });
    });
});
