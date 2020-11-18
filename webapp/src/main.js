import Vue from "vue";
import App from "./App.vue";
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-boost";

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: "http://localhost:4000",
});
Vue.use(VueApollo);
const apolloProvider = new VueApollo({ defaultClient: apolloClient });

new Vue({
  el: "#app",
  apolloProvider,
  render: (h) => h(App),
});
