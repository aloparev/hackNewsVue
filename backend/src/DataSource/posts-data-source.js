const { RESTDataSource } = require('apollo-datasource-rest');
const {UserInputError} = require('apollo-server');
const crypto = require('crypto');

class Post {
  constructor (data) {
    this.id = crypto.randomBytes(16).toString('hex')
    this.voters = []
    this.votes = 0
    Object.assign(this, data)
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

  initialize({context}) {
    //console.log('PostsDataSource: ', context)
  }

  async createPost (data) {

    const currUser = await this.context.dataSources.usersDataSrc.getUser(this.context.decodedJwt.id);
    
    if(currUser){
      const newPost = new Post({...data, author:currUser});
      this.posts.push(newPost);
      
      return newPost;
    }

    return null;
  }

  async votePost(id, value) {
    const post = this.posts.find(e => e.id == id);

    if (post) {
      const currUser = await this.context.dataSources.usersDataSrc.getUser(this.context.decodedJwt.id);

      if(currUser) {

        if(!post.voters.find(voter => voter.id == currUser.id)){
         
          post.votes+= value;
          post.voters.push(currUser);

          return post;
        }
        else{
          throw new UserInputError("This user voted on this post already");
        }
      }
    }
    else{
      throw new UserInputError("No post with this ID", {invalidArgs: [id]});
    }
  }

  async downvotePost(id, currUser) {
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
      const deleteIndex = this.posts.indexOf(post);
      this.posts.splice(deleteIndex,1);
     return post;
    }
    else{
      throw new UserInputError("No post with this ID", {invalidArgs: [id]});
    }

  }
} 
module.exports = {Post, PostsDataSource}