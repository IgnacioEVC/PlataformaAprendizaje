import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import NavbarApp from '../Navbar/NavbarApp';
import styles from './UserHome.module.css';
import Learning from '../../Images/Icons/Learning.png';
import Plan from '../../Images/Icons/Plan.png';
import Test from '../../Images/Icons/Test.png';

function UserHome () {

    //Variables para almacenar nombre y aprellido del usuario.
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    // Hook para manejar la navegación
    const navigate = useNavigate();

    // Función para manejar el click del botón
    const handleAccessClick = () => {
        navigate('/learn', { state: { fname, lname } });
    }

    //Hook para renderizar el nombre y apellido del usuario.
    useEffect(() => {
        if (fname == "")  (
            //Si la variable fname se encuentra vacia, busca el nombre y apellido del usuario.
            axios.get('http://localhost:3001/userInfo')
            .then(res => {
                if(res.data.Status === "Success"){
                    setFname(res.data.result[0].fname)
                    setLname(res.data.result[0].lname)
                }
                else {
                    setFname("Nombre");
                    setLname("no encontrado")
                }
            })
        )
    }, [])

    return(
        <div>
            <NavbarApp/>
            <div className={styles.userHomeContainer}>
                <div className={styles.welcomeContainer}>
                    <div className={styles.welcome}>
                        <h1>¡Hola, {fname} {lname}!</h1>
                        <h2>Bienvenido a la plataforma de estudio de Fisica</h2>
                        <p>A continuacion tenemos una seleccion de funcionalidades que podran ayudarte a potenciar tu conocimiento en Ciencias Fisicas</p>
                    </div>
                </div>
                <div className={styles.selectionContainer}>
                    <div className={styles.menuContainer}>
                        <h3 className={styles.menuTitle}>Tenemos las siguientes funciones para ti:</h3>
                        <div className={styles.optionsContainer}>
                            <div className={styles.optionsDescription}>
                                <h3 className="font-weight-bold">Profesor Virtual</h3>
                                <img src={Learning} width="50" height="50"></img>
                                <p>Profesor Virtual da accesso a un tutor inteligente potenciado por inteligencia artificial que nos permitira consultar y aprender sobre todas las Unidades de Fisica del curso 1° Medio</p>
                                <Button variant='success' onClick={handleAccessClick} className={styles.btn}>Acceder a Profesor</Button>
                            </div>
                            <div className={styles.optionsDescription}>
                                <h3>Sistema de Ejercitacion</h3>
                                <img src={Test} width="50" height="50"></img>
                                <p>El sistema de ejercitacion da accesso a una cantidad ilimitada de ejercicios gracias a la implementacion de inteligencia artificial. Esta funcionalidad potenciara tu habilidad para resolver ejercicios de Fisica de 1° Medio</p>
                                <Button variant='success' href='/practice' className={styles.btn}>Acceder a Ejercicios</Button>
                            </div>
                            <div className={styles.optionsDescription}>
                                <h3>Guía de Estudio</h3>
                                <img src={Plan} width="50" height="50"></img>
                                <p>Guía de Estudio da accesso a un organizador de conceptos y unidades que permite mantener sesiones de estudio con una estructura que facilite el aprendizaje del estudiante</p>
                                <Button variant='success' href='/guide' className={styles.btn}>Acceder a Guia</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserHome;