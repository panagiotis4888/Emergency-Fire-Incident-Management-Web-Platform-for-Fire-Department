function samePasswordCheck() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var messageElement1 = document.getElementById("passwordMessage1");
    var messageElement2 = document.getElementById("passwordMessage2");
    var passwordLabel = document.querySelector('label[for="password"]');

    if (password !== confirmPassword) {
        messageElement1.textContent = "Passwords do not match.";
        messageElement1.style.color = "red";
        messageElement2.textContent = "Passwords do not match.";
        messageElement2.style.color = "red";
        passwordLabel.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
    } else {
        messageElement1.textContent = "";
        messageElement2.textContent = "";
        return true;
    }
}

function togglePassword(inputId) {
    var inputField = document.getElementById(inputId);

    if (inputField.type === "password") {
        inputField.type = "text";
    } else {
        inputField.type = "password";
    }
}

function isWeakPassword(password) {
    var numCount = password.replace(/[^0-9]/g, '').length;
    const charCount = {};
    let weakPassword = false;

    for (let char of password) {
        charCount[char] = (charCount[char] || 0) + 1;
    }

    const length = password.length;
    for (let count of Object.values(charCount)) {
        if (count / length >= 0.5) {
            weakPassword = true;
            break;
        }
    }

    return (numCount / length) >= 0.5 || weakPassword;
}

function isStrongPassword(password) {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);

    return hasLowerCase && hasUpperCase && hasDigit && hasSymbol;
}


function weakPasswordCheck() {
    let password = document.getElementById('password').value;
    return !isWeakPassword(password);
}

function typeOfPassword() {
    let password = document.getElementById('password').value;
    var messageType = document.getElementById("passwordType");

    if (isWeakPassword(password)) {
        messageType.textContent = "Weak password.";
        messageType.style.color = "red";
    } else if (isStrongPassword(password)) {
        messageType.textContent = "Strong password.";
        messageType.style.color = "green";
    } else {
        messageType.textContent = "Medium password.";
        messageType.style.color = "orange";
    }
}

function handleSubmit(event) {
    event.preventDefault();

    if (samePasswordCheck() && weakPasswordCheck()) {
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            birthdate: document.getElementById('birthdate').value,
            gender: document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null,
            afm: document.getElementById('afm').value,
            volunteer_type: document.getElementById('volunteer_type').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            prefecture: document.getElementById('prefecture').value,
            municipality: document.getElementById('municipality').value,
            address: document.getElementById('address').value,
            lat: document.getElementById('latitude').value,
            lon: document.getElementById('longitude').value,
            job: document.getElementById('job').value,
            telephone: document.getElementById('telephone').value,
            agreement: document.getElementById('agreement').checked
        };

        const jsonData = JSON.stringify(formData);

        document.getElementById('formData').innerHTML = `<pre>${jsonData}</pre>`;

        $.ajax({
            url: "http://localhost:8080/volunteerregister",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function(response) {
                const outputElement = document.getElementById('output');
                outputElement.className = "success";
                outputElement.innerHTML = `${response.message}`;
            },
            error: function(xhr, options, error) {
                const outputElement = document.getElementById('output');
                outputElement.className = "error";
                outputElement.innerHTML = `Error sending data: ${error}`;
            }
        });
    }
}

function setLatAndLon(){

}

document.getElementById('password').addEventListener('input', typeOfPassword);
