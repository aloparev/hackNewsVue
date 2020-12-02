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

  getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async signup(name, email, password) {
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

    return createAccessToken(newUser.id);
  }

  async login(email, password) {
    let user = this.getUserByEmail(email);
    console.log(user);
    
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
