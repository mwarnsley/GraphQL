/*
 * Schema file contains all of the knowledge telling graphql what the apps data looks like
 * What properties each object has
 * Exactly how each property is related to another
 */

// Importing the modules needed for the schema file
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLInt} = graphql;

/*
 * Object instructs graphql what the user object looks like
 * name is a required property
 * fields is a required property as an object with id, firstName, age
 * fields properties are objects with a type property using built in types from GraphQL
 */
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt},
  },
});
