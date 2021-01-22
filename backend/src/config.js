require('dotenv-flow').config();

const { JWT_SECRET, GRAPH_CMS_ENDPOINT, GRAPH_CMS_API_TOKEN } = process.env;

module.exports = { JWT_SECRET, GRAPH_CMS_ENDPOINT, GRAPH_CMS_API_TOKEN }