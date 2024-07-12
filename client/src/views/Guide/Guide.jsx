import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarApp from "../../components/Navbar/NavbarApp";
import { studyRecomendations } from "../../OpenAI/StudyRecomendation";
import { Button, ButtonToolbar, Dropdown, DropdownButton, ButtonGroup, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GuideList from "../../components/GuideList/GuideList";
import axios from "axios";
import styles from "./Guide.module.css"

function Guide () {

    // Response de MYSQL
    const [data, setData] = useState([])

    // Manejo de Informacion del Response de MYSQL
    const [chargeSubjects, setChargeSubjects] = useState(null)

    // Valores que selecciona el usuario
    const [subject, setSubject] = useState(null)
    const [topic, setTopic] = useState()

    // Variable para almacenar e imprimir la guia de estudio obtenida por la API OpenAI
    const [list, setList] = useState({
        "Guia de estudio": "",
        Pasos: []
    })

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        const res = await studyRecomendations(topic);
        console.log("Topico Enviado:", topic);
        setList(JSON.parse(res));
        setShowModal(true);  // Mostrar el modal
        console.log(list);
        setLoading(false);
    }

    const handleClose = () => setShowModal(false);

    const handleSubjectMatter = (subject) => {
        // Carga los temas de la unidad seleccionada
        let arraySubjectMatter = []
        for (let element of data) {
            if (subject === element.title) {
                if (!arraySubjectMatter.includes(element.description)) {
                    arraySubjectMatter.push(element.description)
                }
            }
        }
        // Los Imprime por pantalla
        console.log(arraySubjectMatter[0]);
        setTopic(arraySubjectMatter[0])
    };

    axios.defaults.withCredentials = true;

    // Solicitar el material de estudio a MYSQL
    useEffect(() => {
        if (data.length === 0) {
            axios.get('http://localhost:3001/guide')
            .then(res => {
                if (res.data.Status === "Success") {
                    // Guardamos la informacion entregada por MYSQL para poder trabajarla
                    setData(res.data.result)
                    // Buscamos las materias disponibles
                    let arraySubject = []
                    for (let element of res.data.result) {
                        if (!arraySubject.includes(element.title)) {
                            arraySubject.push(element.title)
                        }
                    }
                    // Imprimimos las unidades encontradas en pantalla
                    setChargeSubjects(arraySubject)
                } else {
                    console.log("Sin Nombre");
                }
            })
        }
    }, [])

    // Cuando el usuario seleccione la unidad invoca a cargar los temas de la unidad
    useEffect(() => {
        // En caso de que el usuario quiera cambiar la unidad se realiza un reset de los valores posteriores
        if (subject != null) handleSubjectMatter(subject);
    }, [subject]);

    const volver = () => {
        navigate('/home');
    }

    return (
        <div>
            <NavbarApp />
            <div className={styles.guideContainer}>
                <div className={styles.volverContainer}>
                    <Button variant="success" className={styles.btn} onClick={volver}>
                        <FontAwesomeIcon icon={faArrowLeft} className={styles.volverIcon} />
                        <span className={styles.btnText}>Volver</span>
                    </Button>
                </div>
                <div className={styles.guideFormContainer}>
                    <div className={styles.guideForm}>
                        <h2 className={styles.title}>Selecciona un tópico para generar una guia de estudio</h2>
                        <ButtonToolbar className='mb-3' aria-label="Toolbar with Button groups" data-bs-theme="dark">
                            <ButtonGroup className="me-2" aria-label="First group">
                                {
                                    chargeSubjects != null && (
                                        <DropdownButton variant={subject != null ? "success" : "danger"} id='dropdown-subjects' title={"Tópicos"}>
                                            {
                                                chargeSubjects.map((chargeSubject, idx) => {
                                                    return <Dropdown.Item key={`group-${idx}`} onClick={() => { setSubject(chargeSubject) }}>{chargeSubject}</Dropdown.Item>
                                                })
                                            }
                                        </DropdownButton>
                                    )
                                }
                            </ButtonGroup>
                        </ButtonToolbar>
                        <h3>Topico Seleccionado:</h3>
                        <div className={styles.seleccion}> {topic || "Ninguno"} </div>
                        <div className={styles.btnContainer}>
                            <Button variant="success" onClick={handleSend} disabled={!topic || loading} className={styles.btn}>
                                {loading ? "Cargando..." : "Generar"}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={styles.modalContainer}>
                    <Modal show={showModal} onHide={handleClose} centered dialogClassName={styles.modalCustom}>
                        <Modal.Header closeButton className={styles.modalHeaderCustom}>
                            <Modal.Title>Guía de Estudio</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={styles.modalBodyCustom}>
                            <GuideList guide={list} />
                        </Modal.Body>
                        <Modal.Footer className={styles.modalFooterCustom}>
                            <Button variant="secondary" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )

}

export default Guide;
