function fillTable(volunteer){
    let table_contents = '';
    table_contents += `
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
    `
    for (const key in volunteer){
        table_contents += ` 
                    <tr>
                        <td>${key}</td>
                        <td>${volunteer[key]}</td>
                    </tr>
            `
    }
    table_contents += '</tbody>'
    $("#details-table").html(table_contents);
}


$(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const volunteerId= urlParams.get('id');

    $.ajax({
        url: '/volunteer/' + volunteerId,
        method: 'GET',
        success: (response) => {
            fillTable(response)
        },
        error: (error) => {
            console.log('no volunteer with such id')
        }
    })
});
