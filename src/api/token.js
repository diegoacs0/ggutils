import config from './config.json' assert { type: 'json' };
import * as brs from '../browser.js';
import fs from 'fs';

export async function isTokenDisponible(token) {
    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
var req = await fetch(`${config.endpoint_user}/token`, {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
    "authorization": token,
  },
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});

let json = await req.json();
// get request set cookies too
return json.success;
}

export async function refreshToken(ref_token) {
    /*
    input: Bearer token
    output: {
    "success": true,
    "data": {
        "token": "BLABLABLABLA"
        }
    }
    */
    ref_token = ref_token.replace('Bearer ', '');
    let body = JSON.stringify({
        refresh_token: ref_token
    });
    var req = await fetch(`${config.endpoint_auth}/refresh-token`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "content-type": "application/json",
        }, 
        "body": body,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });

    let json = await req.json();
    return json;
}

export async function getToken() {
    let refresh_token='';
    try {
    refresh_token = fs.readFileSync('./_token', 'utf8');
    } catch {}
    let refresh = await refreshToken(refresh_token);
    if (refresh.success) {
        let token = refresh.data.token;
        if (await isTokenDisponible(token)) return token;
        token = await brs.getGGToken();
        fs.writeFileSync('./_token', token);
        return getToken();
    } else {
        let token = await brs.getGGToken();
        fs.writeFileSync('./_token', token);
        return getToken();
    }
}

//getToken()