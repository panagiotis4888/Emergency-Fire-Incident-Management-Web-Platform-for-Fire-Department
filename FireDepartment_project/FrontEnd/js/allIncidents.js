const usertype = localStorage.getItem('type');

function showIncidents(table, incidents) {
    let table_contents = `
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
        table_contents += `
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
                ${usertype === 'admin' ? `<td><button class="edit-btn" data-incident-id="${incident.incident_id}">edit</button></td>` : ''}
                        `;
    });

    table_contents += `</tbody></table>`;

    table.append(table_contents);
    
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

function fetch_incidents(status) {
    $.ajax({
        url: '/incidentsAPI/incidents',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            status
        }),
        success: function(response){
            showIncidents($(`#${status}-div`),response.incidents);            
        },
        error: function(error){

        }

    })
}

$(() => {
    fetch_incidents('finished')
    fetch_incidents('fake')
});
