const puppeteer = require('puppeteer');

class scrapingCoins {

    constructor(coinType) {
        this.coinType = coinType
    }

    async get () {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const priceValues = await getValues(page, this.coinType);

        return priceValues;


        async function getValues (page, coinType) {

            try {

                await page.goto(`https://coinmarketcap.com/currencies/${coinType}/`);

                const priceValueDolar = await page.evaluate(() => document.querySelector('.priceValue ').textContent);
                const nameSymbol = await page.evaluate(() => document.querySelector('.nameSymbol').textContent);

                await page.goto(`https://coinmarketcap.com/pt-br/currencies/${coinType}/`);

                const priceValueBRL = await page.evaluate(() => document.querySelector('.priceValue ').textContent);

                await browser.close();

                return { priceValueDolar, priceValueBRL, nameSymbol };

            } catch (error) {

                console.warn("Erro: " + error);

            }
        }
    }
}

module.exports = scrapingCoins