
 const { fetch } = require('cross-fetch');
 const { GRAPH_CMS_API_TOKEN, GRAPH_CMS_ENDPOINT } = require('../config');
 
module.exports = async (document) => {

    const headers = { 'Content-Type': 'application/json' };
    if (GRAPH_CMS_API_TOKEN) headers.Authorization = `Bearer ${GRAPH_CMS_API_TOKEN}`;

    const response = await fetch(GRAPH_CMS_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({query : document}),
    });

    const rs = await response.json();
    const {data, errors} = rs

    return {data, errors};
}