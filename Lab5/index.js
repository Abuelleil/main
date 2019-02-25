// ===-------------------------------------------------------------------------------------=== //
// =-- EXTERNAL IMPORT
// ===-------------------------------------------------------------------------------------=== //
const express = require('express')
const mongoose = require('mongoose')
// ===-------------------------------------------------------------------------------------=== //

// ===-------------------------------------------------------------------------------------=== //
// =-- INTERNAL IMPORT
// ===-------------------------------------------------------------------------------------=== //
const books = require('./api/routes/books')
const users = require('./api/routes/users')
const votes = require('./api/routes/votes')
// ===-------------------------------------------------------------------------------------=== //

// ===-------------------------------------------------------------------------------------=== //
// =-- MONGOOSE CONNECT TO ATLAS
// ===-------------------------------------------------------------------------------------=== //
const DB_USER = process.env.MONGO_ATLAS_USER
const DB_PASS = process.env.MONGO_ATLAS_PASSWORD
mongoose.connect(
  `mongodb://${DB_USER}:${DB_PASS}@dummycluster-shard-00-00-ynm7o.mongodb.net:27017,dummycluster-shard-00-01-ynm7o.mongodb.net:27017,dummycluster-shard-00-02-ynm7o.mongodb.net:27017/test?ssl=true&replicaSet=DummyCluster-shard-0&authSource=admin&retryWrites=true`,
  { useNewUrlParser: true }
)
// ===-------------------------------------------------------------------------------------=== //

// ===-------------------------------------------------------------------------------------=== //
// =-- APP SETUP
// ===-------------------------------------------------------------------------------------=== //
const app = express()
app.use(express.json()) // use express json to parse the body of the requests
app.use('/api/books', books) // use books.js for routes starting with '/api/books'
app.use('/api/users', users) // use users.js for routes starting with '/api/users'
app.use('/api/votes', votes) // use votes.js for routes starting with '/api/votes'
// ===-------------------------------------------------------------------------------------=== //

// ===-------------------------------------------------------------------------------------=== //
// =-- HOME PAGE ROUTE
// ===-------------------------------------------------------------------------------------=== //
app.get('/', (request, response) => {
  const links = [
    { href: '/api/users', text: 'Users' },
    { href: '/api/books', text: 'Books' },
    { href: '/api/votes', text: 'Votes' }
  ]
  const header = `<h2>Welcome to the Book Store !</h2><br>`
  const data = links.map(link => `<a href=${link.href}>${link.text}</a>`).join('<br>')
  return response.send(`${header} ${data}`)
})
// ===-------------------------------------------------------------------------------------=== //

// ===-------------------------------------------------------------------------------------=== //
// =-- ENTER INFINITE PORT LISTENING LOOP
// ===-------------------------------------------------------------------------------------=== //
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Running server at http://localhost:${PORT}`)
})
// ===-------------------------------------------------------------------------------------=== //
