const {rule} = require('graphql-shield');

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, context, info) => {
        return !!(await context.dataSources.usersDataSrc.getUser(context.decodedJwt.id));
    },
)

module.exports = {isAuthenticated}