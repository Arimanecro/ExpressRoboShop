require("dotenv").config({ path: "./config/conf.env" });
const path = require("path");
const express = require("express");

const { ApolloServer } = require("apollo-server-express");
const typeDefs = require(process.env.GRAPHQL_SCHEMA_PATH);
const resolvers = require(process.env.GRAPHQL_RESOLVERS_PATH);

const MongoDB = require("./models/MongoDB")();

const Response = require("./models/ResponseBundle");

const shopRouter = require("./routes/index");

const app = express();

const server = new ApolloServer({ typeDefs, resolvers, context: { MongoDB } });

server.applyMiddleware({ app });

app.use([
  express.static(path.join(__dirname, "public")),
  express.json(),
  express.urlencoded({ extended: false })
]);

app.use("/", shopRouter);

app.use(function(req, res, next) {
  if (!req.route) {
    return Response.notFound(res);
  }
  next();
});

app.use("/404", (req, res) => Response.notFound(res));

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server started...`);
});
