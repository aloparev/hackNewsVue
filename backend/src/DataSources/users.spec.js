const { createTestClient } = require("apollo-server-testing");
const {gql} = require("apollo-server");
const {ApolloServer, makeExecutableSchema} = require('apollo-server');
const {User, UsersDataSource} = require("./users-data-source");
const {Post, PostsDataSource} = require("./posts-data-source");
const {applyMiddleware} = require('graphql-middleware');
const server = require("../server");
const bcrypt = require('bcrypt');

let postsMemory = new PostsDataSource();
let usersMemory = new UsersDataSource();
const typeDefs = require('../schema');
const resolvers = require('../resolver');

const s = new server();

const testContext = (testToken) => {
    let token = testToken || ''
    token = token.replace('Bearer ', '')
    try {
      const decodedJwt = jwt.verify(
        token,
        process.env.JWTSECRET
      )
      return { decodedJwt }
    } catch (e) {
      return {}
    }
  }

  const schema = applyMiddleware(makeExecutableSchema({typeDefs, resolvers}));
  const setupServer = (ps, us, testToken) => {
    const server = new ApolloServer({
    schema,
      context: testContext(testToken), // not sure if this is the correct way. but we didn`t find another solution to add the token as request (see https://github.com/apollographql/apollo-server/issues/2277)
      dataSources: () => ({
        posts: new PostsDataSource(ps, us)
      })
    })
    return createTestClient(server)
  }

describe("queries", () => {
    const postData = [
        { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
      ]
      const userData = [
        new User({name:'An', email:'an@gmail.com', password:'12345678'}),
        new User({name:'Ilona', email:'ilona@gmail.com', password:'12345678'}),
        new User({name:'Andrej', email:'andrej@gmail.com', password:'12345678'})        
    ]
      postData[0].author = userData[0];
    
    
      const { query } = setupServer(postData, userData);


    describe("USERS", () => {
        const GET_USERS = gql`
                query {
                    users {
                        name
                    }
                }
            `;
        
        it("returns empty array", async () => {
            await expect(query({query: GET_USERS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { users: [] }
            })
        })

        it("given users in the database", async () => {
            usersMemory.users = [new User("Andrej")]
            
            await expect(query({query: GET_USERS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { users: [{name:"Andrej"}]}
            })
        })

        it("indefinitely nestable query", async () => {
            usersMemory.users =[
                new User('An'),
                new User('Ilona'),
                new User('Andrej')
            ];
            
            postsMemory.posts =[
                new Post({title: "Just", author: {name: 'Ilona'}}),
                new Post({title: "VueJS", author: {name: 'Andrej'}}),
                new Post({title: "Rocks", author: {name: 'An'}}),
                new Post({title: "CountrysRoad", author: {name: 'Ilona'}})
            ];

            const NESTABLE_QUERY_USERS = gql`
                query {
                    users {
                        name
                        posts {
                            title
                            author {
                                name
                            }
                        }
                    }
                }`;
            
            await expect(query({query: NESTABLE_QUERY_USERS}))
           .resolves
           .toMatchObject({
               errors: undefined,
               data :{ users:
                [
                    {
                        name: "An",
                        posts: [
                            {
                                title: "Rocks",
                                author: {
                                    name: "An",
                                }
                            }
                        ]
                    },
                    {
                        name: "Ilona",
                        posts: [
                            {
                                title: "Just",
                                author: {
                                    name: "Ilona"
                                }
                            },
                            {
                                title: "CountrysRoad",
                                author: {
                                    name: "Ilona"
                                }
                            },
                        ],
                    },
                    {
                        name: "Andrej",
                        posts: [
                            {
                                title: "VueJS",
                                author: {
                                    name: "Andrej",
                                }
                            },
                        ],
                    },
               ]}
           })
        });
    });
});