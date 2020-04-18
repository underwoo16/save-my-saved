const fetch = require('node-fetch');
const fs = require('fs');

// API auth values DO NOT share these
const client_id = '';
const secret_id = '';
const username = '';
const password = '';

// API access values
const REDDIT_ACCESS_URL = 'https://www.reddit.com/api/v1/access_token';
const REDDIT_AUTH_URL = 'https://oauth.reddit.com';
const REDDIT_SAVED_URL = `${REDDIT_AUTH_URL}/user/${username}/saved`;

// parsing values
const KEYS_TO_SAVE = {
  't3': ['title', 'permalink', 'url'],
  't1': ['link_title', 'permalink']
};
const COMMA = ',';
const NEWLINE = '\n';

async function getJsonResponse(url, options) {
  const response = await fetch(url, options);
  const json = await response.json();
  return json;
}

async function getAccessToken() {
  const authData = `${client_id}:${secret_id}`;
  const buff = Buffer.from(authData);
  const base64data = buff.toString('base64');

  const headers = {
    Authorization: `Basic ${base64data}`,
    "Content-Type": "application/x-www-form-urlencoded"
  };
  const body = `grant_type=password&username=${username}&password=${password}`;

  const response = await getJsonResponse(REDDIT_ACCESS_URL, { method: 'POST', headers: headers, body: body});
  return response.access_token;
}

async function getAuthorizationSettings() {
  const accessToken = await getAccessToken();
  const headers = {
    Authorization: `bearer ${accessToken}`
  };
  return { method: 'GET', headers: headers };
}

async function getSavedListings() {
  const requestOptions = await getAuthorizationSettings();
  const json = await getJsonResponse(REDDIT_SAVED_URL, requestOptions);

  let listings = json.data.children;
  let after = json.data.after;

  // todo/enhancement: make a getNextListings recursive function? base case after===null?
  while (after) {
    const afterJson = await getJsonResponse(`${REDDIT_SAVED_URL}?after=${after}`, requestOptions);
    listings.push(...afterJson.data.children);
    after = afterJson.data.after;
  }
  return listings;
}

function parseSavedListings(listings) {
  return listings.map(parseSavedItem);
};

// todo/enhancement: there is probably a fancier way to map a subset of keys from one object to another
function parseSavedItem(item) {
  let newItem = {};
  for (const key of KEYS_TO_SAVE[item.kind]) {
    newItem[key] = item.data[key];
  }
  return newItem;
}

function convertListingsToCsvString(listings) {
  let csv = '';

  for (const item of listings) {
    for (const key of Object.keys(item)) {
      csv += `${item[key]}${COMMA}`;
    }
    csv += NEWLINE;
  }

  return csv;
}

function writeFileCallback(err, data) {
  if (err) {
    return console.log(err);
  }
}

async function driver() {
  const savedListings = await getSavedListings();
  const parsedListings = parseSavedListings(savedListings);
  const csv = convertListingsToCsvString(parsedListings);
  fs.writeFile('saved_listings.csv', csv, writeFileCallback);
}

driver();
