

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
fetch('/API/js')
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


window.onload = async function () {

    async function fetchRef(referalCode) {
        const response = await fetch(`/API/checkReferal?ref=${referalCode}`);
        const ref = await response.json();
        return ref.referalStatus;
    }

    var referer = document.getElementById('applyReferer');
    var applyRefLink = document.getElementById('applyReferalLink');
    var applyReferal = document.getElementById('applyReferal');
    var referalInput = document.getElementById('referalInput');
    var getCookie = getCookie('ref');
    
    if (getCookie != null) {
        referer.style.display == 'none';
        var refStatus = await fetchRef(getCookie);
        if(refStatus){
            applyRefLink.style.color = 'rgb(0, 166, 255)';
            applyRefLink.innerHTML = `<span>Referal code applied</span> <span><b>${getCookie}</b></span>`;
            referalInput.value = getCookie;
            referer.style.display = 'none';
            referalInput.style.color = 'rgb(10, 151, 10)';
        }else{
            applyRefLink.style.color = 'tomato';
            applyRefLink.innerHTML = `<span>Invalid referal code</span> <span><b>${getCookie}</b></span>`;
            applyReferal.innerHTML = 'Update';
            referalInput.value = getCookie;
            referalInput.style.color = '#FF6347';
            referer.style.display = 'flex';
        }
        
    }else{
        referer.style.display == 'none';
        applyRefLink.innerHTML = `<span>I have referal code</span>`;
        applyRefLink.style.color = 'rgb(0, 166, 255)';
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for(let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(nameEQ)) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

}
applyReferal.addEventListener('click', async function() {
    var applyRefLink = document.getElementById('applyReferalLink');
    var referalInput = document.getElementById('referalInput');
    var applyReferal = document.getElementById('applyReferal');
    var refValue = referalInput.value;
    var refStatus = await fetchRef(refValue);
    var referer = document.getElementById('applyReferer');
    if(refStatus){
        applyRefLink.style.color = 'rgb(0, 166, 255)';
        applyRefLink.innerHTML = `<span>Referal code applied</span> <span><b>${refValue}</b></span>`;
        setCookie('ref', refValue, 999999, false);
        referer.style.display = 'none';
        applyReferal.innerHTML = 'update';
        referalInput.style.color = 'rgb(10, 151, 10)';
    }else{
        applyRefLink.style.color = 'tomato';
        applyRefLink.innerHTML = `<span>Invalid referal code</span> <span><b>${refValue}</b></span>`;
        referalInput.style.color = '#FF6347';
        referer.style.display = 'flex';
    }
});

async function fetchRef(referalCode) {
    const response = await fetch(`/API/checkReferal?ref=${referalCode}`);
    const ref = await response.json();
    return ref.referalStatus;
}



function setCookie(name, value, days, secure) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    let cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    if (!secure) {
        cookie += ';secure=false';
    }
    document.cookie = cookie;
}


function toggleReferal(){
    var referer = document.getElementById('applyReferer');
    if (referer.style.display == 'none') {
        referer.style.display = 'flex';
    }else{
        referer.style.display = 'none';
    }
}

