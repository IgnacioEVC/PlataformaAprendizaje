import { openai } from "./Openai";

export async function sendMsgToOpenAI(messages) {

    //Esta funcion recibe los mensajes desde frontend y los almacena en message.
    const formattedMessages = messages.map(message => ({
        role: message.isBot ? "assistant" : "user",
        content: message.text
    }));

    const response = await openai.chat.completions.create({

        //Aca definimos el modelo.
        //model: "gpt-4o-2024-05-13",

        model: "gpt-3.5-turbo-0125",

        //En messages definimos el comportamiento de la IA frente a lo que solicita el usuario.
        messages: [
            { role: "system", content: "Eres un profesor virtual de Ciencias Fisicas. Eres un profesor carismatico. Solo respondes dudas sobre la plataforma web y Ciencias Fisicas. Participas de una aplicacion web de estudio, para estudiantes de ciencias fisicas, estas son sus funcionalidades: 1.Funcion de Profesor Virtual (Inteligencia Artificial, este eres tu). 2.Funcion de Ejercitacion (Esta funcion permite al alumno desarrollar examenes generados por Inteligencia Artificial). 3.Generador de Guia de Estudio (Esta funcion permite al alumno escoger un topico de los disponibles y genera una guia de estudio por Inteligencia Artificial).  Si un estudiante te consulta algo fuera de Ciencias Fisicas, le indicas que por favor consulte sobre el tema (Unidades de primero medio: Ondas, Luz, Sismos, Universo Cercano). Procura siempre escribir ordenadamente (utilizando distintos separadores y saltos de lineas para mantener el texto ordenado), debes considerar que tu respuesta se renderiza en un <p> de hmtl" },
            ...formattedMessages
        ],
        max_tokens: 500,
    });

    return response.choices[0].message.content;
}
