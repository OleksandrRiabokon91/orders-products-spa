import axios from "axios";

/* Получаем актуальный курс USD→UAH из ПриватБанка */
export const getUSDUAHRate = async () => {
  try {
    const { data } = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
    );
    const usd = data.find((r) => r.ccy === "USD");
    if (!usd) throw new Error("PrivatBank: USD rate not found");
    return parseFloat(usd.sale);
  } catch (err) {
    console.error("Exchange rate error:", err);
    throw err;
  }
};

/* конвертация значений в обе валюты */
export const convertPrice = (value, currency, rate) => {
  let usd, uah;
  if (currency === "USD") {
    usd = +value;
    uah = +(value * rate).toFixed(2);
  } else if (currency === "UAH") {
    uah = +value;
    usd = +(value / rate).toFixed(2);
  } else {
    throw new Error("Unsupported currency: " + currency);
  }
  return { usd, uah };
};
