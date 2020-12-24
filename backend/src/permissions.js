const { ForbiddenError } = require('apollo-server');
const { delegateToSchema } = require('@graphql-tools/delegate');
const { rule, shield, allow, deny, and} = require('graphql-shield');

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, context, info) => {
        return !!context.person.id
    },
)

const isPasswordShort = rule({ cache: 'contextual' })(
    async (parent, args) => {
        
        args.password = args.password.trim();
        if(args.password.length < 8){
            new Error("Accept only passwords with a length of at least 8 characters")
        }else{
            return true;
        }
    },
)

const mayVote = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        const currUser = await context.dataSources.usersDataSrc.getUser();
        const userId = currUser.id;
        const currPost = await context.dataSources.postsDataSrc.getPost(args.id);
        if(!(currPost.voters.has(userId))){
            return true;
        }
        else{
            return new Error("This user voted on that post already.");
        }
    },
)

const mayDelete = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        const currUser = await context.dataSources.usersDataSrc.getUser();
        const userId = currUser.id;
        const currPost = await context.dataSources.postsDataSrc.getPost(args.id);
        if (userId === currPost.author.id){
            return true
        }else{
            return new Error("Only the author of a post may delete a post.");
        }
    },
)

const postFound = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        const currPost = await context.dataSources.postsDataSrc.getPost(args.id);
        if (currPost){
        return true
        }else{
            return new Error('No post with this ID found.');
        }
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
    Mutation: {
        '*': deny,
        write: isAuthenticated,
        login: allow,
        upvote: and(isAuthenticated, mayVote, postFound),
        delete: and(isAuthenticated, mayDelete, postFound),
        downvote: and(isAuthenticated, mayVote, postFound),
        signup: isPasswordShort
    },
  }, {
    allowExternalErrors: true,
    fallbackRule: allow,
    fallbackError: new ForbiddenError('Not Authorised!'),
  });

module.exports = permissions
