$(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const incidentId = urlParams.get('id');
    const user_type = localStorage.getItem('type');
    if (!incidentId) {
        $('#incident-container').html('<p>No incident ID provided in the URL.</p>');
        return;
    }
    let recipient_type = 'public';
    if (user_type === 'volunteer') {
        recipient_type = 'volunteers';
    } else if (user_type === 'admin') {
        recipient_type = 'admin';
    }
    if(user_type === 'guest'){
        $('#messages-div').hide();
    }
    $.ajax({
        url: `/message/incident_messages`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ incident_id: incidentId, recipient_type: recipient_type, volunteer_id: localStorage.getItem('id') }),
        success: function(data) {
            const is_in_incident = data.is_in_incident;
            $('#recipient').append(
                `
                <option value="public">Public</option>
                ${user_type == 'volunteer' && is_in_incident|| user_type == 'admin' ? '<option value="volunteers">Volunteers</option>' : ''}
                <option value="admin">Admin</option>
            `);

            console.log('cmooon', data)
            data.messages.forEach((message) => {
                console.log(message.text)
                const row = `<tr>
                                <td>${message.text}</td>
                                <td>${message.recipient_type}</td>
                                <td>${message.date_time}</td>
                    </tr>
                        `

                $('#message-table-body').append(row);
            });
        },
        error: function() {
            $('#incident-container').html('<p>Error fetching incident data.</p>');
        }
    });


    $.ajax({
        url: `/incidentsAPI/incident/${incidentId}`,
        method: 'GET',
        success: function(data) {
            if (data.success) {
                const incident = data.incident;

                $('#incident-type').text(incident.incident_type);
                $('#description').text(incident.description);
                $('#user-type').text(incident.user_type);
                $('#address').text(incident.address);
                $('#latitude').text(incident.lat || 'N/A');
                $('#longitude').text(incident.lon || 'N/A');
                $('#municipality').text(incident.municipality || 'N/A');
                $('#prefecture').text(incident.prefecture || 'N/A');
                $('#start-datetime').text(incident.start_datetime);
                $('#end-datetime').text(incident.end_datetime || 'N/A');
                $('#danger').text(incident.danger || 'N/A');
                $('#status').text(incident.status);
                $('#final-result').text(incident.finalResult || 'N/A');
                $('#vehicles').text(`${incident.driver_volunteer_count}/${incident.vehicles || 0}`);
                $('#firemen').text(`${incident.simple_volunteer_count}/${incident.firemen|| 0}`);
                addMarker(incident.lat, incident.lon, 'huh')
            } else {
                $('#incident-container').html('<p>Incident not found.</p>');
            }
        },
        error: function() {
            $('#incident-container').html('<p>Error fetching incident data.</p>');
        }
    });

    $('#message-form').on('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission
        const recipient_type = $('#recipient').val().toLowerCase();
        console.log(recipient_type);
        const message = $('#message-text').val();
        const sender_type = localStorage.getItem('type')
        const sender_id = Number(localStorage.getItem('id'));
        const recipient_id = -1;

        // Validate the form data
        if (!message.trim()) {
            alert('Message cannot be empty!');
            return;
        }

        // Send the POST request
        $.ajax({
            url: 'http://localhost:8080/message', // Replace with your actual server endpoint
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ recipient_type, recipient_id, sender_type, sender_id, message, incident_id: incidentId }),
            success: function(response) {
                alert('Message sent successfully!');
                $('#message-text').val(''); // Clear the textarea
                window.location.reload()
            },
            error: function(error) {
                console.error('Error sending message:', error);
                alert('Failed to send message. Please try again.');
            }
        });
    });
});
