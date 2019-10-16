const Html = require("./HtmlAssembly");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const path = require("path");

module.exports = class Response {
  static async dynamicBundle(req, res, view, docs, header = false) {
    try {
      let listOfViews = [];
      view.forEach(h => {
        let p = require(`../views/${h}`);
        if (Array.isArray(p)) {
          p.map(el => listOfViews.push(el(docs.data)));
        } else {
          listOfViews.push(p(docs.data));
        }
      });

      let page = await new Html(header).assembly(listOfViews);
      await res.writeHead(200, {
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(page, "utf8")
      });
      await res.end(`${page}`);
    } catch {
      e => console.error(e);
    }
  }

  static async staticBundle(res, view, args = null, header = true) {
    let page = await new Html(header).assembly(
      view.map(h => {
        let page = require(`../views/${h}`);
        return page(args);
      })
    );
    await res.writeHead(200, {
      "Content-Type": "text/html",
      "Content-Length": Buffer.byteLength(page, "utf8")
    });
    await res.end(`${page}`);
  }

  static notFound(res) {
    const src = fs.createReadStream(path.resolve("./views/tpl/404.html"));
    src.pipe(res);
  }

  static redirect(res) {
    res.writeHead(301, { Location: "/404" });
    res.end();
  }
};
