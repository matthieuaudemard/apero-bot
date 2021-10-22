require('dotenv').config();
const {Client, Intents} = require('discord.js');
const axios = require('axios');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.on('ready', () => {
  console.log(`logged in as ${client.user.tag}`);
});

client.login(process.env.CLIENT_TOKEN);

const API_KEY = process.env.TENOR_API_KEY;
const API_URL = process.env.API_URL;


const getMeme = async (search, limit = 50) => {
  const res = await axios.get(`${API_URL}/search?key=${API_KEY}&q=${search}&limit=${limit}&media_filter=gif&contentfilter=medium`);
  const memeId = Math.floor((Math.random() * res.data.results.length) + 1);
  return res.data.results[memeId].url;
};

const isGouterTime = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 16 && hours < 18;
};

const isApertoTime = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 18 && hours < 20;
};

client.on('message', async msg => {
  let img;
  switch (msg.content) {
    case '!apero':
      const isApero = isApertoTime();
      img = await getMeme(isApero ? 'yes' : 'no', 50);
      msg.channel.send(img);
      msg.reply(isApero ? `Oui c'est carrément l'heure de l'apéro !!` : `Non c'est pas encore l'heure de l'apéro !!`);
      break;
    case '!gouter':
      const isGouter = isGouterTime();
      img = await getMeme(isGouter ? 'yes' : 'no', 50);
      msg.channel.send(img);
      msg.reply(isGouter ? `Oui c'est carrément l'heure du goûter !!` : `Non c'est pas encore l'heure du goûter !!`);
      break;
  }
});
