require('dotenv').config();
const {rule} = require('graphql-shield');

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        const currUser = await context.dataSources.usersDataSrc.getUser();
        if(currUser){
            context.currUser = currUser
            return true;
        }
        return new Error("Sorry, your credentials are wrong!");
    },
)

const isEmailTaken = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        args.email = args.email.trim();
        if(! await context.dataSources.usersDataSrc.getUserByEmail(args.email)){
            return true
        }else{
            return new Error("This email already is taken by another user")
        }
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

const enteredCorrectPassword = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        const userCorrect = await context.dataSources.usersDataSrc.getUserByEmail(args.email);
        const passwordIsRight = await userCorrect.comparePassword(args.password);
        if(userCorrect && passwordIsRight){
            return true;
        }else{
            return new Error('wrong email/password combination');
        }
  }
)

module.exports = {isAuthenticated, isEmailTaken, isPasswordShort, mayVote, mayDelete, postFound, enteredCorrectPassword}