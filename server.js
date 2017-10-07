// Import in the required modules
const express = require('express');
const expressGraphQL = require('express-graphql');

// Normal variable, not imports
const app = express();
const PORT = process.env.PORT || 3000;

/*
 * Hooking up graphQL to express
 * Passing in the expressGraphQL to the use middleware for express
 * expressGraphQL takes in an object of options for configurations
 * graphiql is set to true allowing for us to make queries against our development server (only for dev environment)
 */
app.use(
  '/graphql',
  expressGraphQL({
    graphiql: true,
  })
);

// Selecting the port for the server to listen and run on
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
