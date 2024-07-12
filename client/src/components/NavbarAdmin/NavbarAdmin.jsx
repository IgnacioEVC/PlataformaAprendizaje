import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropDown from "react-bootstrap/NavDropdown"
import styles from "./NavbarAdmin.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Brand from '../../Images/Icons/Logo.svg'

function NavbarAdmin () {

    axios.defaults.withCredentials = true;

    //Esta variable permite al que la funcion handleLogout redirija a la pagina de Inicio de Sesion
    const navigate = useNavigate()

    //Esta funcion permite al usuario cerrar su sesion
    const handleLogout = () => {
        axios.get('http://localhost:3001/logout')
        .then(res => {
            toast.error("Cerrando Sesión", {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setTimeout(() => {navigate('/')}, 3000);
        }).catch(err => console.log(err));
    }

    return(
        <Navbar data-bs-theme="dark" className={styles.navBar}>
            <Container fluid>
                <Navbar.Brand href="/home" className={styles.brand}>
                    <img
                        src={Brand}
                        className={styles.brandLogo}
                    />
                    Fisica
                </Navbar.Brand>
            <NavDropDown align="end" title="Opciones" id="basic-nav-dropdown">
                <NavDropDown.Item href="/profile">Perfil</NavDropDown.Item>
                <NavDropDown.Item onClick={()=>handleLogout()}>Cerrar Sesión</NavDropDown.Item>
            </NavDropDown>
            </Container>
            <ToastContainer/>
        </Navbar>
    )
}

export default NavbarAdmin;