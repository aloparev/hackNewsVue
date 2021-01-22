const person = {
  name:  'TestUser',
  id: 1,
  email: 'testmail@gmail.com',
  password: '$2b$10$uwgJ9.Yol59MJXdoNA8X4e/TlfJw5SVTqBZsJET43YcwtBKOHfJV.'
}

const post = {
  id: 2,
  title: "Mocktitle",
  author: person,
  votes: 1
}

const voter = {
  id: 1,
  person: person,
  post: post,
  value: 1
}

const mocks = {
  Int: () => 2,
 Person: () => (person),
 Post: () => (post),
 Voter: () => (voter)
};

module.exports=mocks;