const { fetch } = require('cross-fetch');
const { print } = require('graphql');
const { GRAPH_CMS_API_TOKEN, GRAPH_CMS_ENDPOINT } = require('../config');

module.exports = async ({ document, variables }) => {
    const query = print(document);
    const headers = { 'Content-Type': 'application/json' };
    if (GRAPH_CMS_API_TOKEN) headers.Authorization = `Bearer ${GRAPH_CMS_API_TOKEN}`;
  
    const fetchResult = await fetch(GRAPH_CMS_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };