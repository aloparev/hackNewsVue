const {rule} = require('graphql-shield');
const {Post} = require('./DataSources/posts-data-source');
const {User} = require('./DataSources/users-data-source');
require('dotenv').config();

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

const defaultUsers = [
    new User({name:'An', email:'an@gmail.com', password:'12345678'}),
    new User({name:'Ilona', email:'ilona@gmail.com', password:'12345678'}),
    new User({name:'Andrej', email:'andrej@gmail.com', password:'12345678'})
  ];

const defaultPosts=[
    new Post({title: "Just", votes:0, author: defaultUsers[0]}),
    new Post({title: "VueJS", votes:0, author: defaultUsers[1]}),
    new Post({title: "Rocks", votes:0, author: defaultUsers[2]}),
    new Post({title: "CountrysRoad", votes:0, author: defaultUsers[1]})
  ];

exports.isAuthenticated = isAuthenticated;
exports.defaultPosts = defaultPosts;
exports.defaultUsers = defaultUsers;