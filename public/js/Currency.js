class Currency {
  static requestCurrency() {
    if (localStorage.getItem("listcurrency")) {
      let now = Math.floor(new Date().valueOf() / 1000);
      let time = now - JSON.parse(localStorage.getItem("listcurrency"))["time"];
      if (time > 180000) {
        Currency.converter();
      }
    } else {
      Currency.converter();
    }
  }

  static converter() {
    return fetch(
      "https://free.currconv.com/api/v7/convert?q=USD_EUR,USD_GBP&compact=ultra&apiKey=a498394ec35761626eaa"
    )
      .then(r => r.json())
      .then(function(response) {
        let pares = { EUR: null, GBP: null, USD: null, time: null };
        pares["EUR"] = response.USD_EUR;
        pares["GBP"] = response.USD_GBP;
        pares["USD"] = 1;
        pares["time"] = Math.floor(new Date().valueOf() / 1000);
        localStorage.setItem("listcurrency", JSON.stringify(pares));
      })
      .catch(e => new Error(e));
  }

  static addCurrency(name) {
    let n = "";
    switch (name) {
      case "pound":
        n = "GBP";
        break;
      case "dollar":
        n = "USD";
        break;
      case "euro":
        n = "EUR";
        break;
    }
    let rate = JSON.parse(localStorage.getItem("listcurrency"))[n];
    localStorage.setItem(
      "currency",
      JSON.stringify({ name: n, rate: rate ? rate : 1 })
    );
    Currency.go(true);
    Basket.addCurrencyInBasketPage();
  }

  static checkCurrency() {
    Currency.requestCurrency();
    return !localStorage.getItem("currency")
      ? localStorage.setItem(
          "currency",
          JSON.stringify({ name: "USD", rate: 1 })
        )
      : null;
  }

  static getSymbol() {
    let name = JSON.parse(localStorage.getItem("currency"))["name"];
    let symbol = "";
    switch (name) {
      case "EUR":
        symbol = "euro";
        break;
      case "USD":
        symbol = "dollar";
        break;
      case "GBP":
        symbol = "pound";
        break;
      default:
        symbol = "euro";
    }
    return symbol;
  }

  static flag() {
    let name = JSON.parse(localStorage.getItem("currency"))["name"];
    let flag = "";
    switch (name) {
      case "EUR":
        flag = "eu.svg";
        break;
      case "USD":
        flag = "us.svg";
        break;
      case "GBP":
        flag = "gb.svg";
        break;
      default:
        flag = "eu.svg";
    }
    return { flag: flag, abbr: name };
  }

  static currencyPrice(click = false) {
    let divPrice = document.querySelectorAll(".item__price");
    if (divPrice) {
      [...divPrice].forEach(v => {
        let price = click
          ? document.querySelector("#price").value
          : v.textContent.split(" ")[0];
        v.textContent =
          String(
            (
              price * JSON.parse(localStorage.getItem("currency"))["rate"]
            ).toFixed(2)
          ) +
          " " +
          Currency.decodeHTML(Currency.getSymbol());
      });
    }

    let price = document.querySelector(".item_block__params h2");

    if (price) {
      let p = click
        ? document.querySelector("#price").value
        : price.textContent.split(" ")[0];
      price.textContent =
        String(
          (p * JSON.parse(localStorage.getItem("currency"))["rate"]).toFixed(2)
        ) +
        " " +
        Currency.decodeHTML(Currency.getSymbol());
    }
  }

  static showMenuCurrency() {
    let list_symbols = ["euro", "pound", "dollar"];

    let html = ``;
    list_symbols.forEach(v => {
      html += `<label  class='${v}' for='${v}'>
    <button onclick='Currency.addCurrency("${v}")' type="submit" id='${v}' name='${v}' style='visibility: hidden'>
    </button></label>`;
    });
    return html;
  }

  static decodeHTML(c) {
    let entities = { pound: "\u00A3", euro: "\u20AC", dollar: "$" };
    return entities[c];
  }

  static elBg() {
    return `background:url(../img/arrow.png)  no-repeat, url(../img/${
      Currency.flag()["flag"]
    }) no-repeat;
    background-position: left, right;
    background-size: auto, contain;
    `;
  }

  static go(click = false) {
    document.getElementById(
      "form_currency"
    ).innerHTML = Currency.showMenuCurrency();
    document.getElementById(
      "form_currency_mobile"
    ).innerHTML = Currency.showMenuCurrency();
    document.querySelector("#abbr > span").textContent = Currency.flag()[
      "abbr"
    ];
    document
      .querySelector("#abbr > div")
      .setAttribute("style", `${Currency.elBg()}`);
    document.querySelector("#mob_abbr > span").textContent = Currency.flag()[
      "abbr"
    ];
    document
      .querySelector("#mob_abbr > div")
      .setAttribute("style", `${Currency.elBg()}`);
    Currency.currencyPrice(click);
  }
}

Currency.checkCurrency();
Currency.go();
