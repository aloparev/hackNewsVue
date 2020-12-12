const { Post } = require('./DataSources/posts-data-source')
const { User } = require('./DataSources/users-data-source')

const defaultUsers = [
  new User({ name: 'An', email: 'an@gmail.com', password: '12345678' }),
  new User({ name: 'Ilona', email: 'ilona@gmail.com', password: '12345678' }),
  new User({ name: 'Andrej', email: 'andrej@gmail.com', password: '12345678' })
]

const defaultPosts = [
  new Post({ title: 'Just', author: defaultUsers[0] }),
  new Post({ title: 'VueJS', author: defaultUsers[1] }),
  new Post({ title: 'Rocks', author: defaultUsers[2] }),
  new Post({ title: 'CountrysRoad', author: defaultUsers[1] })
]

exports.defaultPosts = defaultPosts
exports.defaultUsers = defaultUsers
