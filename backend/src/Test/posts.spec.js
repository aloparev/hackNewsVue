const { createTestClient } = require("apollo-server-testing");
const {ApolloServer,gql} = require("apollo-server");
const { GraphQLError } = require('graphql');
const Server = require("../server");
const context =require( '../context');

let query;
let mutate;
let server;
let contextMock;


jest.mock('../graphCms/schema');
jest.mock('../graphCms/executor');
jest.mock('../rootSchema');


beforeEach(async() => {
    contextMock = {};
    server = await Server(ApolloServer, { context: () => contextMock });
    const testClient = createTestClient(server);
    ({ query,mutate } = testClient);
  });


describe("queries", () => {

    describe("POSTS", () => {
        const GET_POSTS = gql`
                query {
                    posts {
                        id
                        title
                        votes
                    }
                }
            `;

        it("given posts in the database", async () => {
            await expect(query({query: GET_POSTS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { posts: [{
                    id: expect.any(String), title:"Mocktitle", votes:expect.any(Number)},
                    {id: expect.any(String), title:"Mocktitle", votes:expect.any(Number)},
            ]}
            })
        })

        it("indefinitely nestable query", async () => {

            const NESTABLE_QUERY_POSTS = gql`
                query {
                    posts {
                        id
                        title
                        author {
                            name
                            email
                            posts {
                                title
                                author {
                                    name
                                }
                            }
                        }
                    }
                }`;

            await expect(query({query: NESTABLE_QUERY_POSTS}))
           .resolves
           .toMatchObject({
               errors: undefined,
               data :{posts:[
                    {
                        id: expect.any(String),
                        title: "Mocktitle",
                        author: {
                            name: "TestUser",
                            email: "testmail@gmail.com",
                            posts: [
                                {
                                    title: "Mocktitle",
                                    author: {
                                        name: "TestUser"
                                    }
                                },
                                {
                                    title: "Mocktitle",
                                    author: {
                                        name: "TestUser"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: expect.any(String),
                        title: "Mocktitle",
                        author: {
                            name: "TestUser",
                            email: "testmail@gmail.com",
                            posts: [
                                {
                                    title: "Mocktitle",
                                    author: {
                                        name: "TestUser"
                                    }
                                },
                                {
                                    title: "Mocktitle",
                                    author: {
                                        name: "TestUser"
                                    }
                                }
                            ]
                        }
                    }
               ]}
           })
        });
    });
});

describe("mutations", () => {

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

    describe("WRITE_POST", () => {


        beforeEach(async() => {
            const response = await signup_action(
                "Notexisting",
                "notexisting@gmail.com",
                "12345678",
                mutate
                );

        const obj = {
            req: {
            headers: { authorization: response.data.signup},
            },
        };
        server.context  = context(obj);
        });

        
        const WRITE_POST = gql`
            mutation($post: PostInput!) {
                write(post: $post) {
                    id
                    title
                    votes
                    author {
                        name
                     }
                }
            }
        `;

        const create_action = () => mutate({
                mutation: WRITE_POST,
                variables: {
                        post :{
                            title:"New Post"
                        },
                    }
                });

        it('checks authenticated user', async () => {

            server.context = {}//not login yet

            await expect(create_action())
            .resolves
            .toMatchObject({
                errors: [new GraphQLError("Not Authorised!")],
                data: {
                    write: null
                }
            })
        });

        it('adds a post', async () => {

            await expect(create_action())
                  .resolves
                  .toMatchObject({
                    errors: undefined,
                    data: {write: {
                      author: 
                        { name: 'TestUser' },
                        id: "2",
                        title: "Mocktitle",
                        votes: 4}
                    },
                  });
        });

        it('responds with created Post', async () => {
            await expect(create_action())
            .resolves
            .toMatchObject({
                errors: undefined,
                data: {
                    write: {id: expect.any(String) ,title:"Mocktitle", votes:4, author: { name:"TestUser" }}
                }
            })
        });
    });


    describe("ACTION_POST", () => {

        beforeEach(async() => {
            const response = await signup_action(
                "Notexisting",
                "notexisting@gmail.com",
                "12345678",
                mutate
                );

        const obj = {
            req: {
            headers: { authorization: response.data.signup},
            },
        };
        server.context  = context(obj);
        });


        describe("UPVOTE", () => {

            const UPVOTE_POST = gql`
                mutation($id: ID!) {
                    upvote(id: $id) {
                        id
                        title
                        votes
                    }
                }
            `;

            const upvote_action = () => mutate({
                    mutation: UPVOTE_POST,
                    variables: {
                            id: 2
                        }
                    });

            it('checks authenticated user', async () => {

                server.context = {}//not login yet

                await expect(upvote_action())
                .resolves
                .toMatchObject({
                    errors: [new GraphQLError("Not Authorised!")],
                    data: {
                        upvote: null
                    }
                })
            });


            it('upvote a post only once', async () => {
                await expect(upvote_action())
                .resolves.toMatchObject({
                    errors: [expect.objectContaining({ message: "This user voted on that post already." })],
                    data: {
                        upvote: null,
                    },
                });
            });
        });
    })
})