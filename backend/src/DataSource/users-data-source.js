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

  async login(email, password) {
    let user = this.getUserByEmail(email);
    
    if(user && bcrypt.compareSync(password, user.password)){
      return createAccessToken(user.id);
    }

    return null;
  }

  async allUsers() {
    return this.users;
  }
}
module.exports = {User, UsersDataSource}
