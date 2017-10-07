/*
 * Schema file contains all of the knowledge telling graphql what the apps data looks like
 * What properties each object has
 * Exactly how each property is related to another
 */

// Importing the modules needed for the schema file
const graphql = require('graphql');
const _ = require('lodash');
const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema} = graphql;

// HARDCODED DATA THAT WE NEED TO DELETE
const users = [{id: '23', firstName: 'Bill', age: 20}, {id: '47', firstName: 'Samantha', age: 21}];

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

/*
 * Root query provides the entry point into our data
 * name is a required property
 * fields is a required property as an object with user
 * user is an object with properties of type and args
 * type used the UserType const
 * args is an object with and id with type of GraphQLString
 * resolve function tries to go into the database and find actual data
 */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args) {
        return _.find(users, {id: args.id});
      },
    },
  },
});

// Creating a new GraphQL Schema setting the query to the RootQuery and exporting
module.exports = new GraphQLSchema({
  query: RootQuery,
});
