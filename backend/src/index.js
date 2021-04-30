const Server = require('./server');

const playground = {
  settings: {
    'schema.polling.enable': false,
  },
};

(async () => {
  const server = await Server({ playground });
  const port = process.env.PORT || 4000;
  const { url } = await server.listen(port);
  console.log(`🚀  Server ready at ${url}`);
})();
