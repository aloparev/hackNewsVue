require('dotenv').config();
const {rule} = require('graphql-shield');

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        
        const currUser = await context.dataSources.usersDataSrc.getUser(context.decodedJwt.id);
        
        if(currUser){

            context.currUser = currUser
            return true;
        }

        return false;
    },
)

const isEmailTaken = rule({ cache: 'contextual' })(
    async (parent, args, context) => {

        args.email = args.email.trim();
        return !!(await context.dataSources.usersDataSrc.getUserByEmail(args.email));
    },
)


const isPasswordShort = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
        
        args.password = args.password.trim();
        return args.password.length < 8;
    },
)

module.exports = {isAuthenticated, isEmailTaken, isPasswordShort}