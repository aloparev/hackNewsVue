const mocks = {
 Person: () => ({
   name:  'TestUser',
   id: 1,
   email: 'testmail@gmail.com',
   password: '12345678'
 }),
 Post: () => ({
   id: 2,
   title: "Mocktitle",
   votes: 5,
 })
};

module.exports=mocks;