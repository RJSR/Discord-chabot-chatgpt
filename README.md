# Bot de Discord Llama-2 con Personalidad

## Descripción

Bot de Discord con un toque dramático, impulsado por Llama Chat, un modelo de lenguaje de Meta https://ai.meta.com/llama/.

Inicialmente un bot de discord usando la API de OpenAI, luego refactorizado a usar Llama-2.

## Características

- Interactúa con los usuarios a través de conversaciones basadas en texto.
- Aprovecha las capacidades lingüísticas del modelo Llama-2.

## Cómo empezar

### Requisitos previos:

- Node.js y npm instalados
- Un token de bot de Discord
- Una clave API de Llama Chat (opcional, para indicaciones personalizadas)
  
### Instala dependencias:

```npm install discord.js axios```

### Crea un archivo config.json:

```
{
  "token": "TU_TOKEN_DE_BOT_DE_DISCORD"
}
```

### Ejecuta el bot:

```node index.js```

## Uso

- Invita al bot a tu servidor de Discord.
- Entabla una conversación con el bot enviando mensajes en canales de texto.
- El bot responderá con texto generado por Llama Chat.

## Personalización (opcional)

- Obtén una clave API de Llama Chat para tener más control sobre la configuración del modelo.
- Modifica la variable prompt del código para establecer una indicación personalizada para el modelo de lenguaje.

## Por hacer

- Dividir la respuesta de Llama Chat en distintos mensajes, si dicha respuesta sobrepasa el limite de 2000 carácteres.
- Añadir funcionalidad para que el bot ignore mensajes con un prefijo definido.
- Añadir funcionalidad para que solo responda al ser mencionado.
  
## Licencia

Licencia MIT: https://opensource.org/licenses/MIT: https://opensource.org/licenses/MIT
