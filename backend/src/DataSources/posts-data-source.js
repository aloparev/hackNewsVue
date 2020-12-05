const { RESTDataSource } = require('apollo-datasource-rest');
const {UserInputError} = require('apollo-server');
const crypto = require('crypto');

class Post {
  constructor (data) {
    this.id = this.assignId();
    this.voters = [];
    Object.assign(this, data);
  }

  assignId(){
    return crypto.randomBytes(16).toString('hex');
  }
}

class PostsDataSource extends RESTDataSource {
  
  constructor() {
    super();
    this.posts = []
  }

  async allPosts () {
    return this.posts
  }

  async createPost (data, currUser) {
      const newPost = new Post({...data, author:currUser, votes:0});
      this.posts.push(newPost);
      return newPost;
  }

  async votePost(id, value, currUser) {
    const post = this.posts.find(e => e.id == id);

    if (post) {

        if(!post.voters.find(voter => voter.id == currUser.id)){
         
          post.votes+= value;
          post.voters.push(currUser);

          return post;
        }
        else{
          return post;
        }
    }
    else{
      throw new UserInputError("No post with this ID", {invalidArgs: [id]});
    }
  }

  async deletePost (id, currUser) {
    
    const post = this.posts.find(e => e.id == id);
    if (post) {  
      if(!post.voters.find(voters => voters.name == currUser.name)){
        post.votes--
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
    else{
      throw new UserInputError("No post with this ID", {invalidArgs: [id]});
    }

  }
} 
module.exports = {Post, PostsDataSource}