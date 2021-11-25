//const Coins = require('./scraping-coins') USE IN SCRAPE
const ApiCoins = require("./api-coins.js");
const { Client, Intents } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const presetCoins = require("../presetCoins.json");
require("dotenv").config();

class Bot {

	async sendCoinValues () {

		const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
		const TOKEN = process.env.TOKEN; //TOKEN FROM DISCORD BOT
		const CHANNEL_NAME = process.env.CHANNEL_NAME; //CHANNEL DISCORD NAME
		const prefix = config.prefix;    //PREFIX THAT WILL BE USED FOR THE COMMAND
		client.login(TOKEN);

		client.on("message", async message => {

			if (message.author.bot || !message.content.startsWith(prefix) || !message.channel.name.includes(CHANNEL_NAME)) return;

			const coinType = await formatMessage(message);

			//CHOOSE IN CONSUME A MARKETCAP API(NEED TO PAY)  // OR SCRAPE WITH PUPPETEER
			const coin = new ApiCoins(coinType);              //const coin = new Coins(coinType)
			const coinValues = await coin.get();              //const coinValues = await coin.get()

			if (!coinValues) {
				message.channel.send("Comando invalido!");
				return;
			}

			const embed = embedMake(coinValues);

			message.channel.send({ embeds: [embed] });

		});

		function formatMessage (message) {

			const args = message.content.slice(prefix.length).trim().split(/ +/g);
			const coinType = args.shift().toLowerCase();

			return coinType;

		}

		function embedMake (coinValues) {
			return new MessageEmbed()
				.setColor("FFFB03")
				.setTitle("Coin Catcher")
				.setURL("https://github.com/coutocouto/coin-chatcher-discord-bot")
				.addFields([{

					name: `${coinValues.nameSymbol}`,
					value: `:flag_br: ${coinValues.priceValueBRL}`

				},
				{

					name: `${coinValues.nameSymbol}`,
					value: `:flag_us: ${coinValues.priceValueDolar}`

				}]);


		}
	}


	async autoSendCoinValues () {

		const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
		const TOKEN = process.env.TOKEN;
		const CHANNEL_ID = process.env.CHANNEL_ID;

		client.login(TOKEN);

		client.on("ready", () => {

			sendMessage();

		});

		async function sendMessage () {

			const channel = await client.channels.fetch(CHANNEL_ID);
			//var coinMessage = ""
			//var separetorLine = "-"

			// coinMessage += `${coinValues.nameSymbol}: ` +
			//     `:flag_us: ${(coinValues.priceValueDolar)}  | ` +
			//     `:flag_br: ${(coinValues.priceValueBRL)} \n ${separetorLine.repeat(70)} \n`

			const embed = await superEmbedMake();

			channel.send({ embeds: [embed] });

		}

		async function superEmbedMake () {

			return new MessageEmbed()
				.setColor("FFFB03")
				.setTitle("Coin Catcher")
				.setURL("https://github.com/coutocouto/coin-chatcher-discord-bot")
				.addFields(await presetListFactory());

		}

		async function presetListFactory () {

			let presetList = [];
			let blankSpace = { name: "\u200b", value: "\u200b", inline: true };

			for (let coins in presetCoins) {

				//CHOOSE IN CONSUME A MARKETCAP API(NEED TO PAY)// OR SCRAPE WITH PUPPETEER
				const coin = new ApiCoins(coins);                //const coin = new Coins(presetCoins[coins])
				const coinValues = await coin.get();             //const coinValues = await coin.get()

				let presetObjectDolar = await presetObjectFactory(coinValues.nameSymbol, coinValues.priceValueDolar, ":flag_us:");
				let presetObjectBRL = await presetObjectFactory(coinValues.nameSymbol, coinValues.priceValueBRL, ":flag_br:");

				presetList.push(presetObjectBRL, presetObjectDolar, blankSpace);

			}

			return presetList;

		}

		async function presetObjectFactory (nameSymbol, priceValue, flag) {

			let presetObject = {};

			presetObject.name = `${nameSymbol}`;
			presetObject.value = `${flag} ${priceValue}`;
			presetObject.inline = true;

			return presetObject;

		}
	}
}

module.exports = Bot;