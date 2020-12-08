const {DataSource} = require('apollo-datasource');
const {UserInputError} = require('apollo-server');
const crypto = require('crypto');

class Post {
  constructor (data) {
    this.id = this.assignId();
    this.voters = new Map();
    Object.assign(this, data);
  }

  assignId(){
    return crypto.randomBytes(16).toString('hex');
  }

  getVotes(){
    return [...this.voters.values()].reduce((sum, val) => sum+=val, 0);
  }
}

class PostsDataSource extends DataSource {
  
  constructor() {
    super();
    this.posts = [];
  }

  initialize({context}) {
    this.context = context;
  }

  currUser() {
    return this.context.currUser;
  }

  async allPosts () {
    return this.posts;
  }

  async getPost(id){
    return this.posts.find(e => e.id === id);
  }

  async createPost (data) {
      const newPost = new Post({...data, author: this.currUser()});
      this.posts.push(newPost);
      
      return newPost;
  }

  async votePost(id, value) {
    const post = this.posts.find(e => e.id === id);
        post.voters.set(this.currUser().id, value);
        return post;
  }

  async deletePost(id) { 
    const post = this.posts.find(e => e.id === id);
        const deleteIndex = this.posts.indexOf(post);
        this.posts.splice(deleteIndex,1);
        return post;
  }
} 
module.exports = {Post, PostsDataSource}