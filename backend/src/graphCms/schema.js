const { introspectSchema, wrapSchema } = require('@graphql-tools/wrap');
const executor = require('./executor')

module.exports = async () => wrapSchema({
  schema: await introspectSchema(executor),
  executor,
});