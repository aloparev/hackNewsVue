const { RESTDataSource } = require('apollo-datasource-rest');
const {UserInputError} = require('apollo-server');
class PostsDataSource extends RESTDataSource {
  
  constructor() {
    super();
    this.posts = [
      { id: 0, title: "Just", votes: 0, voters:[], author: {name: 'Ilona'}},
      { id: 12, title: "VueJS", votes: 0, voters:[], author: {name: 'Andrej'}},
      { id: 2, title: "Rocks", votes: 0, voters:[], author: {name: 'An'}},
      { id: 39, title: "CountrysRoad", votes: 0, voters:[], author: {name: 'Ilona'}}
    ]
}

  async allPosts () {
    return this.posts
  }

  async createPost (data) {
    const newId = Math.max(...this.posts.map(e => e.id), 0) + 1
    const newPost = {id : newId, title: data.title, votes: 0, author: data.author, voters:[]}
    this.posts.push(newPost)
    return newPost
  }

  async upvotePost(id, currUser) {
    const post = this.posts.find(e => e.id == id);
    if (post) {
      if(!post.voters.find(voters => voters.name == currUser.name)){
        post.votes++
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
    const deleteIndex = this.posts.indexOf(post);
    if (post) {
      this.posts.splice(deleteIndex,1);
     return post;
    }
    else{
      throw new UserInputError("No post with this ID", {invalidArgs: [id]});
    }

  }
} 
module.exports = PostsDataSource