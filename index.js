// Se carga la configuración del entorno desde un archivo .env
require('dotenv/config');

// Importa la clase Client de la biblioteca discord.js para la creación del bot de Discord
const { Client } = require('discord.js');

// Se importa la clase OpenAI
const { OpenAI } = require('openai');

// Se crea una instancia del cliente de Discord
const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

// Se ejecuta cuando el bot se conecta exitosamente
client.on('ready', () => {
    console.log('El bot está conectado');
});

// Definición de constantes
const IGNORE_PREFIX = "!";  //  Lista de prefijos a ignorar, por ejemplo '!hola' es ignorado.
const CHANNELS = ['691845758835490878'];  // Lista de ID de canales permitidos

// Se crea una instancia de OpenAI con la clave de API proporcionada en el archivo .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

// Este evento ejecuta cuando se recibe un nuevo mensaje en cualquier canal
client.on('messageCreate', async (message) => {

    if (message.author.bot) return;     // Se ignoran los mensajes del propio bot
    if (message.content.startsWith(IGNORE_PREFIX)) return;

    // Se verifica si el mensaje proviene de un canal permitido
    if (!CHANNELS.includes(message.channelId) && !message.users.has(client.user.id)) return;

    // Notificación del bot escribiendo el mensaje
    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() =>{
        message.channel.sendTyping();
    }, 5000); // Duración máxima de 5 segundos

    // Declarar conversation, otorgando el rol de sistema al bot.
    let conversation = [];
    conversation.push({
        role: 'system',
        content: 'Chat GPT is a friendly chatbot.'
    })

    // Obtener los ultimos 10 mensajes
    let prevMessages = await message.channel.messages.fetch({ limit: 10});
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (msg.author.bot && msg.author.id !== client.user.id) return;
        if (msg.content.startsWith(IGNORE_PREFIX)) return;


        // Convertir los caracteres especiales y espacios del usuario en '_' para ser detectados por openai
        const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

        if (msg.author.id === client.user.id) { // El mensaje pertenece al bot.
            conversation.push({
                role: 'assistant',
                name: username,
                content: msg.content,
            });

            return;
        }

        conversation.push({ // El mensaje pertenece al usuario
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
        .catch((error) => console.error('OpenAI Error: \n', error)); //Catch en consola para codigo de error.

    clearInterval(sendTypingInterval);
    
    // Mensaje de error como respuesta en discord.
    if (!response) {
        message.reply("Estoy teniendo problemas con la API de OpenAI, por favor intenta de nuevo en un momento");
        return
    }
    
    // Limitar a 2000 la cantidad de caracteres de respuesta
    const responseMessage = response.choices[0].message.content;
    const chunkSizeLimit = 2000;

    // División de respuesta en multiples mensajes
    for (let i = 0; i < responseMessage.length; i+= chunkSizeLimit ){ 
        const chunk = responseMessage.substring(i, i + chunkSizeLimit);
        await message.reply(chunk);
    }

    // Se responde al mensaje original con la respuesta generada por OpenAI
    message.reply();
});

// Se inicia sesión del bot con el token proporcionado en el archivo .env
client.login(process.env.TOKEN);
