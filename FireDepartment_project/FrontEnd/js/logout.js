$('#navlogout').on('click', () => {
    localStorage.removeItem('username');
    localStorage.removeItem('telephone');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
    window.location.href = '/';
});

