require('dotenv/config');
const { Client } = require('discord.js');
const { OpenAi } = require('openai');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

client.on('ready', () => {
    console.log('El bot está conectado');
});

client.login(process.env.TOKEN);