const {rule} = require('graphql-shield');
const {sign} = require('jsonwebtoken');
const {Post} = require('./DataSources/posts-data-source');
const {User} = require('./DataSources/users-data-source');
require('dotenv').config();

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, context) => {
         console.log("utils",context.decodedJwt.id);
         console.log(context.dataSources.usersDataSrc);
         console.log(!! await context.dataSources.usersDataSrc.getUser(context.decodedJwt.id));
        //return (!! await context.dataSources.usersDataSrc.getUser(context.decodedJwt.id));
        
        const currUser = await context.dataSources.usersDataSrc.getUser(context.decodedJwt.id);
        
        if(currUser){
            context.currUser = currUser
            return true;
        }

        return false;
    },
)

// const createAccessToken = id => {
//     return sign({ id }, process.env.JWT_SECRET, { algorithm: 'HS256' });
// }

const defaultUsers = [
    new User({name:'An', email:'an@gmail.com', password:'12345678'}),
    new User({name:'Ilona', email:'ilona@gmail.com', password:'12345678'}),
    new User({name:'Andrej', email:'andrej@gmail.com', password:'12345678'})
  ];

const defaultPosts=[
    new Post({title: "Just", author: defaultUsers[0]}),
    new Post({title: "VueJS", author: defaultUsers[1]}),
    new Post({title: "Rocks", author: defaultUsers[2]}),
    new Post({title: "CountrysRoad", author: defaultUsers[1]})
  ];

exports.isAuthenticated = isAuthenticated;
exports.defaultPosts = defaultPosts;
// exports.createAccessToken = createAccessToken;
exports.defaultUsers = defaultUsers;