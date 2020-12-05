const { RESTDataSource } = require('apollo-datasource-rest');

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

class UsersDataSource extends RESTDataSource {
  
  constructor() {
    super();
    this.users = []
  }

  initialize({context}) {
    //console.log('UsersDataSource: ', context)
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
