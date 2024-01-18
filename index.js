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

    // Se indica que el bot está escribiendo en el canal
    await message.channel.sendTyping();

    // Se realiza una solicitud a la API de OpenAI para completar el contenido del mensaje
    const response = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Chat GPT is a friendly chatbot.'
                },
                {
                    role: 'user',
                    content: message.content,
                }
            ]
        })
        .catch((error) => console.error('OpenAI Error: \n', error));

    // Se responde al mensaje original con la respuesta generada por OpenAI
    message.reply(response.choices[0].message.content);
});

// Se inicia sesión del bot con el token proporcionado en el archivo .env
client.login(process.env.TOKEN);
