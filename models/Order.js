const SimpleCrypto = require("simple-crypto-js").default;
const MongoDB = require("mongodb").MongoClient;
const Response = require("./ResponseBundle");

module.exports = class Order {
  static async Index(req, res) {
    const { name, address, email, ids } = req.body;
    let args = {};

    try {
      let err = await Order.validation(ids, req.body);
      await Order.insertOrder(err, ids, { name, address, email }).then(
        async l => {
          await Response.staticBundle(res, ["orderView"], {
            ...err,
            ...req.body
          });
        }
      );
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/html" });
      res.send(`<h1>Server Error</h1>`);
      console.error(e);
    }
  }

  static async insertOrder(check, ids, userInfo) {
    if (check.good && ids) {
      let qtyItem = {};
      let idItem = [];
      let successInsert = false;

      JSON.parse(ids).map(v => {
        idItem.push(v.split(",")[0]);
        qtyItem[v.split(",")[0]] = v.split(",")[1];
      });
      const Mongo = await new MongoDB(process.env.MONGOURI, {
        useNewUrlParser: true
      }).connect();
      const db = await Mongo.db("dev");
      await db
        .collection("roboshop")
        .find({ id: { $in: idItem } })
        .project({ id: 1, title: 1, price: 1 })
        .toArray(async (err, docs) => {
          if (err) {
            throw new Error(err);
          }
          if (docs) {
            userInfo.items = [];
            userInfo.total = 0;
            docs.map(v => {
              userInfo.items.push({
                id: v.id,
                title: v.title,
                price: v.price,
                qty: qtyItem[v.id]
              });
              userInfo.total +=
                Number(v.price) * Number(qtyItem[v.id]).toFixed(2);
            });
            await db.collection("orders").insertOne(userInfo, function(err, r) {
              if (err) {
                throw new Error(err);
              }
              Order.good = null;
              Mongo.close();
              return r.insertedCount && ids ? true : false;
            });
          } else {
            return false;
          }
        });
      return true;
    } else {
      return false;
    }
  }

  static validation(ids, data) {
    let { name, email, address, captcha, captchaImg } = data;

    Order.errors = [];

    if (!ids) {
      Order.errors.push("<strong>Your basket is empty!</strong>");
    }

    Order.validateName(name)
      .validateAddress(address)
      .validateEmail(email)
      .validateCaptcha(captchaImg, captcha);

    return Order.errors.length > 0
      ? { errors: Order.errors, good: false }
      : { errors: [], good: true };
  }

  static generate() {
    let paths = [
      "4d8db365b67746e544dd0f4b4db910e26149f15047177e1e3837fa55a2bd0246DgWdSv6Wj0ruSrivS0T6tlf36GHthZde9gnJ3jGdcuE=.png",
      "6ac06eb4c8fd6c267106f801632c3c04d08db22a48fa782d585f682e41c79268hXbmORqNlcqE4i+cEWWDjm0PnHq8P5UzDbeznKgcl1Y=.png",
      "8f5b4eb56cf95685b4f109bd514fba574e978e8eaa7dad6055d64096cea69d58IyxjfdVoc9MODKpyF4gH3rtBwPF9+fWwo149X5WLE+I=.svg",
      "49eae85e3d3b216c358b21af6385d42d35e099144a4fb37e3b55e57ccb2e0575v0r2W8phvzGFt7rZ6+RVuXcfNB3KoRDjuWX1I3Qy0og=.png",
      "56b0f9f63e01abbfcc9fa740622ebe8696cdd542a606290d415d1c1343fbdf8fmnpSmwh6cUfRBuR4na74WQbSDEicxKJznAMnoVV4MHU=.svg",
      "67a79440b69b371e98f867e2357c2c664177a502999d83dc2d33f428aa04c31fF8odZ1YhVnRmb0+EuBpS+ChEullotqeu2+C0408Pog8=.svg",
      "97f8639e550540584cc03d9a3f4e70d693cf5a61ce99ce3363e14d423c956111YiiYDl6u1rWVY2XRY1CjT7IxkGD17TLIuO+nnFVMyfU=.png",
      "498d95fe42a4efcf3577903153dedc0e9b54e96c2bbba8bca300c2f0b4d5c175fzWohZe5X7vFVn5jo8H+3ypSsmv5bSplBayLUnKjb4U=.png",
      "710cd0233d9fff6a4130a21e563f7b103759c1f841e49949330b5da0318c9977YGcw2zAzFnxbqPfhsZD05dLOEQBs9c8P0PgJDi0YtkE=.png",
      "4074009d9988e64d419d6e62b68cb0ccc60c76683af82be4c8ea827a63fc6138HpZmScvTYHTlftA7ncmIgu73spja6oOLS0hyGZFpiXI=.svg",
      "4475156e46e809b68f4afbc3c7b9dea7982136c6a81df8ed6d13b8189d302268U8UYmLmeTBUUpEmKOTeXMcSiOFWkaaWBb+AX3sCT2yo=.png",
      "515980413d1d16fe2c4eacdf44f6f6a46a9edda76ef35a97a5254de9bcf081f6oOsRgUE1mj7FTEfCSzPXK9RLqFd5R5SLaP7tvmlNS2U=.svg",
      "54961587578cc443407ea1dab667fba4b11d90f75199b02e2cddd4cbadc110242bpQVaTRPMFiNycpILSpl8p8NThks1i2uDgihYlRQuc=.svg",
      "ace1db92c59b139342e1bb51ab67f1d1abaf72d84b7a56bda3dd15603b405da4q3ukMc1mkGfTWhiwVcODNqfHGeNRsC0CC6xXcNxQgRY=.svg",
      "babba283bbad5da85e2656a0a4525ac0423cea039a49eb8335f694faa1b16574EBqrOZQWJ6WBgvDLO6hKlEX2nQnGwDxnSnfxgraceKA=.svg",
      "bc40e5245244b9176a6c244acbf597ba4f9809486b98704c9a9f8fd494e6dc09fiVhJEBDp+ckYznLyKZ4Mrk1UZuR2LqoBAeZa3HXyC4=.png",
      "bd5331769ed7eb4ca904eb4dbf429bbe2d950316ce73005dabc90458c76f3f5ayZ5NJSYsZXoqmNJWbl9V82Cki5SV+jEUpHriU0fsxTY=.png",
      "c3b3f636463ae1cc9af91f7857f65b4ccb70a47ec59c17663a7068a4ab9bfbd77WLq1PmGl4q8iOHbx+MGddXt0Yi7xREnzc3MqPNESYc=.svg"
    ];

    return paths[Math.floor(Math.random() * paths.length)];
  }

  static validateName(text) {
    if ((text.length == 0 && text.length < 4) || text.length > 18) {
      Order.errors.push(
        "<strong>Name:</strong> Minimum 4 characters and maximum 18"
      );
    }
    return Order;
  }

  static validateAddress(text) {
    if (text.length == 0 || text.length < 4 || text.length > 40) {
      Order.errors.push(
        "<strong>Address:</strong>  Minimum 10 characters and maximum 40"
      );
    }
    return Order;
  }

  static validateEmail(email) {
    if (
      email.match("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$)") ==
        null ||
      email.length == 0
    ) {
      Order.errors.push("<strong>Email:</strong> Incorrect email");
    }
    return Order;
  }

  static validateCaptcha(captchaImg, answer) {
    let secretKey = "some-unique-key";
    let simpleCrypto = new SimpleCrypto(secretKey);
    let decipherText = simpleCrypto.decrypt(captchaImg, true);
    decipherText = decipherText[0].split("_")[0];
    if (decipherText !== answer.toLowerCase() || answer.length == 0) {
      Order.errors.push("<strong>Captcha:</strong> Incorrect captcha");
    }
  }
};
