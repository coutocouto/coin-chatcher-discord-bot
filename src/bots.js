//const Coins = require('./scraping-coins') USE IN SCRAPE
const ApiCoins = require('./api-coins.js')
const { Client, Intents } = require('discord.js');
const config = require('../config.json');
const presetCoins = require('../presetCoins.json')
require('dotenv').config()

class Bot {

    async sendCoinValues () {

        const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
        const TOKEN = process.env.TOKEN //TOKEN FROM DISCORD BOT
        const CHANNEL_NAME = process.env.CHANNEL_NAME //CHANNEL DISCORD NAME
        const prefix = config.prefix    //PREFIX THAT WILL BE USED FOR THE COMMAND
        client.login(TOKEN)

        client.on('message', async message => {

            const coinType = await validationMessage(message)

            //CHOOSE IN CONSUME A MARKETCAP API(NEED TO PAY)  // OR SCRAPE WITH PUPPETEER
            const coin = new ApiCoins(coinType)              //const coin = new Coins(coinType)
            const coinValues = await coin.get()              //const coinValues = await coin.get()

            await message.channel.send(`O valor atual da ${coinValues.nameSymbol} é: :flag_us: ${coinValues.priceValueDolar} | :flag_br: ${coinValues.priceValueBRL}`);

        })

        async function validationMessage (message) {

            if (message.author.bot || !message.content.startsWith(prefix) || !message.channel.name.includes(CHANNEL_NAME)) return

            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const coinType = args.shift().toLowerCase();

            return coinType

        }
    }


    async autoSendCoinValues () {

        const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
        const TOKEN = process.env.TOKEN
        const CHANNEL_ID = process.env.CHANNEL_ID

        client.login(TOKEN)

        client.on('ready', () => {

            const hour = 1000 * 60 * 60
            sendMessage()

        })

        async function sendMessage () {

            const channel = await client.channels.fetch(CHANNEL_ID)
            var coinMessage = ""
            var separetorLine = "-"

            for (let coins in presetCoins) {

                //CHOOSE IN CONSUME A MARKETCAP API(NEED TO PAY)// OR SCRAPE WITH PUPPETEER
                const coin = new ApiCoins(coins)                //const coin = new Coins(presetCoins[coins])
                const coinValues = await coin.get()             //const coinValues = await coin.get()         

                coinMessage += `${coinValues.nameSymbol}: :flag_us: ${coinValues.priceValueDolar}  |  ` +
                    `:flag_br: ${coinValues.priceValueBRL} \n ${separetorLine.repeat(70)} \n`
            }

            channel.send(coinMessage)

        }

    }
}

module.exports = Bot