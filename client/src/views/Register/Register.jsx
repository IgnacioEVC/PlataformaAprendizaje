import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from 'axios';
import styles from './Register.module.css'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

function Register() {

    //Variables a utilizar en el registro de usuario.
    const [values, setValues] = useState({
        fname: '',
        lname: '',
        email: '',
        role: 'user',
        password: ''
    })

    //Definimos navigate para utilizar useNavigate.
    const navigate = useNavigate()

    //Esta funcion nos permite registrar un usuario.
    const handleSubmit = (event) => {
        event.preventDefault();
        //Se registra los datos de usuario en la base de datos.
        axios.post('http://localhost:3001/register', values)
        .then(res => {
            if(res.data.Status === "Success") {
                toast.success("Usuario Registrado", {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                setTimeout(() => {navigate('/')}, 3000);
            } else {
                toast.error("Error al crear el Usuario", {
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
        .then(err => console.log(err));
    }

    const isDisabled = Object.values(values).some(value => value === '');

    return(
        <div className={styles.registerContainer}>
            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                    <label htmlFor="email">
                        <strong>Nombre</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Ingresa tu Nombre"
                        name="nombre"
                        className={styles.input}
                        minLength={2}
                        onChange={e => setValues({...values, fname: e.target.value})}
                    />
                    </div>
                    <div className={styles.inputContainer}>
                    <label htmlFor="email">
                        <strong>Apellido</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Ingresa tu Apellido"
                        name="nombre"
                        className={styles.input}
                        minLength={2}
                        onChange={e => setValues({...values, lname: e.target.value})}
                    />
                    </div>
                    <div className={styles.inputContainer}>
                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input
                        type="email"
                        placeholder="Ingresa tu Email"
                        name="email"
                        className={styles.input}
                        minLength={2}
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
                        <Button type="submit" variant="success" className={styles.btn} disabled={isDisabled}>
                            Registrate
                        </Button>
                    </div>
                </form><hr/>
                <div>
                    <Link to="/" className={styles.link}>
                        Ya tienes cuenta? Inicia Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;