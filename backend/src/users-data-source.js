const { RESTDataSource } = require('apollo-datasource-rest');

class UserDataSource extends RESTDataSource {
  
  constructor() {
    super();
    this.users = [
      {name: 'An'},
      {name: 'Ilona'},
      {name: 'Andrej'}
    ]
}
async getUser(name) {
  return this.users.find(user => user.name === name);
}

async allUsers() {
  return this.users;
}
}
module.exports = UserDataSource
