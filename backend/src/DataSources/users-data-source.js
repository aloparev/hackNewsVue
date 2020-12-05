const {DataSource} = require('apollo-datasource');
const {createAccessToken} = require('../token')
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class User{
  constructor(data){
    data.password = this.createPassword(data.password);
    Object.assign(this, data);
  }

  createPassword(password) {
    this.id = crypto.randomBytes(16).toString('hex')
    return password = bcrypt.hashSync(password, 10);
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
    email = email.trim();
    password = password.trim();
      
    if(this.getUserByEmail(email) || password.length < 8){
      return null;
    }
    
    const newUser = new User({name, email, password});
    this.users.push(newUser);

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
