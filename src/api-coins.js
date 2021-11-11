const Fetch = require('node-fetch')
require('dotenv').config()

class apiCoins {

    constructor(coinType) {

        this.coinType = coinType

    }

    async get () {

        const API_KEY = process.env.API_KEY; // API KEY FROM https://pro.coinmarketcap.com/
        const baseUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`;
        const symbol = `?&symbol=${this.coinType}`;

        const completUrl = baseUrl + symbol;
        const nameSymbol = this.coinType.toUpperCase();

        const parameters = {

            headers: { 'X-CMC_PRO_API_KEY': API_KEY },

        }

        const priceValues = await getValues(completUrl, parameters, nameSymbol);

        return priceValues;


        async function getValues (completUrl, parameters, cointype) {

            const priceValueDolar = await Fetch(completUrl, parameters)
                .then(response => response.json()
                    .then(dataCoins => "USD: " + dataCoins.data[nameSymbol].quote.USD.price))


            const priceValueBRL = await Fetch(completUrl + "&convert=BRL", parameters)
                .then(response => response.json()
                    .then(dataCoins => "BRL: " + dataCoins.data[nameSymbol].quote.BRL.price))

            return { priceValueDolar, priceValueBRL, nameSymbol };

        }
    }
}

module.exports = apiCoins;