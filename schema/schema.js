/*
 * Schema file contains all of the knowledge telling graphql what the apps data looks like
 * What properties each object has
 * Exactly how each property is related to another
 */

// Importing the modules needed for the schema file
const graphql = require('graphql');
const axios = require('axios');
const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull} = graphql;

/*
 * Object instructs graphql what the user object looks like
 * name is a required property
 * fields is a required property as an object
 * fields properties are objects with a type property using built in types from GraphQL
 */

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(res => res.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt},
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.data);
      },
    },
  }),
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
        return axios.get(`http://localhost:3000/users/${args.id}`).then(resp => resp.data);
      },
    },
    company: {
      type: CompanyType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`).then(resp => resp.data);
      },
    },
  },
});

/*
 * Setting the mutation type for mutating the data in some fashion
 * Every mutation has a different name
 * GraphQLNonNull states that the user MUST pass this value in or an error will be thrown
 */
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        companyId: {type: GraphQLString},
      },
      resolve(parentValue, {firstName, age}) {
        return axios.post(`http://localhost:3000/users`, {firstName, age}).then(res => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, {id}) {
        return axios.delete(`http://localhost:3000/users/${id}`).then(res => res.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        companyId: {type: GraphQLString},
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args).then(res => res.data);
      },
    },
  },
});

// Creating a new GraphQL Schema setting the query to the RootQuery and exporting
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
