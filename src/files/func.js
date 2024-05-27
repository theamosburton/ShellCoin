function toggleMenus(){
    var showMenus = document.getElementById('expandMenusIcon');
    var hideMenus = document.getElementById('hideMenusIcon');
    var hiddenMenus = document.getElementById('hiddenMenus');
    if(hideMenus.style.display == 'none'){
        hideMenus.style.display = 'flex';
        hiddenMenus.style.display = 'flex';
        showMenus.style.display = 'none';
    }else{
        hideMenus.style.display = 'none';
        hiddenMenus.style.display = 'none';
        showMenus.style.display = 'flex';
    }
}
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // You can send this token to your server for further processing
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: '633692520097-mk6mqhj19t50v5d9guvoogrb3uj0v2p4.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    document.getElementById('loginButton').addEventListener('click', function () {
        google.accounts.id.prompt();
    });
};