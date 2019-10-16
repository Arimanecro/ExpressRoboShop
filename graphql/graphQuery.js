const fetch = require("node-fetch");
const Response = require("../models/ResponseBundle");

module.exports = (req, res, query, view, header = false) => {
  return fetch(`${req.protocol}://${req.headers.host}/graphql`, {
    method: "post",
    body: JSON.stringify(query),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(r => {
      r.data[Object.keys(r.data)[0]].length
        ? Response.dynamicBundle(req, res, [`${view}`], r, header)
        : res.redirect("/404");
    })
    .catch(e => console.error(e));
};
