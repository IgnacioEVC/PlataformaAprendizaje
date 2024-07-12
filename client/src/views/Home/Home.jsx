import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserHome from '../../components/UserHome/UserHome';
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';

function Home () {

    //Variables que permiten confirmar autorizacion de usuario y obtener informacion de este.
    const [role, setRole] = useState("");

    axios.defaults.withCredentials = true;

    //Cuando la pagina carga, confirma la autorizacion del usuario y por consiguiente obtiene la informacion.
    useEffect(() => {
        if (role == "")  (
            //Si la variable fname se encuentra vacia, busca el nombre y apellido del usuario.
            axios.get('http://localhost:3001/userInfo')
            .then(res => {
                if(res.data.Status === "Success"){
                    setRole(res.data.result[0].role)
                    console.log("role: ", res.data.result[0].role)
                }
                else {
                    setRole("No encontrado");
                }
            })
        )
    }, [])

    return(
        <div>
            {role === "user" && <UserHome role={role} />}
            {role === "admin" && <AdminDashboard role={role} />}
        </div>
    )
}

export default Home;