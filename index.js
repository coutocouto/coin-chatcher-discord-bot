const Bot = require('./src/bots.js')
const bot = new Bot()
const cron = require('node-cron');

cron.schedule("0 */6 * * *", () => {
    bot.autoSendCoinValues()
})

bot.sendCoinValues()
