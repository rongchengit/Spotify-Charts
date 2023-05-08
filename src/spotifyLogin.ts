//generate random string for authorization token
function generateRandomString(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

//makes a hash out of the authorization code using sha256 algorithm
async function generateCodeChallenge(codeVerifier: string) {
  function base64encode(arrayBuffer: ArrayBuffer) {
    //@ts-ignore
    return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}
//the format 
export function getTokenSet() {
  return JSON.parse(localStorage.getItem('tokenSet') as any); //tokenSet
}
function appendUserIdToTokenSet(user_id: string) {
  const newTokenSet = getTokenSet();
  newTokenSet.user_id = user_id;
  localStorage.setItem('tokenSet', JSON.stringify(newTokenSet));
}
export async function authorizeLogin() {
  
  if(localStorage.getItem('code') && localStorage.getItem('code-verifier')){ //if both code and code-verifier are in the authorize login then return that means the person just left the computer on
    const tokenSet = getTokenSet()

    if(tokenSet?.refresh_token && tokenSet.expires_at < Date.now() + 60000) { //if we have a refresh token and if its about to expire then refresh the token
      await refreshAccessToken()
    }
    return
  }
  //if not do all these things
    const clientId = '98d7d7247b8e4cb3a1c7f6257ee1fa61'; //client id non secret decoded
    const redirectUri = 'http://localhost:3000/callback'; //website name

    let codeVerifier = generateRandomString(128);

    generateCodeChallenge(codeVerifier).then(codeChallenge => {
      let state = generateRandomString(16);
      let scope = 'playlist-read-private user-library-read'; //scope for the endpoints to the private data
      
      let args = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope, //using the scope it gives us access to private playlist
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
      });
      localStorage.setItem('code-verifier', codeVerifier);
      window.location.href = 'https://accounts.spotify.com/authorize?' + args; //location.href  goes to a link
    });
}

export async function login() {

    const code_verifier = localStorage.getItem('code-verifier')
    const code = localStorage.getItem('code')

    await createAccessToken({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: "http://localhost:3000/callback",
      code_verifier: code_verifier,
    })
}

export function logout() {
  localStorage.removeItem('tokenSet')
  localStorage.removeItem('code')
  localStorage.removeItem('code-verifier')
}

/**
 * @param {Record<string, string>} params
 * @returns {Promise<string>} 
 */


async function createAccessToken(params: any) {  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: '98d7d7247b8e4cb3a1c7f6257ee1fa61',
      ...params,
    }),
  })
   
  if(!response.ok){
    throw new Error("could not get access token")
  }

  const tokenInfo = await response.json();
  //@ts-ignore
  const accessToken = tokenInfo.access_token
  //@ts-ignore
  const expires_at = Date.now() + 1000 * tokenInfo.expires_in //*1000 because it is milliseconds

  localStorage.setItem('tokenSet', JSON.stringify({ ... tokenInfo, expires_at }))

  return accessToken
}

async function refreshAccessToken( ) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      //@ts-ignore
      refresh_token: JSON.parse(localStorage.getItem('tokenSet')).refresh_token,
      client_id: '98d7d7247b8e4cb3a1c7f6257ee1fa61'
    })
  });

  if(!response.ok){
    throw new Error("could not get access token via refresh token")
  }

  const tokenInfo = await response.json();
  //@ts-ignore
  const expires_at = Date.now() + 1000 * tokenInfo.expires_in //*1000 because it is milliseconds

  localStorage.setItem('tokenSet', JSON.stringify({ ... tokenInfo, expires_at }))

}

async function fetchToken() { //async function that returns a string which is the access token

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", { //get token from spotify API
  method: "POST", //make a post request  to the spotify API
  body: "grant_type=client_credentials", //use the grant type client credentials
  headers: { //the headers we need to provide content, accept, and authorization
    "Content-Type": "application/x-www-form-urlencoded", 
    "Accept": "application/json", //only acepts json
    "Authorization": "Basic OThkN2Q3MjQ3YjhlNGNiM2ExYzdmNjI1N2VlMWZhNjE6YWI5NmY2ZjhmYjkxNDFlZGFlMzc0MDg2NDU5ZTMwNDc=" //adding client id and secret as base64 encoded 
  }
});

const tokenData = await tokenResponse.json(); // from line 14 get the response and put it in a json object
localStorage.setItem('tokenSet', JSON.stringify({ access_token: tokenData.access_token, expires_at: Date.now() + 3600000})) // have access token and expires in 3600000 which is 1 hour

}

//everytime we need a access token we just call this function
//if login use user token
//and if its not logged in use system token
//it will get it from local storage or from spotify
export async function getAccessToken( ) {
  const tokenSet = getTokenSet()

  if (!tokenSet || (!tokenSet.refresh_token && localStorage.getItem('code-verifier'))){ //if token is not found then login 
    if(!localStorage.getItem('code')?.length && window.location.search.length){ //look for the length of the code and it will always be zero instead of null
      //@ts-ignore
      localStorage.setItem('code',new URLSearchParams(window.location.search).get('code'))
    }
    if(!localStorage.getItem("code-verifier") || !localStorage.getItem('code')?.length){ //if not logged in, get system token, or if he doesnt have a code then use a token
      await fetchToken()
      return getTokenSet().access_token
    }
    else{
      await login();
    }
  }
  else if (tokenSet.refresh_token && tokenSet.expires_at < Date.now() + 60000){ //if we have a refresh token and if its about to expire then refresh the token
    await refreshAccessToken()
  }
  //@ts-ignore
  return getTokenSet().access_token
}

export function isLoggedIn(): boolean{
  const tokenSet = getTokenSet()

  return tokenSet && tokenSet.refresh_token
}

export async function fetchProfile() {
  if(isLoggedIn()) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + await getAccessToken()
      }
    });
  
    const data = await response.json();
    appendUserIdToTokenSet(data.id);
    return data
  }
}

function getToken() {

}

export async function checkLogin<T extends (...args: any[]) => any>(func: T): Promise<ReturnType<T> | undefined>{
  if(isLoggedIn()){
    return await func()
  }
  await authorizeLogin()
} 






  //in home.tsx go to conditional and if the user is logged add html element p for P<HTML ELEMENT> put the user name in it and its called get profile
  // if not do the login button