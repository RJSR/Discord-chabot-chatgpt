// Se carga la configuración del entorno desde un archivo .env
require('dotenv/config');

// Importa la clase Client de la biblioteca discord.js para la creación del bot de Discord
const { Client } = require('discord.js');

// Se importa la clase OpenAI para interactuar con la API de OpenAI
const { OpenAI } = require('openai');

// Creación de una instancia del cliente de Discord
const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

// Evento que se ejecuta cuando el bot se conecta exitosamente
client.on('ready', () => {
    console.log('El bot está conectado');
});

// Definición de constantes
const IGNORE_PREFIX = "!"; 
const CHANNELS = ['691845758835490878'];  // Lista de ID de canales permitidos

// Se crea una instancia de OpenAI con la clave de API proporcionada en el archivo .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

// Este evento ejecuta cuando se recibe un nuevo mensaje en cualquier canal
client.on('messageCreate', async (message) => {
    // Se ignoran los mensajes del propio bot y aquellos que comienzan con el prefijo definido
    if (message.author.bot) return;
    if (message.content.startsWith(IGNORE_PREFIX)) return;

    // Se verifica si el mensaje proviene de un canal permitido o es un mensaje directo al bot
    if (!CHANNELS.includes(message.channelId) && !message.users.has(client.user.id)) return;

    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() =>{
        message.channel.sendTyping();
    }, 5000);

    let conversation = [];
    conversation.push({
        role: 'system',
        content: 'Chat GPT is a friendly chatbot.'
    })

    let prevMessages = await message.channel.messages.fetch({ limit: 10});
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (msg.author.bot && msg.author.id !== client.user.id) return;
        if (msg.content.startsWith(IGNORE_PREFIX)) return;

        const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

        if (msg.author.id === client.user.id) {
            conversation.push({
                role: 'assistant',
                name: username,
                content: msg.content,
            });

            return;
        }

        conversation.push({
            role: 'user',
            name: 'username',
            content: msg.content,

        })
    });

    // Se realiza una solicitud a la API de OpenAI para completar el contenido del mensaje
    const response = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            messages: conversation,
        })
        .catch((error) => console.error('OpenAI Error: \n', error));

    clearInterval(sendTypingInterval);

    if (!response) {
        message.reply("Estoy teniendo problemas con la API de OpenAI, por favor intenta de nuevo en un momento");
        return
    }
    // Se responde al mensaje original con la respuesta generada por OpenAI
    const responseMessage = response.choices[0].message.content;
    const chunkSizeLimit = 2000;

    for (let i = 0; i < responseMessage.length; i+= chunkSizeLimit ){
        const chunk = responseMessage.substring(i, i + chunkSizeLimit);
        await message.reply(chunk);
    }

    message.reply();
});

// Se inicia sesión del bot con el token proporcionado en el archivo .env
client.login(process.env.TOKEN);
