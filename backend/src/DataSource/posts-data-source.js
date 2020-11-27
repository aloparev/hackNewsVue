const {DataSource} = require('apollo-datasource');
const {UserInputError} = require('apollo-server');
const crypto = require('crypto');

class Post {
  constructor (data) {
    this.id = crypto.randomBytes(16).toString('hex');
    this.voters = [];
    this.votes = 0;
    Object.assign(this, data);
  }
}

class PostsDataSource extends DataSource {
  
  constructor() {
    super();
    this.posts = [];
  }

  async allPosts () {
    return this.posts;
  }

  initialize({context}) {
    this.context = context;
  }

  async createPost (data) {
    const newPost = new Post(data)
    this.posts.push(newPost)
    return newPost
  }

  async votePost(id, currUser, value) {
    const post = this.posts.find(e => e.id == id);
    if (post) {
      if(!post.voters.find(voters => voters.name == currUser.name)){
        post.votes+=value
        post.voters.push(currUser)
        return post
      }
      else{
        throw new UserInputError("This user voted on this post already", {invalidArgs: [currUser]});
      }
    }
    else{
      throw new UserInputError("No post with this ID", {invalidArgs: [id]});
    }
  }

  async deletePost (id) {
    
    const post = this.posts.find(e => e.id == id);

    if (post) {
      const currUser = await this.context.dataSources.usersDataSrc.getUser(this.context.decodedJwt.id);
      
      if(currUser) {

        if( currUser.id == post.author.id) {

          const deleteIndex = this.posts.indexOf(post);
          this.posts.splice(deleteIndex,1);
          
          return post;

        }else {
          throw new Error("Only authors of a post are allowed to delete their own posts.");
        }
      }
    }
    else {
      throw new UserInputError("No post with this ID", {invalidArgs: [id]});
    }

  }
} 
module.exports = {Post, PostsDataSource}