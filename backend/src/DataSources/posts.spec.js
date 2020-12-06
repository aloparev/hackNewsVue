const { createTestClient } = require("apollo-server-testing");
const {gql} = require("apollo-server");
const {Post, PostsDataSource} = require("./posts-data-source");
const {User, UsersDataSource} = require("./users-data-source");
const { GraphQLError } = require('graphql');
const Server = require("../server");
const utils = require("../utils");

let usersMemory
let postsMemory
// let postsMemory = new PostsDataSource();
let decoded
let secondUser
let thirdPost
beforeEach(() => {
    decoded = {}
    usersMemory = new UsersDataSource();
    usersMemory.users = [...utils.defaultUsers];
    secondUser = usersMemory.users[1];

    postsMemory = new PostsDataSource();
    postsMemory.posts = [...utils.defaultPosts];
    thirdPost = postsMemory.posts[2];

})

const testContext = () => decoded
const server = new Server({context: testContext, dataSources: ()=> ({postsDataSrc: postsMemory, usersDataSrc: usersMemory})});
const {query, mutate } = createTestClient(server);

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

        it("returns empty array", async () => {
            postsMemory.posts = []
            await expect(query({query: GET_POSTS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { posts: [] }
            })
        })

        it("given posts in the database", async () => {
            postsMemory.posts = [new Post({title: "Rocks", votes:0, author:new User({name:'Andrej', email:'andrej@gmail.com', password:'12345678'})})];

            await expect(query({query: GET_POSTS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { posts: [{id: expect.any(String), title:"Rocks", votes:0}]}
            })
        })

        it("indefinitely nestable query", async () => {

            postsMemory.posts = [...utils.defaultPosts];

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
                        title: "Just",
                        author: {
                            name: "An",
                            email: "an@gmail.com",
                            posts: [
                                {
                                    title: "Just",
                                    author: {
                                        name: "An"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: expect.any(String),
                        title: "VueJS",
                        author: {
                            name: "Ilona",
                            email: "ilona@gmail.com",
                            posts: [
                                {
                                    title: "VueJS",
                                    author: {
                                        name: "Ilona",
                                    }
                                },
                                {
                                    title: "CountrysRoad",
                                    author: {
                                        name: "Ilona"
                                    }
                                },
                            ]
                        }
                    },
                    {
                        id: expect.any(String),
                        title: "Rocks",
                        author: {
                            name: "Andrej",
                            email: "andrej@gmail.com",
                            posts: [
                                {
                                    title: "Rocks",
                                    author: {
                                        name: "Andrej",
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: expect.any(String),
                        title: "CountrysRoad",
                        author: {
                            name: "Ilona",
                            email: "ilona@gmail.com",
                            posts: [
                                {
                                    title: "VueJS",
                                    author: {
                                        name: "Ilona",
                                    }
                                },
                                {
                                    title: "CountrysRoad",
                                    author: {
                                        name: "Ilona",
                                    }
                                },
                            ]
                        }
                    },
               ]}
           })
        });
    });
});

describe("mutations", () => {
    beforeEach(() => {
        server.context = () => ({decodedJwt: { id: secondUser.id}})
    })

    describe("WRITE_POST", () => {
        beforeEach(() => {
            postsMemory.posts = [];
        })

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
            expect(postsMemory.posts).toHaveLength(0);
            await create_action()
            expect(postsMemory.posts).toHaveLength(1);
        });

        it('responds with created Post', async () => {
            await expect(create_action())
            .resolves
            .toMatchObject({
                errors: undefined,
                data: {
                    write: {id: expect.any(String) ,title:"New Post", votes:0, author: { name:"Ilona" }}
                }
            })
        });

        it('calls createPost() ', async () => {
            postsMemory.createPost = jest.fn(() => {});
            await create_action()
            expect(postsMemory.createPost).toHaveBeenCalledWith({title:"New Post"});
        });
    });


    describe("ACTION_POST", () => {
        // console.log(thirdPost)
        // let postId = thirdPost.id;
        let postId

        beforeEach(() => {
            postsMemory.posts = [
                new Post({title: "Rocks", votes:0, author:
                    new User({name:'Andrej', email:'andrej@gmail.com', password:'12345678'})})
            ];
            postId = postsMemory.posts[0].id;
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
                            id: postId
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

            it('update votes', async () => {
                expect(postsMemory.posts[0].getVotes()).toEqual(0);
                await upvote_action()
                expect(postsMemory.posts[0].getVotes()).toEqual(1);
            });

            it('responds with upvoted Post', async () => {

                await expect(upvote_action())
                .resolves
                .toMatchObject({
                    errors: undefined,
                    data: {
                        upvote: {id: expect.any(String) ,title:"Rocks", votes:1}
                    }
                })
            });

            it('upvote a post only once', async () => {
                expect(postsMemory.posts[0].getVotes()).toEqual(0);
                await upvote_action()
                expect(postsMemory.posts[0].getVotes()).toEqual(1);
                await upvote_action()
                expect(postsMemory.posts[0].getVotes()).toEqual(1);
            });

            it('calls upvotePost() ', async () => {
                postsMemory.votePost = jest.fn(() => {});
                await upvote_action()
                expect(postsMemory.votePost).toHaveBeenCalledWith(postId, 1);
            });
        });
    })
})