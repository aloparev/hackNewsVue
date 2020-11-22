const { createTestClient } = require("apollo-server-testing");
const {gql} = require("apollo-server");
const {Post, PostsDataSource} = require("./posts-data-source");
const Server = require("../server");

let postsMemory = new PostsDataSource();
const server = new Server({dataSources: ()=> ({postsDataSrc: postsMemory})});
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
            await expect(query({query: GET_POSTS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { posts: [] }
            })
        })

        it("given posts in the database", async () => {
            postsMemory.posts = [new Post({title:"test", author:{name: "Andrej"}})]
            
            await expect(query({query: GET_POSTS}))
            .resolves
            .toMatchObject({
                errors: undefined,
                data: { posts: [{id: expect.anything(String), title:"test", votes:0}]}
            })
        })

        it("indefinitely nestable query", async () => {
            postsMemory.posts =[
                new Post({title: "Just", author: {name: "Ilona"}}),
                new Post({title: "VueJS", author: {name: "Andrej"}}),
                new Post({title: "Rocks", author: {name: "An"}}),
                new Post({title: "CountrysRoad", author: {name: "Ilona"}})
            ];

            const NESTABLE_QUERY_POSTS = gql`
                query {
                    posts {
                        id
                        title
                        author {
                            name
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
                        id: expect.anything(String), 
                        title: "Just",
                        author: {
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
                            ]
                        }
                    },
                    {
                        id: expect.anything(String), 
                        title: "VueJS",
                        author: {
                            name: "Andrej",
                            posts: [
                                {
                                    title: "VueJS",
                                    author: {
                                        name: "Andrej",
                                    }
                                },
                            ]
                        }
                    },
                    {
                        id: expect.anything(String), 
                        title: "Rocks",
                        author: {
                            name: "An",
                            posts: [
                                {
                                    title: "Rocks",
                                    author: {
                                        name: "An",
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: expect.anything(String), 
                        title: "CountrysRoad",
                        author: {
                            name: "Ilona",
                            posts: [
                                {
                                    title: "Just",
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


    describe("WRITE_POST", () => {
        beforeEach(() => {
            postsMemory.posts = [];
        })
        
        const WRITE_POST = gql`
            mutation($post: PostInput!) {
                write(post: $post) {
                    id
                    title
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
                            title:"New Post",
                            author: {name:"An"}
                        },
                    }
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
                    write: {id: expect.anything(String) ,title:"New Post", author: {name:"An"}}
                }
            })
        });

        it('calls createPost() ', async () => {
            postsMemory.createPost = jest.fn(() => {});
            await create_action()
            expect(postsMemory.createPost).toHaveBeenCalledWith({ title:"New Post", author: {name:"An"}});
        });
    });

    describe("ACTION_POST", () => {
        let postId;

        beforeEach(() => {
            postsMemory.posts = [new Post({title:"test", author:{name: "Andrej"}})];
            postId = postsMemory.posts[0].id;
        });

        describe("UPVOTE", () => {

            const UPVOTE_POST = gql`
                mutation($id: ID!, $voter: UserInput!) {
                    upvote(id: $id, voter: $voter) {
                        id
                        title
                        votes
                        voters {
                            name
                        }
                    }
                }
            `;
            
            const upvote_action = () => mutate({
                    mutation: UPVOTE_POST,
                    variables: {
                            id: postId,
                            voter: {name: "Ilona"}
                        }
                    });
            
            it('update votes', async () => {
                expect(postsMemory.posts[0].votes).toEqual(0);
                await upvote_action()
                expect(postsMemory.posts[0].votes).toEqual(1);
            });

            it('responds with upvoted Post', async () => {

                await expect(upvote_action())
                .resolves
                .toMatchObject({
                    errors: undefined,
                    data: {
                        upvote: {id: expect.anything(String) ,title:"test", votes:1, voters: [{name:"Ilona"}]}
                    }
                })
            });

            it('upvote a post only once', async () => {
                expect(postsMemory.posts[0].votes).toEqual(0);
                await upvote_action()
                expect(postsMemory.posts[0].votes).toEqual(1);
                await upvote_action()
                expect(postsMemory.posts[0].votes).toEqual(1);
            });

            it('calls upvotePost() ', async () => {
                postsMemory.upvotePost = jest.fn(() => {});
                await upvote_action()
                expect(postsMemory.upvotePost).toHaveBeenCalledWith(postId, {name: "Ilona"});
            });
        });
    })
})