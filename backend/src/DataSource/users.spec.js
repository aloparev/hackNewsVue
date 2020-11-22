const { createTestClient } = require("apollo-server-testing");
const {gql} = require("apollo-server");
const {User, UsersDataSource} = require("./users-data-source");
const {Post, PostsDataSource} = require("./posts-data-source");
const Server = require("../server");

let postsMemory = new PostsDataSource();
let usersMemory = new UsersDataSource();
const server = new Server({dataSources: ()=> ({postsDataSrc: postsMemory, usersDataSrc: usersMemory})});

const {query, mutate } = createTestClient(server);

describe("queries", () => {

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