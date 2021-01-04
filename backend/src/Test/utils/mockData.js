const casual = require('casual');
casual.seed(123);
const mocks = {
 Person: () => ({
   name:  'TestUser',
   id: 1,
   email: 'testmail@gmail.com',
   password: '12345678'
 }),
 Post: () => ({
   title: "Mocktitle"
 })
};

module.exports=mocks;