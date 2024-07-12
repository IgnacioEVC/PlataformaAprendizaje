import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, ButtonToolbar, ButtonGroup, Form } from "react-bootstrap";
import axios from "axios";
import styles from './Topics.module.css';

export default function Topics(props) {
    // Response de MYSQL
    const [data, setData] = useState([]);

    // Manejo de Informacion del Response de MYSQL
    const [chargeSubjects, setChargeSubjects] = useState(null);
    const [chargeSubjectMatters, setChargeSubjectMatters] = useState(null);
    const [chargeTopics, setChargeTopics] = useState(null);
    const chargedifficultys = ["Facil", "Media", "Dificil", "Muy Dificil"];
    const chargeExercises = ["2", "4", "6", "8", "10"];

    // Valores que selecciona el usuario
    const [subject, setSubject] = useState(null);
    const [subjectMatter, setSubjectMatter] = useState(null);
    const [topic, setTopic] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    const [numberOfExercises, setNumberOfExercises] = useState(null);

    axios.defaults.withCredentials = true;

    // Solicitar el material de estudio a MYSQL
    useEffect(() => {
        if (data.length === 0) {
            axios.get('http://localhost:3001/topics')
            .then(res => {
                if (res.data.Status === "Success") {
                    // Guardamos la informacion entregada por MYSQL para poder trabajarla
                    setData(res.data.result);
                    // Buscamos las materias disponibles
                    let arraySubject = [];
                    for (let element of res.data.result) {
                        if (!arraySubject.includes(element.subject)) {
                            arraySubject.push(element.subject);
                        }
                    }
                    // Imprimimos las unidades encontradas en pantalla
                    setChargeSubjects(arraySubject);
                } else {
                    console.log("Sin Nombre");
                }
            });
        }
    }, []);

    // Cuando el usuario seleccione la unidad invoca a cargar los temas de la unidad
    useEffect(() => {
        // En caso de que el usuario quiera cambiar la unidad se realiza un reset de los valores posteriores
        if (subject != null && subjectMatter != null) {
            setChargeSubjectMatters(null);
            setSubjectMatter(null);
            setChargeTopics(null);
            setTopic(null);
            setDifficulty(null);
            setNumberOfExercises(null);
            enviarDatosAlPadre(null);
        }
        if (subject != null) handleSubjectMatter(subject);
    }, [subject]);

    const handleSubjectMatter = (subject) => {
        // Carga los temas de la unidad seleccionada
        let arraySubjectMatter = [];
        for (let element of data) {
            if (subject === element.subject) {
                if (!arraySubjectMatter.includes(element.subjectmatter)) {
                    arraySubjectMatter.push(element.subjectmatter);
                }
            }
        }
        // Los imprime por pantalla
        setChargeSubjectMatters(arraySubjectMatter);
    };

    // Cuando el usuario seleccione los temas de la unidad invoca a cargar los tópicos del tema
    useEffect(() => {
        // En caso de que el usuario quiera cambiar el tema de la unidad se realiza un reset de los valores posteriores
        if (subjectMatter != null && topic != null) {
            setChargeTopics(null);
            setTopic(null);
            setDifficulty(null);
            setNumberOfExercises(null);
            enviarDatosAlPadre(null);
        }
        if (subjectMatter != null) handleTopic(subject, subjectMatter);
    }, [subjectMatter]);

    const handleTopic = (subject, subjectMatter) => {
        // Carga los tópicos del tema seleccionado
        let arrayTopics = [];
        for (let element of data) {
            if (subject === element.subject) {
                if (subjectMatter === element.subjectmatter) {
                    if (!arrayTopics.includes(element.topics)) {
                        arrayTopics.push(element.topics);
                    }
                }
            }
        }
        setChargeTopics(arrayTopics);
    };

    // En caso de que el usuario quiera cambiar el tópico se reenvía la información
    useEffect(() => {
        if (topic != null && difficulty != null && numberOfExercises != null) enviarDatosAlPadre(true);
    }, [topic]);

    // En caso de que el usuario quiera cambiar la dificultad se reenvía la información
    useEffect(() => {
        if (difficulty != null && numberOfExercises != null) enviarDatosAlPadre(true);
    }, [difficulty]);

    // En caso de que el usuario quiera cambiar los ejercicios a realizar se reenvía la información
    useEffect(() => {
        if (numberOfExercises != null) enviarDatosAlPadre(true);
    }, [numberOfExercises]);

    // Enviamos los datos al padre listos para ser enviados a la API de OpenAI
    const enviarDatosAlPadre = (reset) => {
        const datos = [subject, subjectMatter, topic, difficulty, numberOfExercises];
        if (subject !== null && subjectMatter !== null && topic !== null && difficulty !== null && numberOfExercises !== null && reset != null) {
            props.enviarDatos(datos);
        } else {
            // Reset tiene el valor de null para que en el padre reciba la información de que no está lista la decisión del usuario
            props.enviarDatos(reset);
        }
    };

    return (
        <div className={styles.topicsContainer}>
            <ButtonToolbar className='mb-3' aria-label="Toolbar with Button groups" data-bs-theme="dark">
                <ButtonGroup className="me-2" aria-label="First group">
                    {
                        chargeSubjects != null && (
                            <DropdownButton variant={subject != null ? "success" : "danger"} id='dropdown-subjects' title={"Unidades"} className={`${styles.topics} ${styles.dropdownBtn}`}>
                                {
                                    chargeSubjects.map((chargeSubject, idx) => {
                                        return <Dropdown.Item key={`group-${idx}`} onClick={() => { setSubject(chargeSubject) }}>{chargeSubject}</Dropdown.Item>
                                    })
                                }
                            </DropdownButton>
                        )
                    }
                    {
                        chargeSubjectMatters != null && (
                            <DropdownButton variant={subjectMatter != null ? "success" : "danger"} id='dropdown-subjectmatters' title={"Temas"} className={`${styles.topics} ${styles.dropdownBtn}`}>
                                {
                                    chargeSubjectMatters.map((chargeSubjectMatter, idx) => {
                                        return <Dropdown.Item key={`group-${idx}`} onClick={() => { setSubjectMatter(chargeSubjectMatter) }}>{chargeSubjectMatter}</Dropdown.Item>
                                    })
                                }
                            </DropdownButton>
                        )
                    }
                    {
                        chargeTopics != null && (
                            <DropdownButton variant={topic != null ? "success" : "danger"} id='dropdown-topics' title={"Tópico"} className={`${styles.topics} ${styles.dropdownBtn}`}>
                                {
                                    chargeTopics.map((chargeTopic, idx) => {
                                        return <Dropdown.Item key={`group-${idx}`} onClick={() => { setTopic(chargeTopic) }}>{chargeTopic}</Dropdown.Item>
                                    })
                                }
                            </DropdownButton>
                        )
                    }
                    {
                        topic != null && (
                            <DropdownButton variant={difficulty != null ? "success" : "danger"} id='dropdown-difficultys' title={"Dificultades"} className={`${styles.topics} ${styles.dropdownBtn}`}>
                                {
                                    chargedifficultys.map((chargedifficulty, idx) => {
                                        return <Dropdown.Item key={`group-${idx}`} onClick={() => { setDifficulty(chargedifficulty) }}>{chargedifficulty}</Dropdown.Item>
                                    })
                                }
                            </DropdownButton>
                        )
                    }
                    {
                        difficulty != null && (
                            <DropdownButton variant={numberOfExercises != null ? "success" : "danger"} id='dropdown-nexercises' title={"Ejercicios"} className={`${styles.topics} ${styles.dropdownBtn}`}>
                                {
                                    chargeExercises.map((chargeExercise, idx) => {
                                        return <Dropdown.Item key={`group-${idx}`} onClick={() => { setNumberOfExercises(chargeExercise) }}>{chargeExercise}</Dropdown.Item>
                                    })
                                }
                            </DropdownButton>
                        )
                    }
                </ButtonGroup>
            </ButtonToolbar>
        </div>
    );
}
