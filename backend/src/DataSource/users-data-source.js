const { RESTDataSource } = require('apollo-datasource-rest');

class User{
  constructor(name){
    this.name = name
  }
}

class UsersDataSource extends RESTDataSource {
  
  constructor() {
    super();
    this.users = []
  }

  initialize({context}) {
    //console.log('UsersDataSource: ', context)
  }

  async getUser(name) {
    return this.users.find(user => user.name === name);
  }

  async allUsers() {
    return this.users;
  }
}
module.exports = {User, UsersDataSource}
