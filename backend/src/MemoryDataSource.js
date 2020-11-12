const { RESTDataSource } = require('apollo-datasource-rest');

class InMemoryDataSource extends RESTDataSource {
  
  users = [
    {name: 'An'},
    {name: 'Ilona'},
    {name: 'Andrej'}
  ]

  posts = [
    { id: 0, title: "Just", votes: 0, voters:[], author: {name: 'Ilona'}},
    { id: 1, title: "VueJS", votes: 0, voters:[], author: {name: 'Andrej'}},
    { id: 2, title: "Rocks", votes: 0, voters:[], author: {name: 'An'}},
    { id: 3, title: "CountrysRoad", votes: 0, voters:[], author: {name: 'Ilona'}}
  ]

  constructor () {
    super()
  }

  initialize ({ context }) {}

  async allPosts () {
    return this.posts
  }

  async allUsers () {
    return this.users
  }

  async createPost (data) {

    //create new id
    let newId = Math.max(...this.posts.map(e => e.id), 0) + 1
    
    //create new post
    let newPost = {id : newId, title: data.title, votes: 0, author: data.author}
    
    //add the new post to the posts
    this.posts.push(newPost)

    return newPost
  }
  async upvotePost(id, user) {

    //find post by id
    let post = this.posts.find(e => e.id == id)

    //check the post exists
    if (post) {

      //check: user has already voted or not?
      if(!post.voters.find(u => u.name == user.name)){//if not exist

        //upvote
        post.votes++

        //add voters to the voter list of the post
        post.voters.push(user)
      }

      return post
    }

    return null
  }
}

module.exports = InMemoryDataSource