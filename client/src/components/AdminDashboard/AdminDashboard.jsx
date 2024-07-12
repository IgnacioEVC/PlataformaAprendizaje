import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './AdminDashboard.module.css';
import NavbarAdmin from "../NavbarAdmin/NavbarAdmin";
import { Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

function AdminDashboard({ role }) {

    axios.defaults.withCredentials = true;

    //Variable para guardar la tabla de usuarios
    const [data, setData] = useState([]);

    //Variable para definir cuando debe mostrarse el Modal de Modificar Usuario
    const [show, setShow] = useState(false);

    //Variable para definir cuando debe mostrarse el Modal de Eliminar Usuario
    const [showDelete, setShowDelete] = useState(false);

    //Variable que permite definir al usuario al cual queremos modificar o eliminar
    const [currentUser, setCurrentUser] = useState({});

    const [form, setForm] = useState({ fname: '', lname: '', email: '' });

    const navigate = useNavigate();

    //En caso de acceder con un usuario de rol admin, este hook de useEffect obtiene la data de la tabla users.
    useEffect(() => {
        if (role === "admin"){
            if (data.length === 0) {
                axios.get('http://localhost:3001/dashboard')
                    .then(res => {
                        if (res.data.Status === "Success") {
                            setData(res.data.result);
                        } else {
                            console.log("Sin Usuarios");
                        }
                    })
                    .catch(err => {
                        console.error("Error fetching data: ", err);
                    });
            }
        } else {
            toast.error("No eres Administrador", {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }, [data]);

    //Esta funcion realiza la accion DELETE en la base de datos.
    const deleteUser = (uid) => {
        if (role === "admin") {
            axios.delete('http://localhost:3001/deleteUser', { data: { id: uid } })
                .then(res => {
                    if (res.data.Status === "Success") {
                        toast.success("Usuario Eliminado", {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        })
                        setData(data.filter(user => user.iduser !== uid));
                    } else {
                        toast.error(res.data.Error, {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }
                })
                .catch(err => {
                    console.error("Error deleting user: ", err);
                });
        } else {
            toast.error("No eres Administrador", {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    //Esta funcion abre un modal al momento de clickear un Modificar usuario y obtiene su informacion.
    const handleShow = (user) => {
        setCurrentUser(user);
        setForm({ fname: user.fname, lname: user.lname, email: user.email });
        setShow(true);
    };

    //Esta funcion abre un modal al momento de clickear un Eliminar Usuario y obtiene su informacion.
    const handleShowDelete = (user) => {
        setCurrentUser(user);
        setShowDelete(true);
    };

    //Esta funcion permite cerrar el modal Eliminar Usuario.
    const handleClose = () => {
        setShow(false);
        setShowDelete(false);
    };

    //Esta funcion detecta los cambios ingresados en los inputs.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    //Esta funcion elimina el usuario seleccionado en Eliminar Usuario.
    const handleDelete = () => {
        deleteUser(currentUser.iduser);
        handleClose();
    };

    //Esta funcion envia la data modificada a la base de datos.
    const handleSubmit = () => {
        axios.put('http://localhost:3001/updateUser', { id: currentUser.iduser, ...form })
            .then(res => {
                if (res.data.Status === "Success") {
                    toast.success("Usuario Actualizado", {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })
                    setData(data.map(user => user.iduser === currentUser.iduser ? { ...user, ...form } : user));
                    handleClose();
                } else {
                    toast.error(res.data.Error, {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            })
            .catch(err => {
                console.error("Error updating user: ", err);
            });
    };

    const userHistory = (id) => {
        console.log(id);
        navigate(`/historystudents/${id}`);
    }

    return (
        <div>
            <NavbarAdmin />
            <div className={styles.dashboardContainer}>
                <h3 className={styles.title}>Admin Dashboard</h3>
                <div>
                    <div className={styles.optionsContainer}>
                        <h5>Por favor, elija una de las siguientes opciones para revisar su funcionamiento:</h5>
                        <div className={styles.options}>
                            <Button variant='success' href='/learn' className={styles.btn}>Profesor Virtual</Button>
                            <Button variant='success' href='/practice' className={styles.btn}>Ejercitacion</Button>
                            <Button variant='success' href='/guide' className={styles.btn}>Guia de estudio</Button>
                        </div>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <div className={styles.table}>
                        <table>
                            <thead>
                                <tr>
                                    <th className={styles.columnHeaderLeft}>ID</th>
                                    <th className={styles.columnHeaderCenter}>First Name</th>
                                    <th className={styles.columnHeaderCenter}>Last Name</th>
                                    <th className={styles.columnHeaderCenter}>Email</th>
                                    <th className={styles.columnHeaderRight}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((user, i) => (
                                    <tr key={i}>
                                        <td className={styles.columnLeft}>{user.iduser}</td>
                                        <td className={styles.columnCenter}>{user.fname}</td>
                                        <td className={styles.columnCenter}>{user.lname}</td>
                                        <td className={styles.columnCenter}>{user.email}</td>
                                        <td className={styles.columnRight}>
                                            <div className={styles.buttonGroup}>
                                                <Button variant="primary" className={styles.btnActionHistory} onClick={() => userHistory(user.iduser)}>
                                                    <FontAwesomeIcon icon={ faFileLines } />
                                                </Button>
                                                <Button variant="success" className={styles.btnActionUpdate} onClick={() => handleShow(user)}>
                                                    <FontAwesomeIcon icon={ faPen } />
                                                </Button>
                                                <Button variant="danger" className={styles.btnActionDelete} onClick={() => handleShowDelete(user)}>
                                                    <FontAwesomeIcon icon={ faTrashCan } />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} className={styles.modal}>
                <Modal.Header closeButton className={styles.modalHeader}>
                    <Modal.Title className={styles.modalTitle}>Modificar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <Form>
                        <Form.Group controlId="formFname">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="fname" value={form.fname} onChange={handleChange} className={styles.input}/>
                        </Form.Group>
                        <Form.Group controlId="formLname">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lname" value={form.lname} onChange={handleChange} className={styles.input}/>
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} className={styles.input}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleSubmit} className={styles.btn}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDelete} onHide={handleClose} className={styles.modal}>
                <Modal.Header closeButton className={styles.modalHeader}>
                    <Modal.Title className={styles.modalTitle}>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <p>¿Estás seguro que deseas eliminar este usuario?</p>
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminDashboard;
