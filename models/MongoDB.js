const MongoClient = require("mongodb").MongoClient;

module.exports = async () => {
  return await new MongoClient(process.env.MONGOURI, {
    useNewUrlParser: true
  }).connect();
};
