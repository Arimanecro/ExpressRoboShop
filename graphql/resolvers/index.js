const ObjectId = require("mongodb").ObjectId;

function MongoDBres(cnx, query, collection = null) {
  const collectioName = collection || process.env.MONGODB_COLLECTION_NAME;
  return cnx
    .then(mongo => mongo.db(process.env.MONGODB_NAME).collection(collectioName))
    .then(data => eval(`data.${query}`).toArray())
    .catch(e => console.error(e));
}

function MongoDBmutation(cnx, query) {
  return cnx
    .then(mongo => mongo.db(process.env.MONGODB_NAME).collection("orders"))
    .then(data => eval(`data.${query}`))
    .catch(e => console.error(e));
}

module.exports = {
  Query: {
    home(parent, args, ctx) {
      let query =
        "find({}).project({_id:0, id:1, url:1, title:1, img_small:1, img_medium:1, price:1}).limit(30)";
      return MongoDBres(ctx.MongoDB, query);
    },
    category(parent, args, ctx) {
      let query = `find({category:'${args.cat}'}).project({_id:0, id:1, url:1, title:1, img_small:1, img_medium:1, price:1, category:1}).sort( { title: -1 } ).limit(16)`;
      return MongoDBres(ctx.MongoDB, query);
    },
    categoryPagination(parent, args, ctx) {
      let query = `find({category:'${args.cat}'}).project({_id:0, id:1, url:1, title:1, img_small:1, img_medium:1, price:1, category:1}).sort( { title: -1 } ).skip( ${args.page} > 0 ? ( ( ${args.page} - 1 ) * 16 ) : 0 ).limit(16)`;
      return MongoDBres(ctx.MongoDB, query);
    },
    item(parent, args, ctx) {
      let query = `find({url:'${args.title}'}).project({_id:0, id:1, url:1, title:1, img_small:1, img_original:1, img_medium:1, price:1, category:1, description:1}).limit(1)`;
      return MongoDBres(ctx.MongoDB, query);
    },
    showOrders(parent, args, ctx) {
      let query =
        "find({}).sort({name:1}).project({_id:1, name:1, address:1, email:1, items:1, total:1})";
      return MongoDBres(ctx.MongoDB, query, "orders");
    }
  },
  Mutation: {
    deleteOrder(parent, args, ctx) {
      let query = `deleteOne({"_id":ObjectId("${args.id}")})`;
      MongoDBmutation(ctx.MongoDB, query);
      return `Order №${args.id} was deleted!`;
    },
    updateOrder(parent, args, ctx) {
      let newvalues = { $set: { status: "completed" } };
      let query = `updateOne({"_id":ObjectId("${args.id}")}, ${newvalues})`;
      MongoDBmutation(ctx.MongoDB, query);
      return `Order №${args.id} was updated!`;
    }
  }
};
