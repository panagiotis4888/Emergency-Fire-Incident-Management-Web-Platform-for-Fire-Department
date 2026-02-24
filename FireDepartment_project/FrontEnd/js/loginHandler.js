function handleLogin(event) {
    event.preventDefault();

    const usertype = $('input[name="usertype"]:checked').val();

    const loginData = {
        username: $('#username').val(),
        password: $('#password').val()
    };

    const jsonData = JSON.stringify(loginData);

    $.ajax({
        url: `http://localhost:8080/${usertype}login`,
        type: "POST",
        contentType: "application/json",
        data: jsonData,
        success: function(response) {
            if (response.username) {
                localStorage.setItem("username", response.username);
                localStorage.setItem("id", response.id);
                localStorage.setItem("type", usertype);

                window.location.href = '/html/Dashboard.html';
            } else {
                const errorElement = $("#error");

                errorElement.text(response.message || "Invalid login credentials!");
                errorElement.css('display', "block");
            }
        },
        error: function(xhr, options, error) {
            const errorElement = $("#error");
            errorElement.text("Server Error!!");
            errorElement.css('display', "block");
        }
    });
}
