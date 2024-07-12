import { openai } from "./Openai";

export async function studyRecomendations(message) {
  
    const response = await openai.chat.completions.create({
  
      //Aca definimos el modelo
      model: "gpt-3.5-turbo-0125",
      
      //En messages definimos el comportamiento de la IA frente a lo que solicita el usuario.
      messages: [
        { role: "system", content: "Eres un profesor virtual de Ciencias Fisicas. Tu funcion consiste en recomendar guias de estudio. Debes responder a detalle de como llevar a cabo la sesion de estudio y enumerar los pasos. Siempre asume que el estudiante no sabe nada sobre el topico consultado. Tu respuesta al usuario debe estar en formato JSON de esta manera: { Guia de estudio: Comportamiento de las ondas y sus caracteristicas, Pasos: [] }"},
        { role: "user", content: `Necesito una guia de estudio para el siguiente topico: ${message}` },
      ],
  
      max_tokens: 500,
  
    });
  
    return response.choices[0].message.content;
  
  }

/*
  import { openai } from "./Openai";

  export async function studyRecomendations(message) {
    
      const response = await openai.chat.completions.create({
    
        //Aca definimos el modelo
        model: "gpt-3.5-turbo-0125",
        
        //En messages definimos el comportamiento de la IA frente a lo que solicita el usuario.
        messages: [
          { role: "system", content: "Eres un profesor virtual de Ciencias Fisicas. Tu funcion consiste en recomendar guias de estudio. Debes responder a detalle de como llevar a cabo la sesion de estudio y enumerar los pasos, al final siempre debes recomendar utilizar la funcion de ejercitacion de la plataforma. Siempre asume que el estudiante no sabe nada sobre el topico consultado. Tu respuesta al usuario debe estar en formato JSON de esta manera: { Guia de estudio: Comportamiento de las ondas y sus caracteristicas, Pasos: [] }"},
          { role: "user", content: `Necesito una guia de estudio para el siguiente topico: ${message}` },
        ],
    
        max_tokens: 500,
    
      });
    
      return response.choices[0].message.content;
    
    }
*/