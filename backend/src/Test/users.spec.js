const { createTestClient } = require("apollo-server-testing");
const {gql} = require("apollo-server");
const Server = require ("../server");
const {GraphCmsSchema} = require("../graphCms/schema")
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('../config')

jest.mock(GraphCmsSchema);

let query;
let mutate;
let contextMock;

const jwtSign = (payload) => jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
contextMock = {jwtSign}

beforeEach(async () => {
    const server = await Server({ context: () => contextMock });
    const testClient = createTestClient(server);
    ({ query , mutate } = testClient);
});

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
        
        it("given users in the database", async () => {

            await expect(query({ query: GET_USERS }))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { people: [
                    {id:expect.any(String), name:"An", email:"an@gmail.com"},
                    {id:expect.any(String), name:"Ilona", email:"ilona@gmail.com"},
                    {id:expect.any(String), name:"Andrej", email:"andrej@gmail.com"},
                    {id:expect.any(String), name:"Bob", email:"bob@gmail.com"},
                    {id:expect.any(String), name:"TestUser", email:"testUser@gmail.com"},
                ]}
            })
        })

        it("indefinitely nestable query", async () => {

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
                                title: "CountryRoads",
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
                        name: "Bob",
                        email: "bob@gmail.com",
                        posts: [
                        ],
                    },
                    {
                        id: expect.any(String),
                        name: "TestUser",
                        email: "testUser@gmail.com",
                        posts: [
                        ],
                    }
               ]}
           })
        });
    });
});

describe("mutations", () => {

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
                });
            };
        it("throws error if user is already registered", async () => {
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

        it("signs up new user", async () => {
            const response = await signup_action(
                "NewUser",
                "newuser@gmail.com",
                "12345678",
                mutate
              );
            expect(response).toMatchObject({
                data: {
                    signup: expect.any(String)
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

            const response = await login_action(
                "an@gmail.com",
                "12345678",
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