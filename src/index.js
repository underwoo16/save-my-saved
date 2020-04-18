const fetch = require('node-fetch');

// api access values DO NOT share these
const client_id = '';
const secret_id = '';
const username = '';
const password = '';

// API access values
const REDDIT_ACCESS_URL = 'https://www.reddit.com/api/v1/access_token';
const REDDIT_AUTH_URL = 'https://oauth.reddit.com';
const SAVED_PATH = `/user/${username}/saved`;

// base64 encode AUTHORIZATION header
let authData = `${client_id}:${secret_id}`;
let buff = Buffer.from(authData);
let base64data = buff.toString('base64');

const headers = {
  Authorization: `Basic ${base64data}`,
  "Content-Type": "application/x-www-form-urlencoded"
}

const body = `grant_type=password&username=${username}&password=${password}`;

fetch(REDDIT_ACCESS_URL, { method: 'POST', headers: headers, body: body})
  .then((res) => {
     return res.json();
})
.then((json) => {
  console.log(json);
  const headers = {
    Authorization: `bearer ${json.access_token}`
  };
  const url = `${REDDIT_AUTH_URL}${SAVED_PATH}`;
  console.log(url);
  fetch(url, { method: 'GET', headers: headers })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json);
    });
});
