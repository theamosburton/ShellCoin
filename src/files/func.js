function toggleMenus() {
    var showMenus = document.getElementById('expandMenusIcon');
    var hideMenus = document.getElementById('hideMenusIcon');
    var hiddenMenus = document.getElementById('hiddenMenus');
    if (hideMenus.style.display == 'none') {
        hideMenus.style.display = 'flex';
        hiddenMenus.style.display = 'flex';
        showMenus.style.display = 'none';
    } else {
        hideMenus.style.display = 'none';
        hiddenMenus.style.display = 'none';
        showMenus.style.display = 'flex';
    }
}


// function handleCredentialResponse(response) {
// }
// function decodeJWT(jwtToken) {
//     const payload = JSON.parse(window.atob(jwtToken.split('.')[1]));
//     return payload;
//   }
// window.onload = function () {
//     google.accounts.id.initialize({
//         client_id: '633692520097-mk6mqhj19t50v5d9guvoogrb3uj0v2p4.apps.googleusercontent.com',
//         callback: handleCredentialResponse
//     });
//     document.getElementById('loginButton').addEventListener('click', function () {
//         google.accounts.id.prompt();
//     });
// };

document.getElementById('github-login-btn').addEventListener('click', function () {
    const clientID = 'Ov23libe9d8wlQxjU4XO'; // Replace with your GitHub Client ID
    const redirectURI = 'http://localhost:8080/auth/github/'; // Replace with your GitHub redirect URI
    const scope = 'user'; // Scope of the access request
    const authURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
    window.location.href = authURL;
});