import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
const salt = 10;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}));

app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: 'pt2db'
})

//Esta funcion nos permite registrar a los usuarios en la base de datos utilizando hash para encryptar la contraseña 
app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (`fname`,`lname`,`email`,`role`,`password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if(err) return res.json({Error: "Error for hashing password"});
        const values = [
            req.body.fname,
            req.body.lname,
            req.body.email,
            req.body.role,
            hash
        ]
        db.query(sql, [values], (err, result) => {
            if(err) return console.log(err), res.json({Error: "Inserting data Error in server"})
            return res.json({Status: "Success"});
        })
    })
})

//Esta funcion nos permite iniciar sesion revisando si la base de datos tiene un mail compatible y comparando la contraseña ingresada, con la contraseña encryptada en la base de datos.
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        //Este if nos permite revisar si hay un error en la conexion
        if(err) return res.json({Error: "Error en el servidor"});
        if(data.length > 0){ 
            //Aqui comparamos la contraseña ingresada con la que se encuentra encryptada en la base de datos
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if(err) return res.json({Error: "Problema al comparar las contraseñas"});
                if(response) {
                    const id = data[0].iduser;
                    const token = jwt.sign({"uid": id}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie("token", token);
                    return console.log("Sesion iniciada"), res.json({Status: "Success"});
                } else {
                    return res.json({Error: "La contraseña no coincide"});
                }
            })
        } else {
            return res.json({Error: "El Email no existe"});
        }
    })
})

app.get('/verify', (req, res) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"})
            } else {
                return res.json({Status: "Success"});
            }
        })
    }
})

//Esta funcion elimina la cookie almacenada en el navegador para cerrar la sesion del usuario
app.get('/logout', (req, res) => {
    res.clearCookie("token");
    return console.log("Sesion Cerrada") ,res.json({Status: "Success"});
})

//Obtiene la informacion del usuario
app.get('/userInfo', (req, res) => {
    const sql = "SELECT * FROM users where iduser = ?";
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json ({Error: "Token is not okay"})
            } else {
                const uid = decoded.uid
                db.query(sql, uid, (err, result) => {
                    if(err){
                        return console.log(err), res.json({Error: "Inserting data Error in server"})
                    }
                    return res.json({Status: "Success", result})
                })
            }
        })
    }
})

app.post('/updateUserInfo', (req, res) => {
    const { fname, lname, email } = req.body;
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "No estas autorizado" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" });
            } else {
                const uid = decoded.uid;
                const sql = "UPDATE users SET fname = ?, lname = ?, email = ? WHERE iduser = ?";
                db.query(sql, [fname, lname, email, uid], (err, result) => {
                    if (err) {
                        return console.log(err), res.json({ Error: "Updating data Error in server" });
                    }
                    return res.json({ Status: "Success" });
                });
            }
        });
    }
});

//Obtiene toda la data de los unidades y topicos
app.get('/guide', (req, res) => {
    const sql = "SELECT * FROM guide";
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"})
            } else {
                db.query(sql, (err, result) => {
                    if(err){
                        return console.log(err), res.json({Error: "Inserting data Error in server"})
                    }
                    return res.json({Status: "Success", result});
                })
            }
        })
    }
});

// Cargar la materia del estudiante.
app.get('/topics', (req, res) => {
    const sql = "SELECT * FROM topics";
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"})
            } else {
                db.query(sql, (err, result) => {
                    if(err){
                        return console.log(err), res.json({Error: "Inserting data Error in server"})
                    }
                    return res.json({Status: "Success", result});
                })
            }
        })
    }
});

// Guardar los ejercicios realizados por el estudiante
app.post('/recordexercises', (req, res) => {
    // Consultas a MYSQL. 
    const sqlRecordExercises = "INSERT INTO records (`userid`,`subject`,`subjectmatter`,`topics`,`difficulty`,`question`,`score`,`totalscore`) VALUES (?)";
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"})
            } else {
                const uid = decoded.uid
                const values = [
                    uid,
                    req.body.subject,
                    req.body.subjectmatter,
                    req.body.topics,
                    req.body.difficulty,
                    req.body.question,
                    req.body.score,
                    req.body.totalscore,
                ]
                db.query(sqlRecordExercises, [values], (err, result) => {
                    if(err){
                        return console.log(err), res.json({Error: "Error in Record Excercise"})
                    }
                    return res.json({Status: "Success"});
                })
            }
        })
    }
})

app.get('/getexercises', (req, res) => {
    const sql = "SELECT * FROM records WHERE userid = ?";
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"})
            } else {
                const uid = decoded.uid
                db.query(sql, uid, (err, result) => {
                    if(err){
                        return console.log(err), res.json({Error: "Inserting data Error in server"})
                    }
                    return res.json({Status: "Success", result});
                })
            }
        })
    }
});

app.get('/dashboard', (req, res) => {
    const sql = "SELECT * FROM users";
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"})
            } else {
                db.query(sql, (err, result) => {
                    if(err){
                        return console.log(err), res.json({Error: "Reading data Error in server"})
                    }
                    return res.json({Status: "Success", result});
                })
            }
        })
    }
});

app.delete('/deleteUser', (req, res) => {
    const sql = `DELETE FROM users WHERE iduser = ?`;
    const usersid = req.body.id;
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "El token no esta correcto"})
            } else {
                db.query(sql, usersid, (err, result) => {
                    if(err){
                        return console.log(err), res.json({Error: "Inserting data Error in server"})
                    }
                    return res.json({Status: "Success", result});
                })
            }
        })
    }
});

app.put('/updateUser', (req, res) => {
    const { id, fname, lname, email } = req.body;
    const sql = "UPDATE users SET fname = ?, lname = ?, email = ? WHERE iduser = ?";
    const token = req.cookies.token;

    if (!token) {
        return res.json({ Error: "No estas autorizado" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "El token no esta correcto" });
            } else {
                db.query(sql, [fname, lname, email, id], (err, result) => {
                    if (err) {
                        return console.log(err), res.json({ Error: "Error updating data in server" });
                    }
                    return res.json({ Status: "Success", result });
                });
            }
        });
    }
});

app.get('/getexercisesAdmin', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM records WHERE userid = ?";
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estas autorizado"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"})
            } else {
                db.query(sql, [userId], (err, result) => {
                    if(err){
                        return console.log(err), res.json({Error: "Delete Data User Error"})
                    }
                    return res.json({Status: "Success", result});
                })
            }
        })
    }
});

//Esto nos permite revisar si el servidor se encuentra funcionando
app.listen(3001, () => {
    console.log("Server running...")
})