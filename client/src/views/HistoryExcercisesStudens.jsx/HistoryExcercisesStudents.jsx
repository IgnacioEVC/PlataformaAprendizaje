import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../../components/NavbarAdmin/NavbarAdmin';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import styles from './HistoryExcercisesStudents.module.css'

export default function HistoryExcercisesStudents() {

    //Variable para definir el id de usuario a consultar.
    const { id } = useParams();

    //Variable para almacenar los ejercicios a presentar.
    const [exercises, setexercises] = useState(null)

    //Variable para navegar.
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3001/getexercisesAdmin', {params: {userId: id}})
        .then(res => {
            if(res.data.Status === "Success") {
                const parsedExercises = res.data.result.map(exercise => {
                    // Parsear la propiedad 'question' a objeto
                    const parsedQuestion = JSON.parse(exercise.question);
                    // Retornar el objeto actualizado
                    return {
                        ...exercise,
                        question: parsedQuestion.ejercicios
                    };
                });
                setexercises(parsedExercises)
            }
            else {
                console.log("Sin Nombre");
            }
        })
    }, [])

    const showAnswer = (answer, options) => {

        const correctOption = options.find(option => option.radioValue === answer);

        return correctOption.choice

    };

    const colorp = (answer, options) => {

        const correctOption = options.find(option => option.radioValue === answer);

        return correctOption.selected

    };

    const volver = () => {
        navigate('/home');
    }

    return (
        <div>
            <NavbarAdmin/>
            <div className={styles.historyContainer}>
                <div className={styles.volverContainer}>
                    <Button variant="success" className={styles.btn} onClick={volver}>
                        <FontAwesomeIcon icon={ faArrowLeft } className={styles.volverIcon}/>
                            <span className={styles.btnText}>Volver</span>
                    </Button>
                </div>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Historial de Exámenes</h1>
                </div>
                <div className={styles.historyBackground}>
                    <div className={styles.recordsContainer}>
                        <div className={styles.records}>
                            {
                                exercises != null && (
                                    <Accordion id="exercises" size='lg' title="Exercises" >
                                        {
                                            exercises.map((exercise, idx) => (
                                                <div className={styles.testBorder}>
                                                    <React.Fragment key={`exercise-${idx}`}>
                                                        <h2 className={styles.testTitle}>Exámen N° {idx + 1}</h2>
                                                        <Accordion.Item eventKey={`${idx}`} className={styles.recordsBackground}>
                                                            <Accordion.Header className={styles.recordsTitle}>Revisar exámen</Accordion.Header>
                                                            <Accordion.Body>
                                                                <div>
                                                                    <div>
                                                                        <Form>
                                                                            {
                                                                                exercise.question.map((question, qIdx) => (
                                                                                    <div key={`group-${qIdx}`}>
                                                                                        <h2>
                                                                                            {qIdx + 1} {")"} {question.questionText}
                                                                                        </h2>
                                                                                        {
                                                                                            question.options.map((option, oIdx) => {
                                                                                                return (
                                                                                                    <div key={`option-${oIdx}`}>
                                                                                                        <Form.Check
                                                                                                        type="radio"
                                                                                                        name={question.name}
                                                                                                        label={option.choice}
                                                                                                        value={option.radioValue}
                                                                                                        defaultChecked={option.selected}
                                                                                                        disabled={true}
                                                                                                        className="checkbox"
                                                                                                        />
                                                                                                    </div>
                                                                                                );
                                                                                            })
                                                                                        }
                                                                                        <p style={ colorp(question.correctAnswer,question.options) ? { color: 'lightgreen'} : { color: 'red'}} >Respuesta correcta: {showAnswer(question.correctAnswer,question.options)}</p>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </Form>
                                                                    </div>
                                                                    <hr/>
                                                                    <div>
                                                                        <h3>Informacion del Ejercicio</h3>
                                                                        <p>Unidad: {`${exercise.subject}`}</p>
                                                                        <p>Tema: {`${exercise.subjectmatter}`}</p>
                                                                        <p>Topico: {`${exercise.topics}`}</p>
                                                                        <p>Dificultad: {`${exercise.difficulty}`}</p>
                                                                        <p>Puntos Conseguidos: {`${exercise.score}`}</p>
                                                                        <p>Puntos Totales: {`${exercise.totalscore}`}</p>
                                                                    </div>
                                                                </div>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </React.Fragment>
                                                </div>
                                            ))
                                        }
                                    </Accordion>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
