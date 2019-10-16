const Response = require("./ResponseBundle");
const MongoDB = require("mongodb").MongoClient;

module.exports = class Search {
  static async Index(req, res) {
    try {
      let count = 0;
      const Mongo = await new MongoDB(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).connect();
      const db = await Mongo.db(process.env.MONGODB_NAME).collection(
        process.env.MONGODB_COLLECTION_NAME
      );

      const countResult = await db.countDocuments(
        { $text: { $search: `${req.params.word}` } },
        {},
        (error, result) => {
          error && console.log(error);
          return (count = result);
        }
      );

      const p = await db
        .find({ $text: { $search: `${req.params.word}` } })
        .sort({ title: -1 })
        .skip(req.params.page > 0 ? (req.params.page - 1) * 16 : 0)
        .limit(16)
        .toArray(async (err, docs) => {
          Mongo.close();
          let word = req.params.word;
          let countPage = count;
          let length = docs.length;
          let data = docs;
          await Response.staticBundle(res, ["searchView"], {
            word,
            countPage,
            length,
            data
          });
        });
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(`<h1>Server Error</h1>`);
      console.error(e);
    }
  }
};
