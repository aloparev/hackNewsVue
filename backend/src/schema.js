const { stitchSchemas } = require('@graphql-tools/stitch');
const { applyMiddleware } = require('graphql-middleware');
const typeDefs = require('./typeDefs');
const Resolvers = require('./resolver');
const permissions = require('./permissions');
const GraphCmsSchema = require('./graphCms/schema');

module.exports = async () => {
  const graphCmsSchema = await GraphCmsSchema();
  const resolvers = Resolvers({ subschema: graphCmsSchema });

  let gatewaySchema = stitchSchemas({
    subschemas: [
      graphCmsSchema,
    ],
    typeDefs,
    resolvers,
  });
  gatewaySchema = applyMiddleware(gatewaySchema, permissions);
  return gatewaySchema;
};