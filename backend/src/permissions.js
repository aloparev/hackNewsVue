const { ForbiddenError } = require('apollo-server');
const { rule, shield, allow, deny} = require('graphql-shield');

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        return !!context.person.id
    },
)

const permissions = shield({
    Query: {
        '*': deny,
        posts: allow,
        post: allow,
        people: allow,
        person: allow,
    },
    Person:{
        password:deny
    },
    Post: {
        voters: deny
    },
    Mutation: {
        '*': deny,
        write: isAuthenticated,
        login: allow,
        signup: allow,
        upvote: isAuthenticated,
        delete: isAuthenticated,
        downvote: isAuthenticated
    },
  }, {
    allowExternalErrors: true,
    fallbackRule: allow,
    fallbackError: new ForbiddenError('Not Authorised!'),
  });

module.exports = permissions
