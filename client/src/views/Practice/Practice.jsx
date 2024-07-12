import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GenerateProblems from "../../OpenAI/GenerateProblems";
import NavbarApp from '../../components/Navbar/NavbarApp';
import Topics from "../../components/Topics/Topics";
import Record from "../../components/Record/Record";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './Practice.module.css'
import './Checkbox.css'

export default function Practice() {

  // Response OpenAI
  const [questions, setQuestions] = useState(null);
  const [jsonquestion, setjsonquestion] = useState(null);

  // Manejo del Frontend
  const [total, setTotal] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [lenghtAnswers, setlenghtAnswers] = useState([]);
  const [isLoadingGenerate, setisLoadingGenerate] = useState(false)
  const [isLoadingSend, setisLoadingSend] = useState(false)
  const answers = [];

  // Filtros Antes de Enviar la consulta a OpenAI
  const [data, setdata] = useState(null)
  const recibirDatos = (datos) => {
    setdata(datos);
  };
  
  const navigate = useNavigate();

  // Damos la funcionalidad a las alternativas de las preguntas generadas por OpenAI
  const handleChange = ({ target }) => {
    if (!submitted) {
      const nextState = questions.map((question) => {
        if (question.name !== target.name) {
          return question;
        }
        return {
          ...question,
          options: question.options.map((opt) => {
            const checked = opt.radioValue === target.value;
            return {
              ...opt,
              selected: checked,
            };
          }),
          currentAnswer: target.value,
        };
      });
      setQuestions(nextState);
    }
  };

  // Se realiza la evaluacion, muestra el puntaje obtenido y por ultimo manda la informacion al server.
  const onSubmit = () => {
    setisLoadingSend(true)
    let correctAnswers = 0;
    let flag = false;

    // Obtenemos las respuestas correctas de los Objetos del JSON
    if(answers.length === 0 ){
      questions.map((question)=>{
        answers.push(question.correctAnswer)
      });
      setlenghtAnswers(answers)
    }

    for (const [index, question] of questions.entries()) {
      if (!question.currentAnswer) {
        // Revisamos si Faltan preguntas por contestar.
        flag = true;
        alert("Por favor responde la pregunta Numero " + (index + 1));
        break;
      } else {
        if (question.currentAnswer === answers[index]) {
          // Cuenta las respuestas correctas.
          ++correctAnswers;
        }
      }
    }

    // Actualizamos el JSON Original con los objetos que se trabajo en el Frontend.
    for (let i = 0; i < jsonquestion.ejercicios.length; i++) {
      const ejercicioOriginal = jsonquestion.ejercicios[i];
      const ejercicioModificado = questions[i];
  
      // Recorremos cada opción en el ejercicio
      for (let j = 0; j < ejercicioOriginal.options.length; j++) {
          const opcionOriginal = ejercicioOriginal.options[j];
          const opcionModificada = ejercicioModificado.options[j];
  
          // Actualizamos la propiedad selected de la opción original
          opcionOriginal.selected = opcionModificada.selected;
      }
    }

    // Mostramos las respuestas correctas al Frontend
    if (!flag) {
      setTotal(correctAnswers);
      setSubmitted(true);
    }

    // Enviamos la informacion a una funcion para que maneje los Errores y estructure la informacion a enviar al server
    Record( data[0], data[1], data[2], data[3], jsonquestion, answers.length, correctAnswers)
  };

  // Envia las variables a la api de OpenAI con los filtros selecionados por el usuario.
  const sendQuestion = async () => {
    try {
      setisLoadingGenerate(true)
      const stringJSON = await GenerateProblems(data[0], data[1], data[2], data[3], data[4]);
      // Transformamos el JSON de string a Objeto para poder trabajar con el.
      const openaiJson = JSON.parse(stringJSON);
      // Almacenamos el JSON Original como objeto para poder Actualizarlo.
      setjsonquestion(openaiJson)
      // Almacenamos los Objetos del JSON original generado para poder depurar y manejar la informacion.
      setQuestions(openaiJson.ejercicios);
      setisLoadingGenerate(false)
      setSubmitted(false)
    } catch (err) {
      console.log(err);
    }
  };

  // Mostramos Las respuestas correctas de Una forma sencilla de entenderlas al momento y ser evaluado los ejercicios
  const showAnswer = (answer, idx) => {
    if (answer == `q${idx + 1}-a`) {
      return "a"
    }
    if (answer == `q${idx + 1}-b`) {
      return "b"
    }
    if (answer == `q${idx + 1}-c`) {
      return "c"
    }
    if (answer == `q${idx + 1}-d`) {
      return "d"
    }
  };

  const volver = () => {
    navigate('/home');
  }

  return (
    <div>
      <NavbarApp/>
        <div className={styles.practiceContainer}>
          <div className={styles.volverContainer}>
            <Button variant="success" className={styles.btn} onClick={volver}>
                <FontAwesomeIcon icon={ faArrowLeft } className={styles.volverIcon}/>
                    <span className={styles.btnText}>Volver</span>
            </Button>
          </div>
          <div className={styles.selectionContainer}>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>¡Pon en practica tus conocimientos con el sistema de ejercitacion!</h2>
              <h5>A continuacion selecciona tus preferencias para el exámen</h5>
            </div>
            <Topics enviarDatos={recibirDatos}/>
            <div className={styles.btnContainer}>
              <Button variant="success" onClick={()=>{sendQuestion()}} disabled={ data != null && !isLoadingGenerate ? false : true } className={styles.btn}>{ isLoadingGenerate ? 'Cargando...' : 'Generar' }</Button>
            </div>
          </div>
          <div>
            <section>
              {submitted && (
                <div className={styles.scoreContainer}>
                  <h2>
                    Respuestas Correctas: {total} de {lenghtAnswers.length}
                  </h2>
                </div>
              )}
              {
                questions != null && (
                  <div className={styles.formContainer}>
                    <Form onSubmit={onSubmit} className={styles.form}>
                      <h5>Responde las siguientes preguntas</h5>
                      <hr className={styles.hr}/>
                      {questions.map((question, idx) => (
                        <div key={`group-${idx}`}>
                          <h3>
                            {idx + 1} {")"} {question.questionText} {}
                          </h3>
                          {question.options.map((option, idx) => {
                            return (
                              <div key={`option-${idx}`}>
                                <Form.Check
                                  type="radio"
                                  name={question.name}
                                  label={option.choice}
                                  value={option.radioValue}
                                  checked={option.selected}
                                  className="checkbox"
                                  onChange={handleChange}
                                />
                              </div>
                            );
                          })}                       
                          {
                            submitted && (
                              <h5>Respuesta correcta: {showAnswer(question.correctAnswer, idx)}</h5>
                            )
                          }
                          <hr className={styles.hr}/>
                        </div>
                      ))}
                      <div className={styles.submitContainer}>
                        {
                        isLoadingSend && <Button href='/home' variant="success" className={styles.btn}>Volver</Button>
                        }
                        <Button variant="success" onClick={()=>{onSubmit()}} disabled={ isLoadingSend } className={styles.btn}>{ isLoadingSend ? 'Enviado' : 'Enviar'}</Button>
                      </div>
                    </Form>
                  </div>
                )
              }
            </section>
          </div>
        </div>
    </div>
  )
}