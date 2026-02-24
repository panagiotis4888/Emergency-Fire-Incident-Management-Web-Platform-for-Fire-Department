$('#nav').load('/components/navbar.html', function(response, status, xhr) {
    if (status === "error") {
        console.error("Error loading navbar:", xhr.statusText);
    }
    $('#navname').text(localStorage.getItem('username'));



    if (localStorage.getItem('type') == 'admin') {
        $("#navprofile").hide();

        $.ajax({
            url: 'http://localhost:8080/incidentsAPI/apply',
            method: 'GET',
            contentType: "application/json",
            data: JSON.stringify({
                status: 'running',
                username: localStorage.getItem('username')
            }),
            success: (data) => {
                const assignments = $('#navassignments');
                const length = data.requests.length;
                if (length > 0) {
                    assignments.append(`(${length})`);
                    assignments.css('color', 'blue');
                }
            },
            error: (xhr, status, error) => {
            }
        });

        $.ajax({
            url: 'http://localhost:8080/incidentsAPI/submitted_incident_count',
            method: 'GET',
            contentType: "application/json",
            success: (data) => {
                console.log(data)
                const incidents = $('#navincidents');
                if (data.count > 0) {
                    incidents.append(`(${data.count})`);
                    incidents.css('color', 'blue');

                }
            },
            error: (xhr, status, error) => {
            }
        });

    }
    else {
        $('#navstatistics').hide();
        $('#navassignments').hide();
    }

    // footer included later

    const footer = `
        <footer>
            <a href="https://www.wikihow.com/Put-Out-a-Fire">How to stop a fire</a>
            <a href="https://www.wikihow.com/Prevent-a-Kitchen-Fire">How to prevent a kitchen fire</a>
            <a href="https://www.wikihow.com/Provide-First-Aid-for-a-Broken-Bone">First aid basics</a>
            <a href="/html/AI.html">Talk with AI consultant</a>
        <footer>
    `
    $('body').append(footer) 
});

