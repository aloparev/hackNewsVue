import Vue from "vue";
import App from "./App.vue";
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-boost";

// const apolloEndpointRemote = process.env.GRAPHQL_API_ENDPOINT;
const apolloEndpointLocal = "http://localhost:4000";

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: apolloEndpointLocal,
});
Vue.use(VueApollo);
const apolloProvider = new VueApollo({ defaultClient: apolloClient });

new Vue({
  el: "#app",
  apolloProvider,
  render: (h) => h(App),
});
