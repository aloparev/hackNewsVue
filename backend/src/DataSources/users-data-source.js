const {DataSource} = require('apollo-datasource');
const {createAccessToken} = require('../token')
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class User{
  constructor(data){
    this.id = crypto.randomBytes(16).toString('hex')
    data.password = this.createPassword(data.password);
    Object.assign(this, data);
  }

  createPassword(password) {
    return password = bcrypt.hashSync(password, 10);
  }

  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

class UsersDataSource extends DataSource {
  
  constructor() {
    super();
    this.users = []
  }

  initialize({context}) {
    this.context = context;
  }

  async getUser() {
    return this.users.find(user => user.id === this.context.decodedJwt.id);
  }

  getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async signup(name, email, password, jwt) {
    const newUser = new User({name, email, password});
    this.users.push(newUser);

    return createAccessToken(newUser.id, this.context.jwt);
  }

  async login(email, password, jwt) {
    let user = this.getUserByEmail(email);
      return createAccessToken(user.id, this.context.jwt);
  }

  async allUsers() {
    return this.users;
  }
}
module.exports = {User, UsersDataSource}
