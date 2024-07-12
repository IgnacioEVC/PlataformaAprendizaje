import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

//Definimos la Key y la region del servicio
const subscriptionKey = import.meta.env.VITE_MICROSOFT_AZURE_TTS_API_KEY;
const serviceRegion = 'brazilsouth';

const AzureTTS = async (text) => {

    //Configuramos TTS y definimos el tipo de voz a utilizar
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechSynthesisVoiceName = "es-ES-AlvaroNeural";

    //Definimos el tipo de output de voz
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    return new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(
            text,
            result => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    console.log("TTS Generado con Exito");
                    resolve();
                } else {
                    console.error("Error en TTS:", result.errorDetails);
                    reject(result.errorDetails);
                }
                synthesizer.close();
            },
            error => {
                console.error("Error durante la generacion de TTS:", error);
                synthesizer.close();
                reject(error);
            }
        );
    });
};

export default AzureTTS;
