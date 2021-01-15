const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/api/rates", async (req, res, next) => {
  let { base, currency } = req.query;

  if (base !== undefined) base = base.toUpperCase();

  if (currency !== undefined) {
    currency = currency.split(",").map((cur) => cur.toUpperCase());
  }

  try {
    const endpoint = `https://api.exchangeratesapi.io/latest?base=${base}&currency=${currency}`;
    const response = await (await fetch(endpoint)).json();
    const rates = {};
    currency.forEach((cur) => (rates[cur] = response.rates[cur]));

    res.json({
      results: {
        base: response.base,
        date: response.date,
        rates,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
    throw error;
  }
});

app.listen(PORT, () => console.log(`Magic is happening on PORT ${PORT}`));
