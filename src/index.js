const fetch = require('node-fetch');

// API auth values DO NOT share these
const client_id = '';
const secret_id = '';
const username = '';
const password = '';


// API access values
const REDDIT_ACCESS_URL = 'https://www.reddit.com/api/v1/access_token';
const REDDIT_AUTH_URL = 'https://oauth.reddit.com';
const REDDIT_SAVED_URL = `${REDDIT_AUTH_URL}/user/${username}/saved`;

// TODO: parsing values
const t3keysToSave = ['title', 'permalink', 'url'];
const t1keysToSave = ['link_title', 'permalink'];

async function getAccessToken() {
  const authData = `${client_id}:${secret_id}`;
  const buff = Buffer.from(authData);
  const base64data = buff.toString('base64');

  const headers = {
    Authorization: `Basic ${base64data}`,
    "Content-Type": "application/x-www-form-urlencoded"
  }

  const body = `grant_type=password&username=${username}&password=${password}`;
  const response = await fetch(REDDIT_ACCESS_URL, { method: 'POST', headers: headers, body: body});
  const json = await response.json();
  return json.access_token;
}

async function getAuthorizationSettings() {
  const accessToken = await getAccessToken();
  const headers = {
    Authorization: `bearer ${accessToken}`
  };
  return { method: 'GET', headers: headers };
}

async function getSavedListings() {
  const requestSettings = await getAuthorizationSettings();
  const response = await fetch(REDDIT_SAVED_URL, requestSettings);
  const json = await response.json();

  let listings = json.data.children;
  let after = json.data.after;

  // todo: make a getNextListings recursive function? base case after===null?
  while (after) {
    const afterUrl = `${REDDIT_SAVED_URL}?after=${after}`;
    const afterResponse = await fetch(afterUrl, requestSettings);
    const afterJson = await afterResponse.json();
    listings.push(...afterJson.data.children);
    after = afterJson.data.after;
  }
  return listings;
}

async function printStuff() {
  const stuff = await getSavedListings();
  console.log(stuff);
}

printStuff();
