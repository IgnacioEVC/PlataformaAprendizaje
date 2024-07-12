import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NavbarApp from "../../components/Navbar/NavbarApp";
import { sendMsgToOpenAI } from "../../OpenAI/SendMessageToOpenAI";
import { Button, ButtonGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import BotIcon from '../../Images/Icons/BotIcon.png';
import UserIcon from '../../Images/Icons/UserIcon.png';
import styles from './Aichat.module.css';
import AzureTTS from "../../AzureTTS/AzureTTS";

function AIChat () {

    // Usar useLocation para obtener el estado pasado
    const location = useLocation();
    const { fname, lname } = location.state || { fname: "", lname: "" };

    //Variable para automatizar el scroll al momento de recibir un mensaje
    const msgEnd = useRef(null);

    //Variable para almacenar el input de usuario
    const [input, setInput] = useState("");

    //Variable para almacenar los mensajes enviados por el bot y el usuario.
    const [messages, setMessages] = useState([{
        text: "Hola, soy tu profesor virtual de ciencias físicas. Ingresa cualquier que tengas al respecto sobre este tema 👋.",
        isBot: true,
    }]);

    //Variable para definir si TTS esta habilitado o no.
    const [isTTSEnabled, setIsTTSEnabled] = useState(true);

    //Variable para poder navegar
    const navigate = useNavigate();

    //Este hook automatiza el scroll de los mensajes.
    useEffect(() => {
        if (msgEnd.current) {
            msgEnd.current.scrollIntoView();
        }
    }, [messages]);

    //Esta funcion permite enviar el input de usuario, limpia el cuadro de input, almacena el mensaje del usuario en formato de contexto y devuelve la respuesta del bot y microsot azure TTS.
    const handleSend = async () => {
        const text = input;
        setInput('');
        const newMessages = [...messages, { text, isBot: false }];
        setMessages(newMessages);
        const res = await sendMsgToOpenAI(newMessages);
        setMessages([...newMessages, { text: res, isBot: true }]);
        
        if (isTTSEnabled) {
            try {
                const cleanText = removeEmojis(res);
                await AzureTTS(cleanText);
            } catch (error) {
                console.error("Error in Azure TTS:", error);
            }
        }
    }

    //Esta funcion permite a AzureTTS omitir los emojis que se encuentren en messages.
    const removeEmojis = (text) => {
        return text.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '');
    }

    //Esta funcion permite activar o desactivar AzureTTS
    const toggleTTS = () => {
        setIsTTSEnabled(!isTTSEnabled);
    }

    //Funcion para el boton volver
    const volver = () => {
        navigate('/home');
    }

    return (
        <div>
            <NavbarApp />
            <div className={styles.aichatContainer}>
                <div className={styles.inputContainer}>
                    <textarea
                        type="text"
                        placeholder="Porfavor ingrese una pregunta..."
                        value={input}
                        className={styles.input}
                        onChange={(e) => { setInput(e.target.value) }}
                    />
                    <Button type="submit" variant="success" onClick={handleSend} className={styles.btnSend} disabled={!input}>
                        <FontAwesomeIcon icon={faPaperPlane} className={styles.sendIcon}/>
                    </Button>
                </div>
                <div className={styles.backgroundContainer}>
                    <div className={styles.chatboxContainer}>
                        {messages.map((message, i) =>
                            <div key={i} className={message.isBot ? styles.botResponse : styles.userResponse}>
                                <div className={message.isBot ? styles.responseTitleBot : styles.responseTitleUser}>
                                    <img className={styles.chatImg} src={message.isBot ? BotIcon:UserIcon}/>
                                        <div className={styles.title}>
                                            {message.isBot ? "Profesor Virtual":`${fname} ${lname}`}
                                        </div>
                                </div>
                                <p className={styles.message}>{message.text}</p>
                            </div>
                        )}
                        <div ref={msgEnd}/>
                    </div>
                </div>
                <div className={styles.volverContainer}>
                    <ButtonGroup className={styles.buttonGroup}>
                        <Button variant="success" className={styles.btnVolver} onClick={volver}>
                            <FontAwesomeIcon icon={ faArrowLeft } className={styles.volverIcon}/>
                            <span className={styles.btnText}>Volver</span>
                        </Button>
                        <Button variant={isTTSEnabled ? "success" : "danger"} className={isTTSEnabled ? styles.btnTTS : styles.btnTTSDisable } onClick={toggleTTS}>
                            {isTTSEnabled ? "Texto a voz Activado" : "Texto a voz Desactivado"}
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}

export default AIChat;
