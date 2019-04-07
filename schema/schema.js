//  tells application what the data looks like
//  what properties each object has and how the objects relate to each other
const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// Import to define company before user since we reference it as a relation in the UserType
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      // setting the type to UserType creates an issue of circular references
      // we need user type before it is defined, or we would need company type before it's defined if we switched function order
      // wrap it in an arrow function so that the code doesn't get executed until after the full file has loaded
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data)
      }
    }
  })
});

//  this object tells GraphQL what properties a User object should have
//  GraphQLObjectType takes in two arguments of name and fields
//  name is the type of object's name, and the fields are the properties
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      // resolve function resolves differences between incoming JSON and the actual datatype we're trying to use
      // need to return company from a given user
      // parentValue represents the user we just fetched
      // so parentValue.company would return the company information
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
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
      // args is an object that gets called with any args that were passed to the query, in this case the ID 
      // GraphQL waits for a response from this
      resolve(parentValue, args) {
        // get the ID for the specific user from JSON server
        return axios.get(`http://localhost:3000/users/${args.id}`)
          // Axios adds layer of "data" when making HTTP requests
          // Below line lets us skip that in the response
          .then(res => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      // type of data we will retrun in resolve function
      type: UserType,
      args: {
        // GraphQLNonNull means field is required with proper data type
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      // resolve is where we actually create new data
      resolve(parentValue, { firstName, age }) {
        return axios.post('http://localhost:3000/users', { firstName, age })
          .then(res => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      },
    },
  }
})

//  Take User and Root type, merge them together into GraphQL schema, then hand that back to the middleware
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

