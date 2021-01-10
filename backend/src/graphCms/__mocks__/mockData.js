const mocks = {
 Person: () => ({
   name:  'TestUser',
   id: 1,
   email: 'testmail@gmail.com',
   password: '$2b$10$uwgJ9.Yol59MJXdoNA8X4e/TlfJw5SVTqBZsJET43YcwtBKOHfJV.'
 }),
 Post: () => ({
   id: 2,
   title: "Mocktitle",
   votes: 5,
 })
};

module.exports=mocks;