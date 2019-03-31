const express = require('express');
// important to properly case GraphQL as such, graphql or Graphql or any other variation can cause errors referencing the libraries
const expressGraphQL = require('express-graphql');

// create new app
const app = express();

// if any request comes in looking for /GraphQL, we want GraphQL library to handle it
app.use('/graphql', expressGraphQL({
  // setting this to true lets us make queries in Dev server
  // only intended to only be used in a Dev environment
  graphiql: true,
}))

// listen to specific port
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

