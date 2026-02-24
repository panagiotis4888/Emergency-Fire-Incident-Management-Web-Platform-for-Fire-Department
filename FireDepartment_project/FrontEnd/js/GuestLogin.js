function handleGuestLogin(event) {
    event.preventDefault();

    const phone = $('#phone').val();

    if (phone.match(/^\d{10}$/)) {
        localStorage.setItem('telephone', phone);
        localStorage.setItem('type', 'guest');

        window.location.href = "/html/Dashboard.html";
    }
}
