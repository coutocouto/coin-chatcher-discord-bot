const Bot = require('./src/bots.js')
const cron = require('node-cron');

class Main {

    run () {

        const bot = new Bot()

        cron.schedule("0 */6 * * *", () => {

            bot.autoSendCoinValues()

        })

        bot.sendCoinValues()

    }
}

module.exports = Main