const type = localStorage.getItem('type')
const username = localStorage.getItem('username')
let lat = 0;
let lon = 0;

function enableSubmit() {
    console.log('wtf')
    console.log($('#submit').text())
    $('#submit').prop('disabled', false);
}

function disableSubmit() {
    $('#submit').prop('disabled', true);
}

function update_pos() {
    lat = $('#latitude').val();
    lon = $('#longitude').val();
    console.log(lat, lon);
    enableSubmit();
}

function load_update_form() {
    $.ajax({
        url: `http://localhost:8080/get${type}details`,
        type: 'GET',
        data: { username: username },
        success: function(data) {
            $('#telephone').val(data.telephone);
            $('#afm').val(data.afm);
            $('#firstname').val(data.firstname);
            $('#lastname').val(data.lastname);
            $('#birthdate').val(data.birthdate);
            $('#gender').val(data.gender);
            $('#job').val(data.job);
            $('#country').val(data.country);
            $('#address').val(data.address);
            $('#municipality').val(data.municipality);
            $('#prefecture').val(data.prefecture);

            $('#longitude').val(data.longitude);
            $('#latitude').val(data.latitude);

            $('form input').on('input', () => {
                disableSubmit();
            })
        },
        error: function(xhr, status, error) {
            console.error('Error fetching user details:', error);
            alert('Failed to fetch user details. Please try again.');
        }
    });

    $('#profileForm').on('submit', function(event) {
        event.preventDefault();

        const updatedData = {
            username: username,  // Not editable
            email: $('#email').val(),
            firstname: $('#firstname').val(),
            lastname: $('#lastname').val(),
            birthdate: $('#birthdate').val(),
            gender: $('#gender').val(),
            job: $('#job').val(),
            country: $('#country').val(),
            address: $('#address').val(),
            municipality: $('#municipality').val(),
            prefecture: $('#prefecture').val(),
            lat: lat,
            lon: lon
        };

        $.ajax({
            url: `http://localhost:8080/update${type}details`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function(response) {
                alert('Profile updated successfully!');
            },
            error: function(xhr, status, error) {
                console.log('Error updating profile:', error);
                alert('Failed to update profile. Please try again.');
            }
        });
    });

}

$(() => {
    if (type == 'admin') {
        alert('Error: why are you here admin?');
        return;
    }
    load_update_form();
});
