const {DataSource} = require('apollo-datasource');
const {createAccessToken} = require('../token')
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class User{
  constructor(data){
    this.id = crypto.randomBytes(16).toString('hex')
    data.password = bcrypt.hashSync(data.password, 10);
    Object.assign(this, data);
  }
}

class UsersDataSource extends DataSource {
  
  constructor() {
    super();
    this.users = []
  }

  async getUser(id) {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async signup(name, email, password, jwt) {
    //trim
    email = email.trim();
    password = password.trim();
      
    /*
      Validate:
      - Make sure the email address is not taken by another user.
      - Accept only passwords with a length of at least 8 characters.
    */
    if(this.getUserByEmail(email) || password.length < 8){
      return null;
    }
    
    const newUser = new User({name, email, password});
    this.users.push(newUser);
    console.log(this.users);

    return createAccessToken(newUser.id, jwt);
  }

  async login(email, password, jwt) {
    let user = this.getUserByEmail(email);
    console.log(user);
    
    if(user && bcrypt.compareSync(password, user.password)){
      return createAccessToken(user.id, jwt);
    }

    return null;
  }

  async allUsers() {
    return this.users;
  }
}
module.exports = {User, UsersDataSource}
