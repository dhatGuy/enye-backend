const Router = require("express").Router();
const fetch = require("node-fetch");

Router.route("/").get(async (req, res, next) => {
  let { base, currency } = req.query;

  if (base !== undefined) base = base.toUpperCase();

  try {
    const endpoint = `https://api.exchangeratesapi.io/latest?base=${base}&currency=${currency}`;
    const response = await (await fetch(endpoint)).json();
    let rates = {};

    if (currency !== undefined) {
      currency = currency.split(",").map((cur) => cur.toUpperCase());
      currency.forEach((cur) => (rates[cur] = response.rates[cur]));
    } else{
      rates = {...response.rates}
    }

    res.json({
      results: {
        base: response.base,
        date: response.date,
        rates,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
    throw error;
  }
});

module.exports = Router;
