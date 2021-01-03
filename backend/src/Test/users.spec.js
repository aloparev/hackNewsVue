const mockedSchema = require('./utils/schemaMock');
describe("queries", () => {
    describe("USERS", () => {
        
        it("given users in the database", async () => {
            const gql_query = `
            query people{
                people {
                    id
                    name
                    email
                }
            }
        `;
        const response = await mockedSchema(gql_query);

        expect(response).toMatchObject({
                data: { people: [
                    {id:"1", name:"TestUser", email:"testmail@gmail.com"},
                    {id:"1", name:"TestUser", email:"testmail@gmail.com"}
                ]}
            })
        })

        it("indefinitely nestable query", async () => {

            const gql_query = `
            query people{
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
            }
            `;
            const response = await mockedSchema(gql_query);

            expect(response).toMatchObject({
               data :{ people:
                [
                    { id:"1", 
                    name:"TestUser", 
                    email:"testmail@gmail.com",
                        posts: [
                            {
                                title: "Mocktitle",
                                author: {
                                    name: "TestUser",
                                }
                            },
                            {
                                title: "Mocktitle",
                                author: {
                                    name: "TestUser",
                                }
                            }
                        ]
                    },
                    { id:"1", 
                    name:"TestUser", 
                    email:"testmail@gmail.com",
                        posts: [
                            {
                                title: "Mocktitle",
                                author: {
                                    name: "TestUser",
                                }
                            },
                            {
                                title: "Mocktitle",
                                author: {
                                    name: "TestUser",
                                }
                            }
                        ]
                    }
               ]}
           })
        });
    });
});

describe("mutations", () => {

    describe("SIGN UP", () => {
        
        it("throws error if user is already registered", async () => {
            const gql_mutation = `
            mutation signup{
                signup(name:"TestUser", email: "testmail@gmail.com", password: "12345678")
            }
        `;
        const response = await mockedSchema(gql_mutation);
        expect(response).toMatchObject({
                    errors: [expect.objectContaining({ message: "Email already exist" })],
                    data: {
                    signup: null,
                    },
                });
            });
        
        it("throws error if the password is too short", async () => {
            const gql_mutation = `
            mutation signup{
                signup(name:"testuser", email: "testuser@gmail.com", password: "123")
            }
        `;
            const response = await mockedSchema(gql_mutation);
              expect(response).toMatchObject({
                  errors: [expect.objectContaining({ message: "Not Authorised!" })],
                  data: {
                  signup: null,
                  },
              });
        })

        it("signs up new user", async () => {
        const gql_mutation = `
        mutation signup{
            signup(name:"testuser", email: "testuser@gmail.com", password: "12345678")
        }
    `;
        const response = await mockedSchema(gql_mutation);
        expect(response).toMatchObject({
                data: {
                    signup: expect.any(String)
                },
                });
        })
    });

    describe("LOGIN", () => {

        it("throws error if credentials are wrong", async () => {
              const gql_mutation = `
            mutation login{
                login(email: "Hello World", password: "Hello World")
            }
        `;
        const response = await mockedSchema(gql_mutation);
        expect(response).toMatchObject({

                  errors: [expect.objectContaining({ message: "Wrong email/password combination" })],
                  data: {
                  login: null,
                  },
              });

        });

        it("validates login if credentials are right", async () => {
            const gql_mutation = `
            mutation login{
                login(email: "testmail@gmail.com", password: "12345678")
            }
        `;
        const response = await mockedSchema(gql_mutation);
        expect(response).toMatchObject({
            data: {
                login: expect.any(String)
            },
            });
        });
    });
})