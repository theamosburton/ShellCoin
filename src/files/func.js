

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


let client_id = "";
let redirect = ""
fetch('/env')
      .then(response => response.json())
      .then(env => {
        client_id = env.gt_client,
        redirect = env.redirect
      });


function onGithubLogin(){
    const clientID = client_id; // Replace with your GitHub Client ID
    const redirectURI = redirect; // Replace with your GitHub redirect URI
    const scope = 'user'; // Scope of the access reques
    const authURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
    window.location.href = authURL;
}
function decodeJWT(jwtToken) {
    const payload = JSON.parse(window.atob(jwtToken.split('.')[1]));
    return payload;
}
function onGoogleSignIn(response){
    const res = decodeJWT(response.credential);
        login(res);
        async function login(res){
            const logUrl = '/auth/google';
            var encyDat = {
                'name' : `${res.name}`,
                'username':'',
                'profilePic': `${res.picture}`,
                'email': `${res.email}`
            };
            const response = await fetch(logUrl, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(encyDat)
              });
            var isLogged = await response.json();
        }
}