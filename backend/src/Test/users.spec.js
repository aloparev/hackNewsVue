const { createTestClient } = require("apollo-server-testing");
const {gql} = require("apollo-server");
const {Post, PostsDataSource} = require("../DataSources/posts-data-source");
const {User, UsersDataSource} = require("../DataSources/users-data-source");
const { GraphQLError } = require('graphql');
const Server = require("../server");
const utils = require("../utils");
const jwt = require("jsonwebtoken");

let postsMemory = new PostsDataSource();
let usersMemory = new UsersDataSource();

let decoded
beforeEach(() => {
    decoded = {jwt}
})

const testContext = () => decoded

const server = new Server({context: testContext, dataSources: ()=> ({postsDataSrc: postsMemory, usersDataSrc:usersMemory})});
const {query, mutate } = createTestClient(server);

describe("queries", () => {

    describe("USERS", () => {
        
        const GET_USERS = gql`
                query {
                    users {
                        id
                        name
                        email
                    }
                }
            `;
        
        it("returns empty array", async () => {
            usersMemory.users = []

            await expect(query({query: GET_USERS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { users: [] }
            })
        })

        it("given users in the database", async () => {
            usersMemory.users = [new User({name:"Andrej", email:"andrej@gmail.com", password:"12345678"})]
            
            await expect(query({query: GET_USERS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { users: [{id:expect.any(String), name:"Andrej", email:"andrej@gmail.com"}]}
            })
        })

        it("indefinitely nestable query", async () => {
            usersMemory.users = [...utils.defaultUsers];
            postsMemory.posts = [...utils.defaultPosts];

            const NESTABLE_QUERY_USERS = gql`
                query {
                    users {
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
               data :{ users:
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
                            }
                        ]
                    },
                    {
                        id: expect.any(String),
                        name: "Ilona",
                        email: "ilona@gmail.com",
                        posts: [
                            {
                                title: "VueJS",
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
               ]}
           })
        });
    });
});

describe("mutations", () => {
    beforeEach(() => {
        usersMemory.users = [...utils.defaultUsers];
        postsMemory.posts = [...utils.defaultPosts];
    })

    describe("SIGN UP", () => {
        
        const SIGN_UP = gql`
            mutation ($name: String!, $email: String!, $password: String!){
                signup(name: $name, email: $email, password: $password)
            }
        `;

        const signup_action = () => mutate({
            mutation: SIGN_UP,
            variables: {
                    name: "TestUser",
                    email: "testUser@gmail.com",
                    password: "12345678"
                }
            });
        
        it("checks signup", async () => {
            await expect(signup_action())
            .resolves
            .toMatchObject({
                errors: undefined,
                data: {
                    signup: expect.any(String)
                }
            })
        });
        
        it("returns a JWT", async () => {
            let {data} = await signup_action()
            const {id} = jwt.verify(data.signup, process.env.JWT_SECRET)
            expect(id).toEqual(usersMemory.users[usersMemory.users.length - 1].id)
        })

        it("adds a new User", async () => {
            expect(usersMemory.users).toHaveLength(3);
            await signup_action()
            expect(usersMemory.users).toHaveLength(4);
        });

        it("checks email is not taken by another", async () => {
            await signup_action()
            
            await expect(signup_action())
            .resolves
            .toMatchObject({
                errors: [new GraphQLError("This email already is taken by another user")],
                data: {
                    signup: null
                }
            })
        });

        it("checks passwords with a length of at least 8 characters", async () => {
            
            const signup_action_short_password = () => mutate({
                mutation: SIGN_UP,
                variables: {
                        name: "TestUser",
                        email: "testUser@gmail.com",
                        password: "123456"
                    }
            });

            await expect(signup_action_short_password())
            .resolves
            .toMatchObject({
                errors: [new GraphQLError("Not Authorised!")],
                data: {
                    signup: null
                }
            })
        });

        it("calls signup() ", async () => {
            usersMemory.signup = jest.fn(() => {});
            await signup_action()
            expect(usersMemory.signup).toHaveBeenCalledWith("TestUser","testUser@gmail.com","12345678");
        });
    });

    describe("LOGIN", () => {
        
        const LOGIN = gql`
            mutation ($email: String!, $password: String!){
                login(email: $email, password: $password)
            }
        `;

        const login_action = () => mutate({
            mutation: LOGIN,
            variables: {
                    email: "andrej@gmail.com",
                    password: "12345678"
                }
            });
        
        it("checks login", async () => {

            await expect(login_action())
            .resolves
            .toMatchObject({
                errors: undefined,
                data: {
                    login: expect.any(String)
                }
            })
        });

        it("throws GraphQLError if no user exists with given email address", async () => {

            login_not_exist_user_action = () => mutate({
                mutation: LOGIN,
                variables: {
                        email: "notExistUser@gmail.com",
                        password: "12345678"
                    }
                });

            await expect(login_not_exist_user_action())
            .resolves
            .toMatchObject({
                errors: [new GraphQLError("Not Authorised!")],
                data: {
                    login: null
                }
            });
        });

        it("calls login() ", async () => {
            usersMemory.login = jest.fn(() => {});
            await login_action()
            expect(usersMemory.login).toHaveBeenCalledWith("andrej@gmail.com");
        });
    });
})