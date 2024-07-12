import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import NavbarApp from "../../components/Navbar/NavbarApp";
import styles from "./Profile.module.css";
import axios from 'axios';


function Profile() {

    // Variables para almacenar los datos de usuario.
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");

    // Variables para almacenar los cambios a datos de usuario.
    const [newFname, setNewFname] = useState("");
    const [newLname, setNewLname] = useState("");
    const [newEmail, setNewEmail] = useState("");

    // Variable para definir cuando debe mostrarse el Modal.
    const [show, setShow] = useState(false);

    // Funciones para definir la visibilidad del Modal.
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    // Funcion para obtener la informacion del usuario
    useEffect(() => {
        if (fname === "") {
            axios.get('http://localhost:3001/userInfo')
                .then(res => {
                    if (res.data.Status === "Success") {
                        setFname(res.data.result[0].fname);
                        setLname(res.data.result[0].lname);
                        setEmail(res.data.result[0].email);
                    } else {
                        setFname("Nombre");
                        setLname("no encontrado");
                        setEmail("Email no encontrado");
                    }
                });
        }
    }, [fname]);

    // Funcion para modificar la informacion del usuario.
    const handleSubmit = (e) => {
        console.log("submited")
        e.preventDefault();
        axios.post('http://localhost:3001/updateUserInfo', {
            fname: newFname,
            lname: newLname,
            email: newEmail
        }).then(res => {
            if (res.data.Status === "Success") {
                setFname(newFname);
                setLname(newLname);
                setEmail(newEmail);
                setNewFname("");
                setNewLname("");
                setNewEmail("");
                handleClose();
            } else {
                alert("Error updating information");
            }
        });
    };

    const volver = () => {
        navigate('/home');
    }

    return (
        <div>
            <NavbarApp />
            <div className={styles.profileContainer}>
                <div className={styles.volverContainer}>
                        <Button variant="success" className={styles.btn} onClick={volver}>
                            <FontAwesomeIcon icon={ faArrowLeft } className={styles.volverIcon}/>
                                <span className={styles.btnText}>Volver</span>
                        </Button>
                </div>
                <div className={styles.card}>
                    <h2 className={styles.title}>Tarjeta de Estudiante</h2>
                    <div className={styles.dataContainer}>
                        <div className={styles.dataSlot}>
                            <div>Nombre Completo: </div>
                            <div className={styles.data}>{fname} {lname}</div>
                        </div>
                        <hr className={styles.hr} />
                        <div className={styles.dataSlot}>
                            <div>Email: </div>
                            <div className={styles.data}>{email}</div>
                        </div>
                        <hr className={styles.hr} />
                    </div>
                    <div className={styles.btnContainer}>
                        <Button variant="success" onClick={handleShow} className={styles.btn}>
                            Editar Información
                        </Button>
                    </div>
                </div>
                <Modal show={show} onHide={handleClose} className={styles.modal}>
                    <Modal.Header closeButton className={styles.modalHeader}>
                        <Modal.Title>Modificar Información</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={styles.modalBody}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nuevo Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newFname}
                                    onChange={(e) => setNewFname(e.target.value)}
                                    className={styles.input}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nuevo Apellido:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newLname}
                                    onChange={(e) => setNewLname(e.target.value)}
                                    className={styles.input}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nuevo Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className={styles.input}
                                />
                            </Form.Group>
                            <Button variant="success" type="submit" className={styles.btn}>
                                Actualizar
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className={styles.modalFooter}>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Profile;
