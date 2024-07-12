import {openai} from './Openai';

export default async function GenerateProblems(subject, subjectmatter, topic, difficulty, numberOfExercises) {
  const completion = await openai.chat.completions.create({

    //Aca definimos el comportamiento del sistema
    messages: [{"role": "system", "content": "Eres un asistente útil, designado para producir JSON."},
              {"role": "user", 
              "content": `Genera un archivo JSON que contenga una serie de problemas matemáticos relacionados con la materia de ${subject}. Estos problemas estarán centrados en el tema de ${subjectmatter} y específicamente en el tópico de ${topic}. Debes generar un total de ${numberOfExercises} problemas en total. Cada uno de estos problemas estará categorizado por su nivel de dificultad, especificado como ${difficulty}. En la key de options tienes que generar 4 alternativas diferentes para el ejercicio donde solo una es la respuesta correcta y esta respuesta correcta tienes que guardarla en la key de correctAnswer con el radiovalue correspondiente de la alternativa correcta, el formato del JSON debe ser el siguiente:
              {
                "ejercicios": 
                [
                  {
                    "questionText": "Aquí debe de estar el texto del problema",
                    "name": "q1-name",
                    "options": [
                      {"choice": "Opción 1", "radioValue": "q1-a", "selected": false},
                      {"choice": "Opción 2", "radioValue": "q1-b", "selected": false},
                      {"choice": "Opción 3", "radioValue": "q1-c", "selected": false},
                      {"choice": "Opción 4", "radioValue": "q1-d", "selected": false},
                    ],
                    "correctAnswer": "q1-c",
                  },
                ]
              }`
            }],

      //Aca definimos el modelo
      model: "gpt-3.5-turbo",
      max_tokens: 1500,
  });
  
  return completion.choices[0].message.content;
  
}
