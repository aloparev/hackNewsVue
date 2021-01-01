const { createTestClient } = require("apollo-server-testing");
const {gql} = require("apollo-server");
const { PostsDataSource} = require("../DataSources/posts-data-source");
const { UsersDataSource} = require("../DataSources/users-data-source");
const Server = require ("../server");
const jwt = require("jsonwebtoken");

let postsMemory = new PostsDataSource();
let usersMemory = new UsersDataSource();

let decoded
beforeEach(() => {
    decoded = {jwt}
})

const testContext = () => decoded
const configs = {context: testContext, dataSources: ()=> ({postsDataSrc: postsMemory, usersDataSrc:usersMemory})};
const server =  Server( configs );


describe("queries", () => {

    describe("USERS", () => {
        
        const GET_USERS = gql`
                query {
                    people {
                        id
                        name
                        email
                    }
                }
            `;
        const action = (query) => {
            return query({ query: GET_USERS });
          };
      
          beforeEach(() => {
            postsMemory.reset();
            usersMemory.reset();
          });
        

        it("given users in the database", async () => {

            const { query } = createTestClient(await server);
            const response = action(query);

            await expect(response)
            .resolves
            .toMatchObject({

                

                errors: undefined,
                data: { people: [
                    {id:expect.any(String), name:"An", email:"an@gmail.com"},
                    {id:expect.any(String), name:"Ilona", email:"ilona@gmail.com"},
                    {id:expect.any(String), name:"Andrej", email:"andrej@gmail.com"},
                    {id:expect.any(String), name:"Nguyen An", email:"test2@gmail.com"},
                    {id:expect.any(String), name:"Nguyen An", email:"test3@gmail.com"},
                    {id:expect.any(String), name:"Nguyen An", email:"test4@gmail.com"},
                    {id:expect.any(String), name:"bob", email:"bob@gmail.com"},
                    {id:expect.any(String), name:"TestUser", email:"testUser@gmail.com"},
                ]}
            })
        })

        it("indefinitely nestable query", async () => {

            const { query } = createTestClient(await server);

            const NESTABLE_QUERY_USERS = gql`
                query {
                    people {
                        id
                        name
                        email
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
               data :{ people:
                [
                    {
                        id: expect.any(String),
                        name: "An",
                        email: "an@gmail.com",
                        posts: [
                            {
                                title: "Just",
                                author: {
                                    name: "An",
                                }
                            },
                            {
                                title: "Test_23",
                                author: {
                                    name: "An",
                                }
                            },
                            {
                                title: "bla",
                                author: {
                                    name: "An",
                                }
                            },
                            {
                                title: "bla",
                                author: {
                                    name: "An",
                                }
                            },
                            {
                                title: "bla",
                                author: {
                                    name: "An",
                                }
                            },
                            {
                                title: "bla",
                                author: {
                                    name: "An",
                                }
                            },
                            {
                                title: "bla",
                                author: {
                                    name: "An",
                                }
                            }
                        ]
                    },
                    {
                        id: expect.any(String),
                        name: "Ilona",
                        email: "ilona@gmail.com",
                        posts: [
                            {
                                title: "VueJs",
                                author: {
                                    name: "Ilona"
                                }
                            },
                            {
                                title: "ContryRoads",
                                author: {
                                    name: "Ilona"
                                }
                            },
                        ],
                    },
                    {
                        id: expect.any(String),
                        name: "Andrej",
                        email: "andrej@gmail.com",
                        posts: [
                            {
                                title: "Rocks",
                                author: {
                                    name: "Andrej",
                                }
                            },
                        ],
                    },
                    {
                        id: expect.any(String),
                        name: "Nguyen An",
                        email: "test2@gmail.com",
                        posts: [],
                    },
                    {
                        id: expect.any(String),
                        name: "Nguyen An",
                        email: "test3@gmail.com",
                        posts: [],
                    },
                    {
                        id: expect.any(String),
                        name: "Nguyen An",
                        email: "test4@gmail.com",
                        posts: [],
                    },
                    {
                        id: expect.any(String),
                        name: "bob",
                        email: "bob@gmail.com",
                        posts: [
                            {
                                title: "bla",
                                author: {
                                    name: "bob",
                                }
                            },
                            {
                                title: "bla",
                                author: {
                                    name: "bob",
                                }
                            }
                        ],
                    },
                    {
                        id: expect.any(String),
                        name: "TestUser",
                        email: "testUser@gmail.com",
                        posts: [
                            
                        ],
                    },
               ]}
           })
        });
    });
});

describe("mutations", () => {
    beforeEach(() => {
        postsMemory.reset();
        usersMemory.reset();
        
    })
    describe("SIGN UP", () => {
        
        const SIGN_UP = gql`
            mutation ($name: String!, $email: String!, $password: String!){
                signup(name: $name, email: $email, password: $password)
            }
        `;

        const signup_action = (name, email, password, mutate) => {
            return mutate({
            mutation: SIGN_UP,
            variables: {
                    name,
                    email,
                    password
                }
            })
            };
        it("throws error if user is already registered", async () => {
            const { mutate } = createTestClient(await server);
            const response = signup_action(
                "TestUser",
                "testUser@gmail.com",
                "12345678",
                mutate
              );
            await expect(response)
            .resolves.toMatchObject({
                errors: [expect.objectContaining({ message: "Email already exist" })],
                data: {
                signup: null,
                },
            });
            });
        
        it("throws error if the password is too short", async () => {
            const { mutate } = createTestClient(await server);
            const response = signup_action(
                "TestUser2",
                "testUser2@gmail.com",
                "123",
                mutate
              );
              await expect(response)
              .resolves.toMatchObject({
                  errors: [expect.objectContaining({ message: "Not Authorised!" })],
                  data: {
                  signup: null,
                  },
              });
        })
    });

    describe("LOGIN", () => {
        
        const LOGIN = gql`
            mutation ($email: String!, $password: String!){
                login(email: $email, password: $password)
            }
        `;

        const login_action = ( email, password, mutate) => {
            return mutate({
            mutation: LOGIN,
            variables: {
                    email,
                    password
                }
            })
            };

        it("throws error if credentials are wrong", async () => {
            const { mutate } = createTestClient(await server);
            const response = login_action(
                "notexisting@gmail.com",
                "12345678",
                mutate
              );
              await expect(response)
              .resolves.toMatchObject({
                  errors: [expect.objectContaining({ message: "Wrong email/password combination" })],
                  data: {
                  login: null,
                  },
              });

        });

        it("validates login if credentials are right", async () => {

            const { mutate } = createTestClient(await server);
            const response = await login_action(
                "bob@gmail.com",
                "1pass1234",
                mutate
              );

            expect(response).toMatchObject({
            data: {
                login: expect.any(String)
            },
            });
        });
    });
})