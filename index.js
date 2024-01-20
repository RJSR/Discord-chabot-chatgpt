const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config.json");
const { default: axios } = require("axios");
const prompt = "Eres una persona muy Dramatica"
const client = new Client({
  intents: [Object.keys(GatewayIntentBits)], //Estamos dando los permisos y los Partials
  partials: [Object.keys(Partials)],
});

client.setMaxListeners(0); //Manejador de eventos

//Aquí se responderan los mensajes del usuario
client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot && message.author.id === client.user.id) return;
    console.log("Procesando Mensaje");
    const llamaMessage = await axios.post("https://llama-chat-murex.vercel.app/api", 
    {
        "prompt": `<s>[INST] <<SYS>>\n${prompt}\n<</SYS>>\n\n${message.content} [/INST]\n`,
        "model": "meta/llama-2-70b-chat",
        "systemPrompt": prompt,
        "temperature": 0.75,
        "topP": 0.9,
        "maxTokens": 800,
        "image": null,
        "audio": null
    })
    console.log("Mensaje Procesado");
    return message.reply({
        content:llamaMessage.data
    })
} catch (err) {
    console.log(err);
    console.log("algo salio mal");
    return message.reply({
        content:"algo salio mal"
    })
  }
  fetch;
  if ((message.content == "Hola") == "hola") {
    return message.reply({
      content: `Hola, ¿Cómo estás?\ncoloca el comando: /ingresando`,
    });
  }
});

client
  .login(config.token)
  .then((result) => {
    console.log(`${client.user.username} Está Online.`);
  })
  .catch((err) => {
    console.log(err, "Help estoy falland :C");
  });
