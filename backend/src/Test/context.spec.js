const { createTestClient } = require("apollo-server-testing");
const {gql} = require("apollo-server");
const {PostsDataSource} = require("../DataSources/posts-data-source");
const {UsersDataSource} = require("../DataSources/users-data-source");
const { GraphQLError } = require('graphql');
const Server = require("../server");
const utils = require("../utils");
const token = require("../token");
const jwt = require("jsonwebtoken");
const {context} = require("../context");

let reqMock
let resMock
let usersMemory= new UsersDataSource();
let postsMemory = new PostsDataSource();
usersMemory.users = [...utils.defaultUsers];
postsMemory.posts = [...utils.defaultPosts];

const testContext = () => context({ req: reqMock, res: resMock })
const server = new Server({context: testContext, dataSources: ()=> ({postsDataSrc: postsMemory, usersDataSrc: usersMemory})});
const {mutate } = createTestClient(server);

beforeEach(() => {
  reqMock = { headers: {} }
  resMock = {}
})

describe('mutations', () => {
  
    describe('WRITE', () => {
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
  
       describe('unauthenticated', () => {
        beforeEach(() => {
          reqMock = { headers: {} }
        })
  
        it('throws authorization error', async () => {
          await expect(create_action())
          .resolves
          .toMatchObject({
            errors: [
              new GraphQLError('Not Authorised!')
            ],
            data: {
              write: null
            }
          })
        })
      })
  
      describe('authenticated', () => {
        let user_token = token.createAccessToken(usersMemory.users[0].id, jwt);

        beforeEach(() => {
          reqMock = {
            headers: {
              authorization: `Bearer ${user_token}`
            }
          }
        })
  
        it('returns created post', async () => {
          await expect(create_action()).resolves.toMatchObject({
            errors: undefined,
            data: {
              write: {
                id: expect.any(String),
                title: 'New Post',
                author: {
                  "name":"An"
                }
              }
            }
          })
        })
      })
    });

    describe('UPVOTE', () => {

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
                      id: postsMemory.posts[0].id
                  }
              });
  
       describe('unauthenticated', () => {
        beforeEach(() => {
          reqMock = { headers: {} }
        })
  
        it('throws authorization error', async () => {
          await expect(upvote_action())
          .resolves
          .toMatchObject({
            errors: [
              new GraphQLError('Not Authorised!')
            ],
            data: {
              upvote: null
            }
          })
        })
      })
  
      describe('authenticated', () => {
        let user_token = token.createAccessToken(usersMemory.users[0].id, jwt);

        beforeEach(() => {
          reqMock = {
            headers: {
              authorization: `Bearer ${user_token}`
            }
          }
        })
  
        it('returns upvoted post', async () => {
          await expect(upvote_action()).resolves.toMatchObject({
            errors: undefined,
            data: {
              upvote: {
                id: expect.any(String),
                title: 'Just',
                votes: 1
              }
            }
          })
        })
      })
    })
  })