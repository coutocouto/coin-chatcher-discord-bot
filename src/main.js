const Bot = require('./bots.js')
const cron = require('node-cron');
const fetch = require("node-fetch")

class Main {

    run () {

        const bot = new Bot()
        const url = "https://coin-catcherbot.herokuapp.com/"

        cron.schedule("*/10 * * * *", () => {

            fetch(url).then(res => res)

        })

        cron.schedule("0 */2 * * *", () => {

            bot.autoSendCoinValues()

        })

        bot.sendCoinValues()

    }
}

module.exports = Main