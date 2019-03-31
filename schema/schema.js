//  tells application what the data looks like
//  what properties each object has and how the objects relate to each other
//  below code is reused for every schema file essentially
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
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
})