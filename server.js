const restify = require('restify')
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')

const mockDatabase = {
  a: { id: 'a', name: 'alice' },
  b: { id: 'b', name: 'bob' }
}

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString }
  }
})
const usersType = new graphql.GraphQLList(userType)

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: (_, { id }) => mockDatabase[id]
    },
    users: {
      type: usersType,
      resolve: () => Object.values(mockDatabase)
    }
  }
})

const schema = new graphql.GraphQLSchema({ query: queryType })

const app = restify.createServer()
app.post(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: false
  })
)
app.get(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
