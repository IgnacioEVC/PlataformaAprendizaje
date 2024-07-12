import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from 'axios';
import styles from './Login.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

function LogIn() {

    //Variables a utilizar en el login de usuario.
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    //Definimos navigate para utilizar useNavigate.
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;

    //Esta funcion permite loguear al usuario comparando el input ingresado con la informacion almacenada en la base de datos.
    const handleSubmit = (event) => {
        event.preventDefault();
        //Enviamos la data para comparar con la almacenada.
        axios.post('http://localhost:3001/login', values)
        .then(res => {
            if(res.data.Status === "Success") {
                toast.success("Sesión Iniciada", {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                setTimeout(() => {navigate('/home')}, 3000);
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
    }

    return(
        <div>
            <div className={styles.loginContainer}>
                <div className={styles.welcomeContainer}>
                    <h1 className={styles.welcomeTitle}>¡Bienvenido a la plataforma de estudio de Fisica para 1° Medio!</h1>
                    <p className={styles.welcomeText}>Para poder acceder a todas las funcionalidades, por favor inicia sesion. En caso de no tener una cuenta, selecciona la opcion que se encuentra al final del formulario para Registrarte</p>
                </div>
                <div className={styles.formContainer}>
                    <h2 className={styles.formTitle}>Inicia Sesión</h2>
                    <form onSubmit={handleSubmit}>
                            <div className={styles.inputContainer}>
                            <label htmlFor="email">
                                <strong>Email</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Ingresa tu Email"
                                name="email"
                                className={styles.input}
                                onChange={e => setValues({...values, email: e.target.value})}
                            />
                            </div>
                            <div className={styles.inputContainer}>
                            <label htmlFor="email">
                                <strong>Contraseña</strong>
                            </label>
                            <input
                                type="password"
                                placeholder="Ingresa una Contraseña"
                                name="contraseña"
                                className={styles.input}
                                onChange={e => setValues({...values, password: e.target.value})}
                            />
                            </div>
                            <div className={styles.btnContainer}>
                                <Button type="submit" variant="success" className={styles.btn}>
                                    Iniciar Sesión
                                </Button>
                            </div>
                    </form><hr/>
                    <div>
                        <Link to="/register" className={styles.link}>
                            ¿Aun no tienes una cuenta? Registrate
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.footerContainer}>
                Imagen de las antenas ALMA ubicadas en el Llano de Chajnantor, Atacama.
                <a href="https://www.almaobservatory.org/es/16-atacama2024_0424_220326-9854_agp-edit-2/" target="_blank" rel="noopener noreferrer" className={styles.linkFooter}>Click aqui para acceder a la galeria de fotos del Observatorio ALMA</a>
            </div>
        </div>
    );
}

export default LogIn;