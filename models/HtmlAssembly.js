const path = require("path");
const fsPromises = require("fs").promises;

class Html {

  constructor(header, footer) {
    this.header = header
      ? path.resolve("./views/tpl/headerForItem.html")
      : path.resolve("./views/tpl/header.html");

    this.footer = footer ? footer : path.resolve("./views/tpl/footer.html");
  }

  assembly(html) {
    let htmlTorrent = "";
    html ? html.map(el => (htmlTorrent += el)) : null;

    return Promise.all([
      fsPromises.readFile(this.header),
      htmlTorrent,
      fsPromises.readFile(this.footer)
    ])
      .then(files => files.map(f => f.toString("utf-8")))
      .then(files => files.join(""))
      .catch(e => console.error(e.toString()));
  }
}

module.exports = Html;
