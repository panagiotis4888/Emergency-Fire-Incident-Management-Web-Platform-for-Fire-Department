const user = localStorage.getItem('username')
if(!user){
    window.location.href = "/html/AdminLogin.html";
}


// Handle form submission
$(document).ready(function() {
    $("#incidentForm").on("submit", function(event) {
        event.preventDefault();

        // Collect data from the form
        const incidentData = {
            incident_type: $("#incidentType").val(),
            description: $("#description").val(),
            user_type: "admin",
            user_phone: $("#userPhone").val(),
            address: $("#address").val(),
            lat: $("#latitude").val(),
            lon: $("#longitude").val(),
            prefecture: $("#prefecture").val(),
            municipality: $("#municipality").val(),
        };

        // Convert the data to JSON
        const jsonData = JSON.stringify(incidentData);

        // Send the AJAX request
        $.ajax({
            url: "http://localhost:8080/incidentsAPI/incident",
            type: "POST",
            contentType: "application/json",
            data: jsonData,
            success: function(response) {
                alert(`Incident reported successfully! ID: ${response.incident_id}`);
                $("#incidentForm")[0].reset();
            },
            error: function(xhr, options, error) {
                console.error("Error submitting incident:", error);
                alert("Failed to report the incident. Please try again later.");
            },
        });
    });
});
