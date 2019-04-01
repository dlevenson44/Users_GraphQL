//  tells application what the data looks like
//  what properties each object has and how the objects relate to each other
const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
} = graphql;


//  this object tells GraphQL what properties a User object should have
//  GraphQLObjectType takes in two arguments of name and fields
//  name is the type of object's name, and the fields are the properties
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  }
});

//  RootQuery lets GraphQL jump and land on a specific node in our data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // pass me the ID, and I will return the UserType for that ID
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      // resolve function searches for user with provided ID
      // parentValue
      // args is an object that gets called with any args that were passed to the query, in this case the ID 
      // GraphQL waits for a response from this
      resolve(parentValue, args) {
        // get the ID for the specific user from JSON server
        return axios.get(`http://localhost:3000/users/${args.id}`)
          // Axios adds layer of "data" when making HTTP requests
          // Below line lets us skip that in the response
          .then(res => res.data);
      }
    }
  }
})

//  Take User and Root type, merge them together into GraphQL schema, then hand that back to the middleware
module.exports = new GraphQLSchema({
  query: RootQuery,
});

