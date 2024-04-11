// Required modules and utilities are imported.
const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

const { MongoClient, ServerApiVersion } = require('mongodb');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
// Set up the port for the server to listen on
const PORT = process.env.PORT || 3001;
// Initialize the ApolloServer with type definitions and resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
// Create an Express application.
const app = express();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Asynchronously starts the Apollo server and configures middleware.
const startServer = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    await server.start();
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware,
    }));
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));

      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

// Start the server
startServer();